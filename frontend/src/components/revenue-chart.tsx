import { Card } from "@/components/ui/card";

import { RecentSales } from "./RecentSales";

export default function RevenueChart() {
  return (
    <Card className="">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold">Recent Sales</h3>
            <p className="text-sm text-muted-foreground">
              Latest customer transactions
            </p>
          </div>
        </div>
        <div className="mt-4">
          <RecentSales />
        </div>
      </div>
    </Card>
  );
}
