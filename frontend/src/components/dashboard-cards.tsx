import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    title: "Total Revenue",
    value: "30,000,00 TND",
    change: "+20.1%",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "Products in Stock",
    value: "5",
    change: "-3.2%",
    isPositive: false,
    icon: Package,
  },
  {
    title: "New Orders",
    value: "5",
    change: "+12.5%",
    isPositive: true,
    icon: ShoppingCart,
  },
  {
    title: "Active Customers",
    value: "3",
    change: "+8.2%",
    isPositive: true,
    icon: Users,
  },
];

export function DashboardCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {/*     <p className="flex items-center text-xs text-muted-foreground">
              {card.isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-rose-500" />
              )}
              <span
                className={
                  card.isPositive ? "text-emerald-500" : "text-rose-500"
                }
              >
                {card.change}
              </span>
              <span className="ml-1">from last month</span>
            </p>*/}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
