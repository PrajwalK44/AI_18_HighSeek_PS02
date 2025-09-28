# Core Connect - ERP AI Assistant

## 🚀 Project Overview

Core Connect is an intelligent Enterprise Resource Planning (ERP) AI assistant designed to revolutionize how employees interact with company data and processes. Built with modern technologies, it provides instant, accurate responses to employee queries across different departments while maintaining security and efficiency.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI +    │◄──►│   (MongoDB)     │
│                 │    │    Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Features      │    │   AI Engine     │    │   Collections   │
│ • Chat Interface│    │ • LLM (Groq)    │    │ • FAQs          │
│ • Admin Panel   │    │ • NLP Processing│    │ • Chat History  │
│ • User Mgmt     │    │ • Confidence    │    │ • Escalations   │
│ • Analytics     │    │   Scoring       │    │ • Metrics       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Key Features

### 🔐 Multi-Role Authentication
- **Admin Users**: Full system access including user management, FAQ management, analytics
- **Department Users**: Role-based access to relevant information
- **Auth0 Integration**: Secure OAuth2 authentication with JWT tokens
- **Local Authentication**: Fallback authentication system

### 🤖 Intelligent AI Query Processing
- **Multi-Source Response Generation**: FAQ database, LLM inference, ERP integration
- **Smart Escalation**: Automatic escalation for low-confidence responses
- **Department-Specific Responses**: Tailored responses based on user department
- **Confidence Scoring**: AI-powered confidence assessment for response quality

### 📊 Advanced Analytics & Monitoring
- **Real-time Metrics**: Department-wise query analytics
- **Escalation Tracking**: Monitor queries requiring human intervention
- **Usage Patterns**: Track system usage across departments
- **Performance Insights**: Response accuracy and user satisfaction metrics

### 💬 Enhanced Chat Experience
- **Persistent Chat History**: Conversation continuity across sessions
- **Voice Input/Output**: Speech-to-text and text-to-speech capabilities
- **Smart Suggestions**: Context-aware query suggestions
- **Multi-Modal Interface**: Text, voice, and visual interactions

## 🧠 AI Query Handling System - Deep Dive

### Query Processing Pipeline

The AI system processes queries through a sophisticated 4-stage pipeline:

#### Stage 1: FAQ Knowledge Base Lookup
```python
async def get_faq_response(query: str, department: str) -> Optional[dict]:
    # 1. Exact Match Search
    exact_match = await faqs_collection.find_one({
        "department": department,
        "question": {"$regex": f"^{query}$", "$options": "i"}
    })
    
    # 2. Semantic Similarity Search using TF-IDF
    if not exact_match:
        # Compute cosine similarity between query and FAQ questions
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(questions + [query])
        similarities = cosine_similarity(query_vector, faq_vectors)
        
        # Return if confidence > 0.8
        if best_score > 0.8:
            return {"answer": answer, "score": best_score}
```

**How it works:**
1. **Exact Match**: First attempts to find exact question matches in the department's FAQ database
2. **Semantic Search**: Uses TF-IDF vectorization and cosine similarity to find semantically similar questions
3. **Confidence Threshold**: Only returns FAQ responses with confidence scores above 0.8
4. **Department Filtering**: Searches only within the user's department for relevant answers

#### Stage 2: LLM Processing
```python
def get_llm():
    # Uses Groq's Llama-3.3-70B model for advanced reasoning
    return ChatGroq(
        groq_api_key="your_api_key", 
        model_name="llama-3.3-70b-versatile"
    )

# System prompt engineering
system_prompt = """You are an enterprise ERP assistant. Follow these rules:
1. Use FAQs from knowledge base when available
2. For department-specific queries, provide general answers
3. Escalate unclear queries with confidence < 0.8
4. Maintain professional tone"""
```

**LLM Processing Features:**
- **Large Language Model**: Utilizes Groq's Llama-3.3-70B for sophisticated reasoning
- **Context Awareness**: Incorporates user department and query context
- **Prompt Engineering**: Carefully crafted system prompts for consistent, professional responses
- **Fallback Mechanism**: Mock LLM responses when API is unavailable

#### Stage 3: Confidence Assessment
```python
def calculate_confidence(response: str, query: str) -> float:
    prompt = ChatPromptTemplate.from_template(
        """Rate confidence (0-1) that this response answers the query:
        Query: {query}
        Response: {response}
        Score:"""
    )
    chain = prompt | llm | StrOutputParser()
    result = chain.invoke({"query": query, "response": response})
    return float(result.strip())
```

**Confidence Scoring Process:**
1. **Response Evaluation**: AI analyzes how well the generated response addresses the original query
2. **Numerical Scoring**: Returns confidence score between 0.0 and 1.0
3. **Quality Assurance**: Ensures only high-quality responses reach users
4. **Escalation Trigger**: Scores below 0.8 trigger automatic escalation

#### Stage 4: Smart Escalation System
```python
# Escalation logic
if confidence < 0.8:
    await escalations_collection.insert_one({
        "query": request.message,
        "department": request.department,
        "user_id": user_id,
        "username": request.username,
        "timestamp": datetime.utcnow(),
        "llm_reply": llm_reply
    })
    
    escalated_response = f"Escalated to support team. Initial AI response: {llm_reply}"
```

**Escalation Features:**
- **Automatic Detection**: Identifies queries requiring human intervention
- **Context Preservation**: Stores original query, user info, and initial AI response
- **Admin Dashboard**: Provides admins with escalated queries requiring attention
- **Response Transparency**: Shows users that their query has been escalated

### Response Sources

The system provides responses from multiple sources, clearly labeled for transparency:

1. **knowledge_base**: High-confidence FAQ matches
2. **llm**: AI-generated responses with high confidence
3. **escalated**: Low-confidence queries forwarded to human support
4. **erp**: Direct ERP system data (future enhancement)
5. **error**: System error responses

### Chat History & Continuity

```python
async def get_or_create_chat_history(username: str, department: str) -> str:
    user_id = f"{username.lower()}_{department.lower()}"
    
    # Look up existing chat history
    chat_history = await chat_history_collection.find_one({"user_id": user_id})
    
    if not chat_history:
        # Create new history with welcome message
        welcome_message = {
            "role": "assistant",
            "content": f"Hello {username}! I'm your AI assistant for {department}.",
            "timestamp": datetime.utcnow().isoformat(),
            "source": "system"
        }
        # Save to database...
```

**Chat History Features:**
- **Persistent Storage**: All conversations stored in MongoDB
- **User-Specific**: Separate chat histories for each user
- **Cross-Session**: Conversations continue across browser sessions
- **Message Metadata**: Timestamps, sources, and confidence scores stored

## 🛠️ Technology Stack

### Frontend (React + TypeScript)
```json
{
  "core": ["React 18.3.1", "TypeScript 5.5.3", "Vite 5.4.2"],
  "styling": ["Tailwind CSS", "Custom CSS Animations", "Lucide Icons"],
  "features": ["Auth0 Integration", "Voice APIs", "Responsive Design"],
  "state": ["React Hooks", "Local Storage", "Context Management"]
}
```

### Backend Services

#### FastAPI Service (Port 8003)
```python
# Main AI processing service
- LLM Integration (Groq/Llama-3.3-70B)
- MongoDB Operations
- Chat History Management
- Escalation Processing
- FAQ Similarity Search
```

#### Express.js Service (Port 5000)
```javascript
// API and database service
- FAQ CRUD Operations
- User Management
- Metrics Collection
- Auth0 JWT Validation
- MongoDB Integration
```

### Database (MongoDB)
```javascript
// Collections structure
{
  "faqs": {
    "id": "number",
    "question": "string",
    "answer": "string", 
    "department": "string",
    "tags": ["array"]
  },
  "chat_history": {
    "user_id": "string",
    "messages": [{"role", "content", "timestamp", "source"}],
    "last_updated": "datetime"
  },
  "escalations": {
    "query": "string",
    "department": "string", 
    "username": "string",
    "timestamp": "datetime",
    "llm_reply": "string"
  }
}
```

## 🚀 Installation & Setup

### Prerequisites
```bash
# Required software
- Node.js (v18+)
- Python (v3.8+)
- MongoDB (local or cloud)
- Git
```

### Backend Setup

#### 1. FastAPI Service Setup
```bash
cd backend
pip install -r requirements.txt

# Environment variables
export MONGODB_URL="your_mongodb_connection_string"
export GROQ_API_KEY="your_groq_api_key"

# Run FastAPI server
python main.py
# Server runs on http://127.0.0.1:8003
```

#### 2. Express.js Service Setup
```bash
cd backend
npm install

# Run Express server
node server.js
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Database Setup
```javascript
// MongoDB collections will be auto-created
// Sample data inserted on first run
// No manual setup required
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend FastAPI (.env)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/erp_assistant
GROQ_API_KEY=gsk_your_groq_api_key_here

# Frontend (Auth0 config in main.tsx)
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-auth0-audience
```

### API Endpoints

#### FastAPI Endpoints (AI Processing)
```
POST /chat              # Main chat processing
GET  /chat-history/{id} # Get user chat history
GET  /escalations       # Get all escalations
GET  /faqs              # Get all FAQs
POST /faqs              # Create new FAQ
DELETE /faqs/{id}       # Delete FAQ
GET  /diagnostic/faqs   # Database diagnostic
```

#### Express.js Endpoints (CRUD Operations)
```
GET    /api/faqs                    # Get all FAQs
POST   /api/faqs                    # Create FAQ
DELETE /api/faqs/{id}               # Delete FAQ
GET    /api/faqs/department/{dept}  # Get FAQs by department
GET    /api/metrics/department-metrics # Get usage metrics
```

## 👥 User Roles & Permissions

### Admin Users
- **FAQ Management**: Create, edit, delete FAQs
- **User Management**: Add/remove users, assign roles
- **Analytics Dashboard**: View system metrics and usage
- **Escalation Management**: Handle escalated queries
- **Data Export/Import**: Backup and restore system data

### Department Users
- **Chat Interface**: Ask questions and get AI responses
- **Chat History**: Access previous conversations
- **Voice Interaction**: Use speech-to-text/text-to-speech
- **Department-Specific**: Access only relevant department data

## 📊 Analytics & Monitoring

### Usage Metrics
- **Department-wise Query Count**: Track which departments use the system most
- **Response Source Distribution**: Monitor FAQ vs LLM vs escalated responses
- **User Engagement**: Track active users and session duration
- **Response Time Analytics**: Monitor system performance

### Quality Metrics
- **Confidence Score Distribution**: Analyze AI response quality
- **Escalation Rate**: Monitor queries requiring human intervention
- **FAQ Effectiveness**: Track which FAQs are most useful
- **User Satisfaction**: Implicit feedback through usage patterns

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Progressive Web App**: Works offline with cached responses
- **Dark/Light Mode**: User preference-based theming
- **Accessibility**: WCAG compliant with keyboard navigation

### Interactive Elements
```css
/* Advanced CSS animations */
@keyframes message-pop {
  0% { opacity: 0; transform: scale(0.8) translateY(10px); }
  70% { transform: scale(1.05) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* Voice recording animations */
.icon-btn-mic.listening {
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 0 0 rgba(var(--primary), 0.4);
}
```

### Chat Interface Features
- **Real-time Typing Indicators**: Shows when AI is processing
- **Message Animations**: Smooth message appearance with pop effects
- **Smart Suggestions**: Department-specific quick queries
- **Voice Controls**: Hands-free interaction capabilities

## 🔮 Future Enhancements

### Planned Features
1. **ERP Integration**: Direct connection to SAP, Oracle, or other ERP systems
2. **Advanced Analytics**: Machine learning-based insights and predictions
3. **Multi-language Support**: Internationalization for global deployments
4. **Document Processing**: Upload and query PDF documents
5. **Integration APIs**: Connect with Slack, Teams, email systems

### Technical Improvements
1. **Microservices Architecture**: Break down into smaller, scalable services
2. **Real-time Notifications**: WebSocket-based live updates
3. **Advanced Caching**: Redis-based response caching
4. **Load Balancing**: Horizontal scaling capabilities
5. **CI/CD Pipeline**: Automated testing and deployment

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards
- **Frontend**: ESLint + Prettier configuration
- **Backend**: Black formatter for Python, ESLint for Node.js
- **Commits**: Conventional commit messages
- **Testing**: Jest for frontend, pytest for backend

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Common Issues

#### FAQ Not Found
```bash
# Check if FAQs are properly loaded
curl http://127.0.0.1:8003/diagnostic/faqs

# Verify MongoDB connection
# Check console logs for database errors
```

#### LLM Not Responding
```bash
# Verify Groq API key
export GROQ_API_KEY="your_api_key_here"

# Check API rate limits
# Review FastAPI logs for LLM errors
```

#### Authentication Issues
```bash
# Verify Auth0 configuration
# Check browser console for authentication errors
# Ensure Auth0 domain and client ID are correct
```

---

**Core Connect** - Transforming Enterprise Communication with AI 🚀

Built with ❤️ by the Core Connect Team
