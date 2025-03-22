import {
  FiCpu,
  FiGlobe,
  FiMessageCircle,
  FiDatabase,
  FiShield,
  FiUsers,
  FiActivity,
  FiChevronRight,
  FiTrendingUp,
  FiLayers,
} from "react-icons/fi";

export const metadata = {
  title: "Features | IDMS AI Assistant",
  description:
    "Explore the comprehensive features of our AI-powered enterprise support solution for IDMS ERP system",
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Comprehensive AI Support{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Features
                </span>
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered assistant provides intelligent support across all
                ERP modules with advanced features designed for enterprise
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          {/* AI & NLP Features */}
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-full p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FiCpu className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">
                AI & Natural Language Processing
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Intent Recognition Engine
                </h3>
                <p className="text-muted-foreground mb-4">
                  Advanced NLP model identifies user intent from natural
                  language queries, even with complex business contexts.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Contextual understanding of ERP terminology</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Support for industry-specific jargon</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Multi-intent recognition in complex queries</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Retrieval-Augmented Generation
                </h3>
                <p className="text-muted-foreground mb-4">
                  RAG approach combines knowledge base information with
                  real-time ERP data for accurate, contextual responses.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Self-updating knowledge base with vector search</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Live ERP data integration for real-time answers</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-blue-600" />
                    <span>Confidence scoring for response accuracy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Integration Features */}
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-full p-1.5 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <FiDatabase className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">
                ERP Integration & Data Access
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Secure API Connectivity
                </h3>
                <p className="text-muted-foreground mb-4">
                  OAuth2-based RESTful API integration with all IDMS ERP modules
                  for secure, role-based data access.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-purple-600" />
                    <span>Encrypted data transfer and storage</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-purple-600" />
                    <span>Role-based access to sensitive information</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-purple-600" />
                    <span>Full audit logging of all data accesses</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Real-time Data Retrieval
                </h3>
                <p className="text-muted-foreground mb-4">
                  Direct access to live ERP data ensures responses are always
                  based on current business information.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-purple-600" />
                    <span>
                      Live inventory, sales, and financial data access
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-purple-600" />
                    <span>GST calculation and validation in real-time</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-purple-600" />
                    <span>Cross-module data correlation for insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Multichannel Support */}
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-full p-1.5 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <FiGlobe className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Multichannel Accessibility</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Enterprise Channels
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Native ERP chat widget integration</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Dedicated web portal with SSO</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Email-based query submission</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Messaging Platforms
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>WhatsApp Business integration</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Slack app with deep ERP access</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Microsoft Teams integration</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Voice & Mobile</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Voice query processing with Whisper API</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Natural voice responses with Text-to-Speech</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-green-600" />
                    <span>Native iOS and Android apps</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Learning & Analytics */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="rounded-full p-1.5 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <FiActivity className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Learning & Analytics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Continuous Learning System
                </h3>
                <p className="text-muted-foreground mb-4">
                  Self-improving AI model that learns from user interactions and
                  feedback to enhance future responses.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-orange-600" />
                    <span>Automated learning from escalated queries</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-orange-600" />
                    <span>User feedback incorporation</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-orange-600" />
                    <span>Regular model retraining based on new data</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">
                  Comprehensive Analytics
                </h3>
                <p className="text-muted-foreground mb-4">
                  Detailed dashboards and reporting to monitor performance,
                  identify trends, and improve support efficiency.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-orange-600" />
                    <span>Query resolution rates and response times</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-orange-600" />
                    <span>Module-specific usage patterns</span>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mr-2 h-4 w-4 text-orange-600" />
                    <span>Knowledge gap identification</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">
                Feature Comparison
              </h2>
              <p className="max-w-[600px] text-muted-foreground">
                See how our AI Assistant compares to traditional ERP support
                solutions
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Feature</th>
                  <th className="p-4 text-center font-medium">
                    IDMS AI Assistant
                  </th>
                  <th className="p-4 text-center font-medium">
                    Traditional Support
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Response Time</td>
                  <td className="p-4 text-center text-green-600">
                    Instant (24/7)
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Hours to Days
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Data Access</td>
                  <td className="p-4 text-center text-green-600">
                    Real-time across all modules
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Limited, often delayed
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Availability</td>
                  <td className="p-4 text-center text-green-600">
                    24/7, all channels
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Business hours only
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Learning Capability</td>
                  <td className="p-4 text-center text-green-600">
                    Continuous self-improvement
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Static knowledge base
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Scalability</td>
                  <td className="p-4 text-center text-green-600">
                    Unlimited concurrent users
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Limited by support team size
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Consistency</td>
                  <td className="p-4 text-center text-green-600">
                    Always consistent responses
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Varies by support agent
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Analytics & Insights</td>
                  <td className="p-4 text-center text-green-600">
                    Comprehensive dashboards
                  </td>
                  <td className="p-4 text-center text-red-600">
                    Basic metrics only
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
