import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  // Get all unique keys from the data
  const keys = Array.from(new Set(data.flatMap((item) => Object.keys(item))));

  // Create CSV header row
  const header = keys.join(",");

  // Create CSV rows from data
  const rows = data
    .map((item) =>
      keys
        .map((key) => {
          const value = item[key];
          // Handle different data types and escape commas
          if (value === null || value === undefined) {
            return "";
          } else if (typeof value === "string") {
            // Escape quotes and wrap in quotes if contains comma
            const escaped = value.replace(/"/g, '""');
            return escaped.includes(",") ? `"${escaped}"` : escaped;
          } else {
            return String(value);
          }
        })
        .join(",")
    )
    .join("\n");

  // Combine header and rows
  const csv = `${header}\n${rows}`;

  // Create a blob and download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
