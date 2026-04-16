"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  BarChart3,
  Box,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  Menu,
  Package,
  Users,
  X,
  Truck,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = useLocation().pathname;
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem("sidebar-expanded");
    if (storedState) {
      setIsExpanded(storedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    // Save to localStorage
    localStorage.setItem("sidebar-expanded", String(newState));

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("sidebarChange", { detail: { expanded: newState } }),
    );

    // Also dispatch storage event for cross-tab sync
    window.dispatchEvent(new Event("storage"));
  };

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-50 lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Box className="h-6 w-6" />
              <span>StockS</span>
            </Link>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {/* <Bell className="h-5 w-5" />*/}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New order received</DropdownMenuItem>
                  <DropdownMenuItem>
                    Low stock alert: Wireless Headphones
                  </DropdownMenuItem>
                  <DropdownMenuItem>Weekly report available</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
          </div>
          <div className="flex flex-col h-[calc(100%-4rem)]">
            <nav className="space-y-1 px-2 py-4 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                  to={""}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t p-4">
              <Link
                to="/profile"
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === "/profile"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Mohamed ali</span>
                  <span className="text-xs text-muted-foreground">
                    Administrator
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 border-r bg-background transition-all duration-300 ease-in-out",
          isExpanded ? "w-64" : "w-20",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Box className="h-6 w-6" />
            {isExpanded && <span>StockS</span>}
          </Link>
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {/* <Bell className="h-5 w-5" />*/}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New order received</DropdownMenuItem>
                  <DropdownMenuItem>
                    Low stock alert: Wireless Headphones
                  </DropdownMenuItem>
                  <DropdownMenuItem>Weekly report available</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Collapse sidebar</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Expand sidebar</span>
            </Button>
          )}
        </div>
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <nav className="space-y-1 px-2 py-4 flex-1">
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !isExpanded && "justify-center px-2",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {isExpanded && <span>{item.title}</span>}
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
          <div className="mt-auto border-t p-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    pathname === "/profile"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    !isExpanded && "justify-center px-2",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://cdn.pixabay.com/photo/2014/06/16/23/39/black-370118_960_720.png"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>

                  {isExpanded && (
                    <div className="flex flex-col">
                      <span className="text-sm text- font-medium">
                        Mohamed ali
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Administrator
                      </span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground ml-3"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">
                  John Doe (Administrator)
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
