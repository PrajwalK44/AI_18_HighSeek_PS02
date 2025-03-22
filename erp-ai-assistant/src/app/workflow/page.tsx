import {
  FiUser,
  FiArrowRight,
  FiCpu,
  FiDatabase,
  FiSearch,
  FiMessageCircle,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

export const metadata = {
  title: "Workflow | IDMS AI Assistant",
  description:
    "Understand the intelligent workflow of our AI-powered enterprise support solution",
};

export default function WorkflowPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Intelligent{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Query Workflow
                </span>
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore how our AI assistant processes queries, retrieves data,
                and generates responses in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Diagram */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 max-w-5xl">
          <div className="flex flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter">
              Step-by-Step Process Flow
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Our AI-powered assistant follows a comprehensive workflow to
              deliver accurate responses
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-16">
            {/* Step 1: Query Submission */}
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                  <FiUser className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold">
                    1. Query Submission & Input Capture
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Users across departments submit queries through multiple
                    channels (web, chat widget, WhatsApp, Slack, email). Voice
                    queries are converted to text using advanced Speech-to-Text
                    APIs.
                  </p>
                </div>
              </div>
              <div className="absolute left-6 top-12 h-16 border-l-2 border-dashed border-muted-foreground/30"></div>
            </div>

            {/* Step 2: Intent Recognition */}
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center">
                  <FiCpu className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold">
                    2. Intent Recognition & Analysis
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    The NLP engine analyzes the query to identify intent and
                    required information needs. Context from previous
                    interactions and user role is incorporated into analysis.
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg border p-4">
                      <div className="flex items-center text-sm font-medium">
                        <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                        Intent Classification
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Determines if query is about inventory check, financial
                        data, or support request
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-4">
                      <div className="flex items-center text-sm font-medium">
                        <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                        Entity Extraction
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Identifies key entities like customer names, order
                        numbers, product codes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-6 top-12 h-16 border-l-2 border-dashed border-muted-foreground/30"></div>
            </div>

            {/* Step 3: Data Retrieval */}
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                  <FiSearch className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold">
                    3. Data Retrieval & Knowledge Base Integration
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    The system queries both static knowledge base and makes
                    secure API calls to ERP modules for live data. RAG approach
                    combines knowledge base content with real-time information.
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background rounded-lg border p-4">
                      <div className="flex items-center text-sm font-medium">
                        <FiDatabase className="w-4 h-4 mr-2 text-green-600" />
                        Knowledge Base
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Self-updating repository of FAQs, documentation, and
                        support articles
                      </p>
                    </div>
                    <div className="bg-background rounded-lg border p-4">
                      <div className="flex items-center text-sm font-medium">
                        <FiDatabase className="w-4 h-4 mr-2 text-orange-600" />
                        ERP Data
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Secure API calls to retrieve real-time module data with
                        OAuth2 authentication
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-6 top-12 h-16 border-l-2 border-dashed border-muted-foreground/30"></div>
            </div>

            {/* Step 4: Response Generation */}
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center">
                  <FiMessageCircle className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold">
                    4. Response Generation & Confidence Scoring
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    The system compiles information and uses the language model
                    to compose a human-like response. Each response is assigned
                    a confidence score to determine next steps.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <FiCheckCircle className="mr-2 h-5 w-5 text-green-600" />
                      <span className="text-sm">
                        High confidence: Deliver answer directly to user
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiAlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                      <span className="text-sm">
                        Medium confidence: Provide answer with clarification
                        options
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiAlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                      <span className="text-sm">
                        Low confidence: Escalate to human support agent
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute left-6 top-12 h-16 border-l-2 border-dashed border-muted-foreground/30"></div>
            </div>

            {/* Step 5: Response Delivery */}
            <div className="relative">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                  <FiArrowRight className="w-6 h-6" />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-xl font-bold">
                    5. Response Delivery & Feedback Collection
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    The final response is delivered through the same channel
                    used for the query. For voice channels, Text-to-Speech APIs
                    convert the response to natural-sounding audio. User
                    feedback is collected to continuously improve the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Workflow Details */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Continuous Learning System
              </h2>
              <div className="space-y-6">
                <div className="p-6 bg-background rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">
                    Automated Feedback Loop
                  </h3>
                  <p className="text-muted-foreground">
                    Each query and response pair is logged and analyzed to
                    identify patterns and knowledge gaps. User feedback on
                    response accuracy is incorporated into the training data for
                    model updates.
                  </p>
                </div>
                <div className="p-6 bg-background rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">
                    Knowledge Base Evolution
                  </h3>
                  <p className="text-muted-foreground">
                    Admin team regularly reviews performance metrics to update
                    the knowledge base with new content. Common queries without
                    confident answers are prioritized for knowledge base
                    updates.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Escalation Protocol</h2>
              <div className="space-y-6">
                <div className="p-6 bg-background rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">
                    Automatic Escalation Triggers
                  </h3>
                  <p className="text-muted-foreground">
                    Low confidence scores or sensitive topics automatically
                    route queries to human support agents. Complex multi-step
                    procedures requiring human oversight are flagged for
                    escalation.
                  </p>
                </div>
                <div className="p-6 bg-background rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-2">
                    Human-in-the-Loop
                  </h3>
                  <p className="text-muted-foreground">
                    L1 support agents review escalated queries with full context
                    of previous interactions. Agent responses are logged to
                    improve future AI responses to similar queries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
