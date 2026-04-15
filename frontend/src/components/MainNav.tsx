"use client";

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PackageSearch } from "lucide-react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link to="/"
        className="flex items-center text-xl font-medium transition-colors hover:text-primary"
      >
        <PackageSearch className="mr-2 h-6 w-6" />
        <span>StockSync</span>
      </Link>
      <Link to="/inventory"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Inventory
      </Link>
      <Link to="/orders"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Orders
      </Link>
      <Link to="/customers"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Customers
      </Link>
      <Link to="/suppliers"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Suppliers
      </Link>
      <Link to="/drivers"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Drivers
      </Link>
      <Link to="/analytics"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Analytics
      </Link>
    </nav>
  );
}
