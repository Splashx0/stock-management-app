import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-04-01",
    amount: "$245.99",
    status: "Delivered",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-04-02",
    amount: "$129.50",
    status: "Processing",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-04-03",
    amount: "$79.99",
    status: "Shipped",
  },
  {
    id: "ORD-004",
    customer: "Emily Davis",
    date: "2023-04-04",
    amount: "$349.99",
    status: "Pending",
  },
  {
    id: "ORD-005",
    customer: "Michael Wilson",
    date: "2023-04-05",
    amount: "$199.99",
    status: "Delivered",
  },
];

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest 5 orders from your customers</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/orders">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "default"
                          : order.status === "Processing"
                          ? "secondary"
                          : order.status === "Shipped"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
