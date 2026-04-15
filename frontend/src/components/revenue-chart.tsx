import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RecentSales } from "./RecentSales";

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4000 },
  { name: "May", revenue: 7000 },
  { name: "Jun", revenue: 6000 },
  { name: "Jul", revenue: 8000 },
  { name: "Aug", revenue: 9000 },
  { name: "Sep", revenue: 8500 },
  { name: "Oct", revenue: 9500 },
  { name: "Nov", revenue: 10000 },
  { name: "Dec", revenue: 12000 },
];

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
