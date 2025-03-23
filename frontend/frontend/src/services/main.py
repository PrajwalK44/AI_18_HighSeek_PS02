from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
import logging
import os
from fastapi.middleware.cors import CORSMiddleware
import motor.motor_asyncio
from bson import ObjectId

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://localhost:27017")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.erp_assistant
faqs_collection = db.faqs
escalations_collection = db.escalations
faq_cache_collection = db.faq_cache

# Helper class for PyObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Chat request model
class ChatRequest(BaseModel):
    message: str
    department: str  # Add department directly to request

class ChatResponse(BaseModel):
    response: str
    source: str
    llm_reply: Optional[str] = None  # Add LLM reply field
    faq_used: Optional[bool] = None   # Add FAQ usage indicator
    confidence: Optional[float] = None

# FAQ Model
class FAQModel(BaseModel):
    id: Optional[int] = None
    question: str
    answer: str
    department: str
    tags: List[str]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# LLM initialization
def get_llm():
    GROQ_API_KEY = "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"
    if GROQ_API_KEY:
        try:
            return ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.3-70b-versatile")
        except Exception as e:
            logger.error(f"Error initializing LLM: {str(e)}")
            return MockLLM()
    return MockLLM()

class MockLLM:
    def invoke(self, prompt):
        class Response:
            def __init__(self, content):
                self.content = content
        if "Sales" in prompt:
            return Response("Current quarterly target is $1M")
        elif "HR" in prompt:
            return Response("Consult employee handbook")
        elif "Finance" in prompt:
            return Response("Fiscal year ends December 31st")
        else:
            return Response("Please check department documentation")

llm = get_llm()

system_prompt = """You are an enterprise ERP assistant. Follow these rules:
1. Use FAQs from knowledge base when available
2. For department-specific queries, provide general answers
3. Escalate unclear queries with confidence < 0.8
4. Maintain professional tone"""

# Core chatbot functions
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

async def get_faq_response(query: str, department: str) -> Optional[dict]:
    """
    Returns a dictionary with 'answer' and 'score' if a match is found, otherwise None
    """
    logger.info(f"FAQ lookup: query='{query}', department='{department}'")
    
    # Check cache first
    cache_key = f"faq:{department}:{query.lower().strip()}"
    cached_result = await faq_cache_collection.find_one({"key": cache_key})
    if cached_result:
        logger.info(f"Cache hit for key: {cache_key}")
        return {"answer": cached_result["answer"], "score": 1.0}
    else:
        logger.info(f"Cache miss for key: {cache_key}")
    
    # First try direct string matching (case insensitive)
    try:
        logger.info(f"Attempting exact match with regex: '^{query}$' in department '{department}'")
        exact_match_query = {
            "department": department,
            "question": {"$regex": f"^{query}$", "$options": "i"}
        }
        logger.info(f"Exact match query: {str(exact_match_query)}")
        
        exact_match = await faqs_collection.find_one(exact_match_query)
        
        if exact_match:
            logger.info(f"Exact match found: {exact_match['question']}")
            # Save to cache and return with perfect score
            await faq_cache_collection.insert_one({
                "key": cache_key,
                "answer": exact_match["answer"],
                "created_at": datetime.utcnow()
            })
            return {"answer": exact_match["answer"], "score": 1.0}
        else:
            logger.info("No exact match found")
    except Exception as e:
        logger.error(f"Error during exact match search: {str(e)}")

    # If no exact match, proceed with similarity search
    try:
        logger.info(f"Fetching all FAQs for department '{department}' for similarity search")
        cursor = faqs_collection.find({"department": department})
        faqs = await cursor.to_list(length=100)
        logger.info(f"Found {len(faqs)} FAQs in department '{department}'")

        if not faqs:
            logger.info(f"No FAQs found for department '{department}'")
            return None

        # Prepare data for similarity calculation
        questions = [faq["question"] for faq in faqs]
        answers = [faq["answer"] for faq in faqs]
        
        # Log a few questions for debugging
        if questions:
            sample_questions = questions[:min(3, len(questions))]
            logger.info(f"Sample questions in database: {sample_questions}")

        # Compute TF-IDF vectors
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(questions + [query])

        # Calculate cosine similarity between the query and all FAQs
        query_vector = tfidf_matrix[-1]  # Last vector is the query
        faq_vectors = tfidf_matrix[:-1]  # All vectors except the last are FAQs
        similarities = cosine_similarity(query_vector, faq_vectors).flatten()

        # Find the best match
        best_match_index = np.argmax(similarities)
        best_score = similarities[best_match_index]

        logger.info(f"Best similarity score: {best_score} for question: '{questions[best_match_index]}'")

        # Return with the similarity score
        if best_score > 0.5:
            best_answer = answers[best_match_index]
            logger.info(f"Similarity match found above threshold (0.5)")

            # Save to cache
            await faq_cache_collection.insert_one({
                "key": cache_key,
                "answer": best_answer,
                "created_at": datetime.utcnow()
            })
            return {"answer": best_answer, "score": best_score}
        else:
            logger.info(f"Best similarity score {best_score} below threshold (0.5)")
    except Exception as e:
        logger.error(f"Error during similarity search: {str(e)}")

    logger.info("No matching FAQ found")
    return None

def calculate_confidence(response: str, query: str) -> float:
    try:
        prompt = ChatPromptTemplate.from_template(
            """Rate confidence (0-1) that this response answers the query:
            Query: {query}
            Response: {response}
            Score:"""
        )
        chain = prompt | llm | StrOutputParser()
        result = chain.invoke({"query": query, "response": response})
        return float(result.strip())
    except:
        return 0.7

# API Endpoints
@app.get("/escalations", response_model=List[Dict])
async def get_escalations():
    escalations = []
    cursor = escalations_collection.find()
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
        escalations.append(doc)
    return escalations

@app.get("/faqs", response_model=List[Dict])
async def get_faqs():
    faqs = []
    cursor = faqs_collection.find()
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
        faqs.append(doc)
    return faqs

@app.post("/faqs", response_model=Dict)
async def create_faq(faq: FAQModel):
    # Get the next ID
    last_faq = await faqs_collection.find_one({}, sort=[("id", -1)])
    next_id = 1 if not last_faq else last_faq["id"] + 1
    
    faq_dict = faq.dict()
    faq_dict["id"] = next_id
    
    result = await faqs_collection.insert_one(faq_dict)
    
    # Clear cache after adding new FAQ
    await faq_cache_collection.delete_many({})
    
    created_faq = await faqs_collection.find_one({"_id": result.inserted_id})
    created_faq["_id"] = str(created_faq["_id"])
    return created_faq

@app.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: int):
    result = await faqs_collection.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"FAQ with ID {faq_id} not found")
    
    # Clear cache after deleting FAQ
    await faq_cache_collection.delete_many({})
    
    return {"status": "success"}

@app.post("/chat", response_model=ChatResponse)
async def process_chat_message(request: ChatRequest):
    try:
        logger.info(f"Received chat request: message='{request.message}', department='{request.department}'")
        
        # Step 1: Check if a similar FAQ exists
        faq_result = await get_faq_response(request.message, request.department)
        
        # If FAQ answer exists, return it directly without escalation
        if faq_result:
            logger.info(f"FAQ match found with score: {faq_result['score']}")
            return ChatResponse(
                response=faq_result["answer"],
                source="knowledge_base",
                llm_reply=None,  # No LLM reply needed
                faq_used=True,
                confidence=faq_result["score"]
            )
        else:
            logger.info("No FAQ match found, proceeding with LLM")

        # Step 2: If FAQ answer is not found, proceed with LLM
        # Build base prompt
        prompt = f"{system_prompt}\nQuery: {request.message}\nDepartment: {request.department}"

        # Generate LLM response
        logger.info("Generating LLM response")
        llm_reply = llm.invoke(prompt).content
        
        # Calculate confidence of LLM response
        confidence = calculate_confidence(llm_reply, request.message)
        logger.info(f"LLM confidence score: {confidence}")

        # Step 3: Escalate only if confidence is low
        if confidence < 0.8:
            logger.info(f"Low confidence ({confidence} < 0.8). Escalating.")
            await escalations_collection.insert_one({
                "query": request.message,
                "department": request.department,
                "timestamp": datetime.utcnow(),
                "llm_reply": llm_reply  # Store LLM reply with escalation
            })
            return ChatResponse(
                response=f"Escalated to support team. Initial AI response: {llm_reply}",
                source="escalated",
                llm_reply=llm_reply,
                faq_used=False,
                confidence=confidence
            )

        # Step 4: Regular LLM response (FAQ not found, but confidence is high)
        logger.info(f"Using LLM response with confidence: {confidence}")
        return ChatResponse(
            response=llm_reply,
            source="llm",
            llm_reply=llm_reply,
            faq_used=False,
            confidence=confidence
        )

    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        return ChatResponse(
            response=f"Sorry, I encountered an error processing your request: {str(e)}",
            source="error"
        )

# Add a diagnostic endpoint to check database connection and content
@app.get("/diagnostic/faqs")
async def diagnostic_faqs():
    try:
        # Count total FAQs
        total_count = await faqs_collection.count_documents({})
        
        # Get sample FAQs
        cursor = faqs_collection.find().limit(5)
        samples = await cursor.to_list(length=5)
        
        # Convert ObjectIds to strings for JSON serialization
        for sample in samples:
            sample["_id"] = str(sample["_id"])
        
        return {
            "status": "success",
            "db_connected": True,
            "total_faqs": total_count,
            "samples": samples
        }
    except Exception as e:
        logger.error(f"Database diagnostic error: {str(e)}")
        return {
            "status": "error",
            "db_connected": False,
            "error": str(e)
        }
# Initialize database with sample data if empty
@app.on_event("startup")
async def startup_db_client():
    try:
        # Check if FAQs collection is empty
        count = await faqs_collection.count_documents({})
        if count == 0:
            # Insert sample data - you can remove this in production
            sample_faq = {
                "id": 1,
                "question": "How do I request vacation time?",
                "answer": "Login to the HR portal...",
                "department": "HR",
                "tags": ["vacation", "time off"]
            }
            await faqs_collection.insert_one(sample_faq)
            
            # Add the Finance example you provided
            finance_faq = {
                "id": 13,
                "question": "How does IDMS handle Input Tax Credit (ITC)?",
                "answer": "IDMS maintains a ledger of ITC claims and reconciles them with GSTR-2A data to ensure accurate tax credits.",
                "department": "Finance",
                "tags": ["ITC", "Tax Credits", "Reconciliation"]
            }
            await faqs_collection.insert_one(finance_faq)
            
        logger.info("Database connected and initialized")
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8003)
    print("Running on http://127.0.0.1:8003")