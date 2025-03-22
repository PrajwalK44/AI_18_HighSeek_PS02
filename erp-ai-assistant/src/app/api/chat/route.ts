import { NextRequest, NextResponse } from "next/server";

// Helper function to generate dynamic data
const generateDynamicData = () => {
  // Generate random data for dynamic responses
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const previousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).toLocaleString("default", { month: "long" });

  // Generate random inventory levels (70-500 range)
  const inventory = [
    {
      id: "SKU-123",
      name: "Widget A",
      quantity: Math.floor(Math.random() * 430) + 70,
      location: Math.random() > 0.5 ? "Warehouse 1" : "Warehouse 2",
    },
    {
      id: "SKU-456",
      name: "Widget B",
      quantity: Math.floor(Math.random() * 430) + 70,
      location: Math.random() > 0.5 ? "Warehouse 1" : "Warehouse 2",
    },
    {
      id: "SKU-789",
      name: "Widget C",
      quantity: Math.floor(Math.random() * 430) + 70,
      location: Math.random() > 0.5 ? "Warehouse 1" : "Warehouse 2",
    },
    {
      id: "SKU-101",
      name: "Premium Kit",
      quantity: Math.floor(Math.random() * 200) + 50,
      location: Math.random() > 0.5 ? "Warehouse 1" : "Warehouse 3",
    },
    {
      id: "SKU-202",
      name: "Enterprise Bundle",
      quantity: Math.floor(Math.random() * 100) + 20,
      location: "Warehouse 3",
    },
  ];

  // Randomly select 3 items for display
  const shuffledInventory = [...inventory].sort(() => 0.5 - Math.random());
  const selectedInventory = shuffledInventory.slice(0, 3);

  // Generate random sales data
  const sales = {
    currentMonth: Math.floor(Math.random() * 300000) + 100000,
    previousMonth: Math.floor(Math.random() * 300000) + 100000,
    ytd: Math.floor(Math.random() * 3000000) + 1000000,
    topProducts: shuffledInventory.slice(0, 3).map((item) => item.name),
    growth: (Math.random() * 20 - 5).toFixed(1), // -5% to +15%
  };

  // Dynamic GST data
  const nextDueDate = new Date();
  nextDueDate.setDate(20); // GST typically due on 20th
  nextDueDate.setMonth(
    nextDueDate.getMonth() + (nextDueDate.getDate() > 20 ? 1 : 0)
  );

  const lastFiledDate = new Date();
  lastFiledDate.setDate(20);
  lastFiledDate.setMonth(lastFiledDate.getMonth() - 1);

  const gst = {
    lastFiled: lastFiledDate.toISOString().split("T")[0],
    nextDue: nextDueDate.toISOString().split("T")[0],
    pendingInput: Math.floor(Math.random() * 100000) + 20000,
    pendingOutput: Math.floor(Math.random() * 150000) + 40000,
    reconciliationStatus: Math.random() > 0.5 ? "Completed" : "In Progress",
  };

  // Dynamic purchase orders
  const statuses = ["Pending", "Approved", "Shipped", "Delivered", "On Hold"];
  const suppliers = [
    "Acme Corp",
    "XYZ Supplies",
    "Global Parts Inc",
    "Tech Solutions Ltd",
    "Quality Vendors",
  ];

  const purchaseOrders = Array.from({ length: 5 }).map((_, index) => ({
    id: `PO-2024-${Math.floor(Math.random() * 900) + 100}`,
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    amount: Math.floor(Math.random() * 50000) + 5000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(now - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  }));

  // Out of stock items
  const outOfStockItems = [
    "Widget D Pro",
    "Enterprise Toolkit",
    "Premium Connector",
    "Security Module",
    "Analytics Package",
  ];

  // Randomly select 2-3 out of stock items
  const shuffledOutOfStock = [...outOfStockItems].sort(
    () => 0.5 - Math.random()
  );
  const selectedOutOfStock = shuffledOutOfStock.slice(
    0,
    Math.floor(Math.random() * 2) + 2
  );

  return {
    inventory: selectedInventory,
    allInventory: inventory,
    sales,
    gst,
    purchaseOrders,
    outOfStockItems: selectedOutOfStock,
    currentMonth,
    previousMonth,
  };
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body as JSON for normal chat
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json();
      const message = body.message;

      // Generate dynamic data for this request
      const dynamicData = generateDynamicData();

      // Process the message and generate a response
      let response = "";

      // Simple keyword matching for demo purposes
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("inventory") ||
        lowerMessage.includes("stock")
      ) {
        if (
          lowerMessage.includes("stockout") ||
          lowerMessage.includes("out of stock")
        ) {
          response = `Based on our records, the products with the highest stockout frequency last month were:\n
${dynamicData.outOfStockItems.map((item) => `- ${item}`).join("\n")}
\nRecommendation: Consider increasing safety stock for these items.`;
        } else {
          response = `Here's your current inventory status:\n
${dynamicData.inventory
  .map(
    (item) =>
      `- ${item.name} (${item.id}): ${item.quantity} units in ${item.location}`
  )
  .join("\n")}`;
        }
      } else if (lowerMessage.includes("sale")) {
        response = `Sales Summary for ${dynamicData.currentMonth}:\n
- Current month: ₹${dynamicData.sales.currentMonth.toLocaleString()}
- Previous month (${
          dynamicData.previousMonth
        }): ₹${dynamicData.sales.previousMonth.toLocaleString()}
- Year to date: ₹${dynamicData.sales.ytd.toLocaleString()}
- Month-over-month growth: ${dynamicData.sales.growth}%
- Top performing products: ${dynamicData.sales.topProducts.join(", ")}`;
      } else if (lowerMessage.includes("gst") || lowerMessage.includes("tax")) {
        if (
          lowerMessage.includes("gstr-2b") ||
          lowerMessage.includes("reconciliation")
        ) {
          response = `GSTR-2B Reconciliation Status:
- Status: ${dynamicData.gst.reconciliationStatus}
- Matched Invoices: ${Math.floor(Math.random() * 30) + 40} out of ${
            Math.floor(Math.random() * 20) + 60
          }
- Pending Queries: ${Math.floor(Math.random() * 10)}
- Last Updated: ${new Date().toLocaleDateString()}`;
        } else {
          response = `GST Information:\n
- Last return filed: ${dynamicData.gst.lastFiled}
- Next filing due: ${dynamicData.gst.nextDue}
- Pending input credit: ₹${dynamicData.gst.pendingInput.toLocaleString()}
- Pending output liability: ₹${dynamicData.gst.pendingOutput.toLocaleString()}`;
        }
      } else if (
        lowerMessage.includes("purchase") ||
        lowerMessage.includes("order")
      ) {
        response = `Purchase Orders:\n
${dynamicData.purchaseOrders
  .map(
    (po) =>
      `- ${po.id} | ${po.supplier} | ₹${po.amount.toLocaleString()} | Date: ${
        po.date
      } | Status: ${po.status}`
  )
  .join("\n")}`;
      } else if (
        lowerMessage.includes("receivables") ||
        lowerMessage.includes("aging")
      ) {
        response = `Receivables Aging Report (as of ${new Date().toLocaleDateString()}):\n
- Current: ₹${(Math.random() * 500000 + 100000).toFixed(0)}
- 1-30 days: ₹${(Math.random() * 300000 + 50000).toFixed(0)}
- 31-60 days: ₹${(Math.random() * 150000 + 20000).toFixed(0)}
- 61-90 days: ₹${(Math.random() * 80000 + 10000).toFixed(0)}
- >90 days: ₹${(Math.random() * 50000 + 5000).toFixed(0)}
\nTotal Receivables: ₹${(Math.random() * 1000000 + 200000).toFixed(0)}`;
      } else if (
        lowerMessage.includes("cash flow") ||
        lowerMessage.includes("projection")
      ) {
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(today.getDate() + 30);

        response = `Cash Flow Projection (${today.toLocaleDateString()} to ${thirtyDaysLater.toLocaleDateString()}):\n
- Starting Balance: ₹${(Math.random() * 2000000 + 500000).toFixed(0)}
- Projected Inflows: ₹${(Math.random() * 1000000 + 200000).toFixed(0)}
- Projected Outflows: ₹${(Math.random() * 800000 + 150000).toFixed(0)}
- Projected Net Position: ₹${(Math.random() * 2200000 + 550000).toFixed(0)}
\nHighest upcoming expense: Vendor payments on ${new Date(
          today.getTime() + Math.random() * 20 * 24 * 60 * 60 * 1000
        ).toLocaleDateString()}`;
      } else if (lowerMessage.includes("help")) {
        response = `I can help you with:
- Inventory information (try "Check inventory for Widget A")
- Sales data (try "Show me sales for this month")
- GST information (try "What's my GST status?")
- Purchase orders (try "List pending purchase orders")
- Financial reports (try "Show me the receivables aging report")`;
      } else {
        response =
          "I'm not sure I understand. Try asking about inventory, sales, GST returns, purchase orders, or financial reports. Type 'help' for more information.";
      }

      return NextResponse.json({ response });
    }
    // Handle multipart form data for audio transcription
    else if (
      request.headers.get("content-type")?.includes("multipart/form-data")
    ) {
      // In a real implementation, this would call an actual speech-to-text service
      // For demo, we'll just return a mock result

      return new Response(
        JSON.stringify({
          text: "Show me the current inventory levels",
          confidence: 0.92,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
