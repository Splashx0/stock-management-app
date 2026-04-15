import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/providers/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useMobile();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const handleStorageChange = () => {
      const sidebarState = localStorage.getItem("sidebar-expanded");
      if (sidebarState) {
        setIsExpanded(sidebarState === "true");
      }
    };

    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleSidebarChange = (e: CustomEvent) => {
      setIsExpanded(e.detail.expanded);
    };

    window.addEventListener("sidebarChange" as any, handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarChange" as any, handleSidebarChange);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen">
        {!isLoginPage && <Sidebar />}
        <main
          className={cn(
            "flex-1 p-6 transition-all duration-300 ease-in-out",
            !isLoginPage && !isMobile
              ? isExpanded
                ? "lg:pl-72"
                : "lg:pl-28"
              : ""
          )}
        >
          <Outlet />
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
