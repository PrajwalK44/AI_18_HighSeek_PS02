"use client";

import { Chat } from "@/components/Chat";
import {
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCpu,
  FiDatabase,
  FiDownload,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export default function DemoPage() {
  const demoMessages: Message[] = [
    {
      id: "1",
      sender: "user",
      text: "Show me my current inventory levels for Widget XYZ",
      timestamp: "11:42 AM",
    },
    {
      id: "2",
      sender: "assistant",
      text: "Here's the current inventory for Widget XYZ:\n\nTotal Quantity: 342 units\nAvailable: 305 units\nAllocated: 37 units\n\nWarehouse Distribution:\n- Main Warehouse: 210 units\n- East Location: 95 units\n- West Location: 37 units\n\nReorder Point: 150 units\nLast Restocked: 15 days ago\n\nWould you like to see the movement history or place a purchase order?",
      timestamp: "11:42 AM",
    },
    {
      id: "3",
      sender: "user",
      text: "What are my total sales for this month?",
      timestamp: "11:43 AM",
    },
    {
      id: "4",
      sender: "assistant",
      text: "Here's your sales summary for the current month (July 2023):\n\nTotal Sales: ₹4,325,750\nOrders Processed: 237\nUnits Sold: 1,892\n\nChange vs. Previous Month: +8.3%\nChange vs. Same Month Last Year: +15.7%\n\nTop Selling Products:\n1. Widget XYZ: ₹1,230,500 (28.4%)\n2. Premium Service Package: ₹875,000 (20.2%)\n3. Component ABC: ₹632,400 (14.6%)\n\nWould you like to see the detailed breakdown by category, customer, or sales representative?",
      timestamp: "11:43 AM",
    },
    {
      id: "5",
      sender: "user",
      text: "When is my next GST filing due?",
      timestamp: "11:44 AM",
    },
    {
      id: "6",
      sender: "assistant",
      text: "Your next GST filing details:\n\nGSTR-1 (Outward Supplies):\n- Due Date: 11th August 2023\n- Status: Not Filed\n- Pending Invoices: 23\n\nGSTR-3B (Summary Return):\n- Due Date: 20th August 2023\n- Status: Not Filed\n- Estimated Tax Liability: ₹375,200\n\nPending Input Tax Credit: ₹283,450\nEstimated Net Payment: ₹91,750\n\nWould you like me to show you the pending invoices that need to be processed before filing?",
      timestamp: "11:44 AM",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        IDMS ERP AI Assistant Demo
      </h1>

      <div className="max-w-4xl mx-auto mb-12 text-center">
        <p className="text-muted-foreground">
          Experience how our AI assistant provides instant answers to your ERP
          queries. Below is a simulated conversation showcasing the
          capabilities.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-xl border shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="bg-muted p-4 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                      <FiCpu className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-lg">IDMS AI Assistant</h3>
                      <p className="text-xs text-muted-foreground">
                        Connected to all ERP modules
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="rounded-md p-2 hover:bg-accent">
                      <FiCalendar className="w-4 h-4" />
                    </button>
                    <button className="rounded-md p-2 hover:bg-accent">
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {demoMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground ml-12"
                            : "bg-muted mr-12"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                              message.sender === "user"
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            }`}
                          >
                            {message.sender === "user" ? (
                              <FiUser className="w-3 h-3" />
                            ) : (
                              <FiCpu className="w-3 h-3" />
                            )}
                          </div>
                          <span className="text-xs font-medium">
                            {message.sender === "user"
                              ? "You"
                              : "IDMS AI Assistant"}
                          </span>
                          <span className="text-xs ml-auto opacity-70">
                            {message.timestamp}
                          </span>
                        </div>
                        <div className="whitespace-pre-line">
                          {message.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input (disabled, just for display) */}
                <div className="border-t p-4">
                  <div className="flex items-center rounded-md border bg-background focus-within:ring-1 focus-within:ring-ring px-3">
                    <input
                      type="text"
                      placeholder="Type your query here..."
                      className="flex-1 py-2 bg-transparent focus:outline-none"
                      disabled
                    />
                    <button className="p-2" disabled>
                      <FiMessageCircle className="text-muted-foreground w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <FiDatabase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">ERP Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connects securely to your ERP system to access real-time
                    data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <FiCpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">AI Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Uses advanced NLP to understand queries and generate
                    accurate responses
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <FiBarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Data Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Provides actionable insights and proactive recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Key Benefits</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <FiArrowRight className="text-primary h-4 w-4 flex-shrink-0" />
                <span>
                  Instant access to ERP data without navigating complex menus
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiArrowRight className="text-primary h-4 w-4 flex-shrink-0" />
                <span>
                  80% reduction in time spent searching for information
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiArrowRight className="text-primary h-4 w-4 flex-shrink-0" />
                <span>
                  Support available 24/7 across multiple communication channels
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiArrowRight className="text-primary h-4 w-4 flex-shrink-0" />
                <span>
                  Improved decision-making with contextual data analysis
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiArrowRight className="text-primary h-4 w-4 flex-shrink-0" />
                <span>Reduced training needs for new ERP users</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-center mt-8">
            <a
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Schedule Full Demo
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
