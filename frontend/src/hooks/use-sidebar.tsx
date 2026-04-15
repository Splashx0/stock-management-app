"use client";

import { useState, useEffect, useCallback } from "react";

export function useSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem("sidebar-expanded");
    if (storedState) {
      setIsExpanded(storedState === "true");
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);

    // Save to localStorage
    localStorage.setItem("sidebar-expanded", String(newState));

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("sidebarChange", { detail: { expanded: newState } })
    );

    // Also dispatch storage event for cross-tab sync
    window.dispatchEvent(new Event("storage"));
  }, [isExpanded]);

  return {
    isExpanded,
    toggleSidebar,
  };
}
