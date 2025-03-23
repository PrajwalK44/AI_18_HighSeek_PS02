from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Union
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
# New collection for chat history
chat_history_collection = db.chat_history

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

# User model
class User(BaseModel):
    username: str
    department: str
    user_id: Optional[str] = None

# Message model for chat history
class MessageModel(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: str
    source: Optional[str] = None
    confidence: Optional[float] = None
    isError: Optional[bool] = None

# Chat history model
class ChatHistoryModel(BaseModel):
    user_id: str
    messages: List[MessageModel]
    last_updated: datetime

# Chat request model
class ChatRequest(BaseModel):
    message: str
    department: str
    username: str  # Add username to identify the user
    user_id: Optional[str] = None  # Optional user_id

class ChatResponse(BaseModel):
    response: str
    source: str
    llm_reply: Optional[str] = None
    faq_used: Optional[bool] = None
    confidence: Optional[float] = None
    chat_history_id: Optional[str] = None  # Add chat history ID to response

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

# Chat history request model
class ChatHistoryRequest(BaseModel):
    user_id: str

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
    
    try:
        # First try exact match
        exact_match_query = {
            "department": department,
            "question": {"$regex": f"^{query}$", "$options": "i"}
        }
        exact_match = await faqs_collection.find_one(exact_match_query)
        
        if exact_match:
            return {"answer": exact_match["answer"], "score": 1.0}

        # If no exact match, do similarity search
        cursor = faqs_collection.find({"department": department})
        faqs = await cursor.to_list(length=100)

        if not faqs:
            return None

        # Prepare data for similarity calculation
        questions = [faq["question"] for faq in faqs]
        answers = [faq["answer"] for faq in faqs]
        
        # Compute TF-IDF vectors
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(questions + [query])
        
        # Calculate cosine similarity
        query_vector = tfidf_matrix[-1]
        faq_vectors = tfidf_matrix[:-1]
        similarities = cosine_similarity(query_vector, faq_vectors).flatten()
        
        # Find best match
        best_match_index = np.argmax(similarities)
        best_score = similarities[best_match_index]

        # Return if confidence is high (above 0.8)
        if best_score > 0.8:
            return {
                "answer": answers[best_match_index],
                "score": best_score,
                "question": questions[best_match_index]
            }

    except Exception as e:
        logger.error(f"Error in FAQ lookup: {str(e)}")
    
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

# Function to get or create a user's chat history
async def get_or_create_chat_history(username: str, department: str) -> str:
    # Create a consistent user_id from username and department
    user_id = f"{username.lower()}_{department.lower()}"
    
    # Look up existing chat history
    chat_history = await chat_history_collection.find_one({"user_id": user_id})
    
    if not chat_history:
        # Create a new chat history with welcome message
        welcome_message = {
            "role": "assistant",
            "content": f"Hello {username}! I'm your AI assistant for {department}. How can I help you today?",
            "timestamp": datetime.utcnow().isoformat(),
            "source": "system"
        }
        
        new_history = {
            "user_id": user_id,
            "username": username,
            "department": department,
            "messages": [welcome_message],
            "last_updated": datetime.utcnow()
        }
        
        result = await chat_history_collection.insert_one(new_history)
        return str(result.inserted_id)
    
    return str(chat_history["_id"])

# Function to add messages to chat history
async def add_to_chat_history(user_id: str, messages: List[Dict]) -> None:
    await chat_history_collection.update_one(
        {"user_id": user_id},
        {
            "$push": {"messages": {"$each": messages}},
            "$set": {"last_updated": datetime.utcnow()}
        }
    )

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
        logger.info(f"Received chat request: message='{request.message}', department='{request.department}', username='{request.username}'")
        
        # Create or get user's chat history
        user_id = f"{request.username.lower()}_{request.department.lower()}"
        chat_history_id = await get_or_create_chat_history(request.username, request.department)
        
        # Add user message to chat history
        user_message = {
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat()
        }
        await add_to_chat_history(user_id, [user_message])
        
        # Step 1: Check if a similar FAQ exists
        faq_result = await get_faq_response(request.message, request.department)
        
        if faq_result and faq_result["score"] > 0.8:
            logger.info(f"High confidence FAQ match found: {faq_result['score']}")
            
            assistant_message = {
                "role": "assistant",
                "content": faq_result["answer"],
                "timestamp": datetime.utcnow().isoformat(),
                "source": "knowledge_base",
                "confidence": faq_result["score"]
            }
            
            await add_to_chat_history(user_id, [assistant_message])
            
            return ChatResponse(
                response=faq_result["answer"],
                source="knowledge_base",
                faq_used=True,
                confidence=faq_result["score"],
                chat_history_id=chat_history_id
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
                "user_id": user_id,
                "username": request.username,
                "timestamp": datetime.utcnow(),
                "llm_reply": llm_reply  # Store LLM reply with escalation
            })
            
            escalated_response = f"Escalated to support team. Initial AI response: {llm_reply}"
            
            # Create assistant response for chat history
            assistant_message = {
                "role": "assistant",
                "content": escalated_response,
                "timestamp": datetime.utcnow().isoformat(),
                "source": "escalated",
                "confidence": confidence
            }
            
            # Add to chat history
            await add_to_chat_history(user_id, [assistant_message])
            
            return ChatResponse(
                response=escalated_response,
                source="escalated",
                llm_reply=llm_reply,
                faq_used=False,
                confidence=confidence,
                chat_history_id=chat_history_id
            )

        # Step 4: Regular LLM response (FAQ not found, but confidence is high)
        logger.info(f"Using LLM response with confidence: {confidence}")
        
        # Create assistant response for chat history
        assistant_message = {
            "role": "assistant",
            "content": llm_reply,
            "timestamp": datetime.utcnow().isoformat(),
            "source": "llm",
            "confidence": confidence
        }
        
        # Add to chat history
        await add_to_chat_history(user_id, [assistant_message])
        
        return ChatResponse(
            response=llm_reply,
            source="llm",
            llm_reply=llm_reply,
            faq_used=False,
            confidence=confidence,
            chat_history_id=chat_history_id
        )

    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        error_response = f"Sorry, I encountered an error processing your request: {str(e)}"
        
        # Try to add error message to chat history if possible
        try:
            if request and hasattr(request, 'username') and hasattr(request, 'department'):
                user_id = f"{request.username.lower()}_{request.department.lower()}"
                error_message = {
                    "role": "assistant",
                    "content": error_response,
                    "timestamp": datetime.utcnow().isoformat(),
                    "source": "error",
                    "isError": True
                }
                await add_to_chat_history(user_id, [error_message])
        except Exception as hist_err:
            logger.error(f"Failed to add error to chat history: {str(hist_err)}")
        
        return ChatResponse(
            response=error_response,
            source="error"
        )

# New endpoint to get chat history for a user
@app.get("/chat-history/{user_id}", response_model=Dict)
async def get_chat_history(user_id: str):
    chat_history = await chat_history_collection.find_one({"user_id": user_id})
    
    if not chat_history:
        raise HTTPException(status_code=404, detail=f"Chat history for user {user_id} not found")
    
    # Convert ObjectId to string for JSON response
    chat_history["_id"] = str(chat_history["_id"])
    
    return chat_history

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
                "answer": "Login to the HR portal and navigate to 'Time Off Request'. Fill out the form with your desired dates and submit for approval.",
                "department": "HR",
                "tags": ["vacation", "time off"]
            }
            await faqs_collection.insert_one(sample_faq)
            
            # Add the Finance example
            finance_faq = {
                "id": 13,
                "question": "How does IDMS handle Input Tax Credit (ITC)?",
                "answer": "IDMS maintains a ledger of ITC claims and reconciles them with GSTR-2A data to ensure accurate tax credits.",
                "department": "Finance",
                "tags": ["ITC", "Tax Credits", "Reconciliation"]
            }
            await faqs_collection.insert_one(finance_faq)
            
            # Add a Sales example
            sales_faq = {
                "id": 24,
                "question": "What are our current sales targets?",
                "answer": "Current quarterly sales targets are $1.2M for domestic and $800K for international markets. Check the Sales Dashboard for your personal targets.",
                "department": "Sales",
                "tags": ["targets", "quotas", "goals"]
            }
            await faqs_collection.insert_one(sales_faq)
            
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