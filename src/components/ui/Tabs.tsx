"use client";

import { cn } from "@/lib/utils";

export interface Tab {
  id: string;
  label: string;
  /** Badge numérico opcional (ej. alertas) */
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-gray-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
            "border-b-2 -mb-px",
            active === tab.id
              ? "border-teal text-teal"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          )}
        >
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
              active === tab.id
                ? "bg-teal/10 text-teal"
                : "bg-gray-100 text-gray-500"
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
