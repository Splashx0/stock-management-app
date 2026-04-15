import { DashboardCards } from "@/components/dashboard-cards";
import InventorySummary from "@/components/inventory-summary";
import RevenueChart from "@/components/revenue-chart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
      <DashboardCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InventorySummary />
        <RevenueChart />
      </div>
    </div>
  );
}
