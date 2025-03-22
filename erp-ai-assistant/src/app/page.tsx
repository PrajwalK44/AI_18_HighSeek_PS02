"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FiAward,
  FiBriefcase,
  FiCpu,
  FiDatabase,
  FiLayers,
  FiMessageCircle,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { ChatInput } from "@/components/ChatInput";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 mb-2">
                Intelligent ERP Support
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                AI-Powered Enterprise Support for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IDMS ERP
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Seamlessly integrate intelligent support with your ERP system
                for real-time data retrieval, intelligent query resolution, and
                continuous learning.
              </p>

              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/chat"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Chat Now
                </Link>
                <Link
                  href="/features"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Learn More
                </Link>
              </div>

              {/* Chat Input Demo on Homepage */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-sm font-medium mb-2">Try it now:</div>
                <div className="flex w-full max-w-[600px]">
                  <ChatInput
                    onSend={(message, response) => {
                      // In a real implementation, we would show the response
                      // For demo, we just redirect to the chat page
                      window.location.href = "/chat";
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Type a question and press enter to start a conversation
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border border-border shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4">
                      <FiMessageCircle size={64} />
                    </div>
                    <p className="text-xl font-semibold">
                      Intelligent AI Assistant
                    </p>
                    <p className="mt-2 text-sm opacity-90">
                      Integrates with all ERP modules
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-600 dark:text-purple-400">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Enhancing ERP Experience
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI assistant leverages advanced technology to provide
                unparalleled support for your ERP operations
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full border p-3 text-blue-600 dark:text-blue-400">
                <div className="h-6 w-6">
                  <FiCpu size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">AI-Powered Assistance</h3>
              <p className="text-center text-sm text-muted-foreground">
                Advanced NLP engine for accurate query interpretation and
                response generation using RAG techniques.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full border p-3 text-purple-600 dark:text-purple-400">
                <div className="h-6 w-6">
                  <FiDatabase size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Real-time Data Fetching</h3>
              <p className="text-center text-sm text-muted-foreground">
                Secure API integration with ERP modules for real-time access to
                critical business data.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full border p-3 text-green-600 dark:text-green-400">
                <div className="h-6 w-6">
                  <FiMessageCircle size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Multi-channel Support</h3>
              <p className="text-center text-sm text-muted-foreground">
                Access via web chat, ERP widget, WhatsApp, Slack, and email with
                voice interaction support.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full border p-3 text-red-600 dark:text-red-400">
                <div className="h-6 w-6">
                  <FiShield size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Enterprise Security</h3>
              <p className="text-center text-sm text-muted-foreground">
                Role-based access controls, data encryption, and compliance with
                industry security standards.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full border p-3 text-amber-600 dark:text-amber-400">
                <div className="h-6 w-6">
                  <FiTrendingUp size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Interactive Analytics</h3>
              <p className="text-center text-sm text-muted-foreground">
                Visual data representations with interactive drill-down
                capabilities for deeper insights.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full border p-3 text-blue-600 dark:text-blue-400">
                <div className="h-6 w-6">
                  <FiBriefcase size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Process Automation</h3>
              <p className="text-center text-sm text-muted-foreground">
                Automated workflows for routine tasks, approvals, and
                notifications to boost productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-600 dark:text-blue-400">
                ERP Integration
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Seamless IDMS Module Integration
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI assistant connects with all ERP modules to provide
                comprehensive support across the organization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="h-10 w-10 mb-4 text-blue-600">
                <FiLayers size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Inventory</h3>
              <p className="text-center text-sm text-muted-foreground">
                Track stock levels, monitor movements, and optimize reorder
                points.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="h-10 w-10 mb-4 text-purple-600">
                <FiTrendingUp size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sales</h3>
              <p className="text-center text-sm text-muted-foreground">
                Analyze sales performance, customer trends, and commission
                calculations.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="h-10 w-10 mb-4 text-green-600">
                <FiAward size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Purchase</h3>
              <p className="text-center text-sm text-muted-foreground">
                Manage purchase orders, vendor relationships, and approval
                workflows.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="h-10 w-10 mb-4 text-red-600">
                <FiBriefcase size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Finance</h3>
              <p className="text-center text-sm text-muted-foreground">
                Handle accounting, tax compliance, and financial reporting
                tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your ERP Support?
              </h2>
              <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join innovative enterprises already using our AI assistant to
                streamline support and enhance productivity.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="/demo"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white text-blue-600 px-8 text-sm font-medium shadow transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Request Demo
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
