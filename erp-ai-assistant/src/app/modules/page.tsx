import {
  FiDatabase,
  FiBriefcase,
  FiTruck,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiAward,
  FiSettings,
  FiBox,
  FiClipboard,
  FiTool,
} from "react-icons/fi";

export const metadata = {
  title: "ERP Modules | IDMS AI Assistant",
  description:
    "Learn about the comprehensive IDMS ERP modules that our AI-powered assistant integrates with",
};

export default function ModulesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Integrated{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ERP Modules
                </span>
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI assistant seamlessly connects with all IDMS ERP modules
                to provide comprehensive support across the entire organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module Overview */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                <FiBriefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sales & NPD</h3>
              <p className="text-muted-foreground mb-4">
                Manages the entire sales lifecycle and new product development
                processes with integrated customer management.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Customer Master</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Sales Orders</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Product Development</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Quotation Management</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-4">
                <FiCalendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Planning</h3>
              <p className="text-muted-foreground mb-4">
                Coordinates production scheduling, resource allocation, and
                demand forecasting to optimize operations.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Production Schedule</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Material Requirements Planning</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Capacity Planning</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Demand Forecasting</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
                <FiClipboard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Purchase</h3>
              <p className="text-muted-foreground mb-4">
                Handles end-to-end procurement processes from purchase
                requisitions to vendor payments with GST integration.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>Supplier Master</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>Purchase Orders</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>Vendor Evaluation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>GST-compliant Billing</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 mb-4">
                <FiBox className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Stores & Inventory</h3>
              <p className="text-muted-foreground mb-4">
                Manages inventory levels, warehouse operations, and material
                movements with real-time tracking.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    <span>SKU Master</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    <span>Goods Receipt Notes</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    <span>Stock Transfer</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                    <span>Inventory Aging</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-4">
                <FiDatabase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Production</h3>
              <p className="text-muted-foreground mb-4">
                Controls manufacturing processes, work orders, and shop floor
                activities with real-time progress tracking.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>BOM Management</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Work Orders</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Production Reporting</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Resource Utilization</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                <FiTool className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Maintenance</h3>
              <p className="text-muted-foreground mb-4">
                Schedules and tracks equipment maintenance, repairs, and spare
                parts management to minimize downtime.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Equipment Master</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Maintenance Schedule</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Breakdown Reports</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Spare Parts Inventory</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-4">
                <FiAward className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality</h3>
              <p className="text-muted-foreground mb-4">
                Ensures product quality through inspection, testing, and quality
                assurance procedures with full traceability.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>QC Specifications</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Inspection Reports</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Non-conformance Management</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    <span>Certificate of Analysis</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
                <FiTruck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dispatch & Logistics</h3>
              <p className="text-muted-foreground mb-4">
                Manages shipping, transportation, and delivery processes with
                e-way bill and delivery tracking.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>Dispatch Planning</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>E-Way Bill Generation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>Delivery Confirmation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span>Shipment Tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 mb-4">
                <FiUsers className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">HR & Admin</h3>
              <p className="text-muted-foreground mb-4">
                Handles employee management, attendance, payroll, and
                administrative functions with comprehensive reporting.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                    <span>Employee Master</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                    <span>Attendance & Leave</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                    <span>Payroll Processing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                    <span>Performance Management</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-4">
                <FiTrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accounts & Finance</h3>
              <p className="text-muted-foreground mb-4">
                Manages financial operations, accounting, and GST compliance
                with automated reporting and reconciliation.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>General Ledger</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>GST Returns (GSTR-1, GSTR-3B)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Accounts Receivable/Payable</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Financial Reporting</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-start p-6 bg-background rounded-xl border shadow-sm">
              <div className="rounded-full p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                <FiSettings className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Settings & Configuration
              </h3>
              <p className="text-muted-foreground mb-4">
                Controls system configuration, user access, and
                organization-wide settings with audit trails.
              </p>
              <div className="w-full mt-auto">
                <h4 className="text-sm font-semibold mb-2">Key Components:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>User Management</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Role-based Permissions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>System Parameters</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Audit Trail</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module Integration Graphic */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter">
                ERP Structure
              </h2>
              <p className="max-w-[600px] text-muted-foreground">
                Each IDMS module follows a three-tier structure for optimal
                organization
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Masters</h3>
              <p className="text-center text-muted-foreground">
                Static reference data that defines core entities in the system
              </p>
              <ul className="mt-4 space-y-2 text-center">
                <li>Customer Master</li>
                <li>Supplier Master</li>
                <li>SKU Master</li>
                <li>Employee Master</li>
                <li>Equipment Master</li>
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Transactions</h3>
              <p className="text-center text-muted-foreground">
                Dynamic operations that record business activities
              </p>
              <ul className="mt-4 space-y-2 text-center">
                <li>Sales Orders</li>
                <li>Purchase Orders</li>
                <li>Goods Receipt Notes</li>
                <li>Production Work Orders</li>
                <li>Financial Entries</li>
              </ul>
            </div>

            <div className="flex flex-col items-center rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Reports</h3>
              <p className="text-center text-muted-foreground">
                Analysis and insights derived from transaction data
              </p>
              <ul className="mt-4 space-y-2 text-center">
                <li>Sales Register</li>
                <li>Stock Aging Report</li>
                <li>GST Return Filing</li>
                <li>Production Efficiency</li>
                <li>Financial Statements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
