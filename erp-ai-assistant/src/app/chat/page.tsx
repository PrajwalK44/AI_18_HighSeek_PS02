import { Chat } from "@/components/Chat";

export const metadata = {
  title: "Chat with IDMS ERP Assistant",
  description: "Interactive AI assistant for your IDMS ERP system queries",
};

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Chat with IDMS ERP Assistant
        </h1>

        <p className="text-muted-foreground mb-8 text-center">
          Ask any question about your ERP system - inventory, sales, GST
          returns, and more.
        </p>

        <Chat />

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Sample Queries</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>What is my current inventory for Widget A?</li>
            <li>Show me sales data for the current month</li>
            <li>When is my next GST filing due?</li>
            <li>List all pending purchase orders</li>
            <li>What's my pending input credit for GST?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
