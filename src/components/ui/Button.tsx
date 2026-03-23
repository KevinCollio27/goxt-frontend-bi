"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "midnight" | "outline" | "destructive" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  midnight:    "bg-[#0F172A] text-white shadow-sm hover:bg-[#1E293B]",
  outline:     "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50",
  destructive: "border border-red-200 bg-white text-red-500 shadow-sm hover:bg-red-50",
  ghost:       "border border-teal/30 bg-white text-teal shadow-sm hover:bg-teal/5",
};

const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

export function Button({ variant = "midnight", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
