import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Fer", inStock: 120, lowStock: 15, outOfStock: 5 },
  { name: "Brique", inStock: 200, lowStock: 20, outOfStock: 10 },
  { name: "Porte", inStock: 150, lowStock: 10, outOfStock: 3 },
  { name: "Ciment", inStock: 80, lowStock: 8, outOfStock: 2 },
  { name: "Acier", inStock: 100, lowStock: 5, outOfStock: 1 },
];

export default function InventorySummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Status</CardTitle>
        <CardDescription>Stock levels by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="inStock" name="In Stock" fill="#4ade80" />
            <Bar dataKey="lowStock" name="Low Stock" fill="#facc15" />
            <Bar dataKey="outOfStock" name="Out of Stock" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
