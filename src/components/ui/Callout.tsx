import { cn } from "@/lib/utils";
import { semanticColors, type SemanticVariant } from "@/lib/colors";
import type { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
  variant?: SemanticVariant;
  className?: string;
}

export function Callout({ children, variant = "neutral", className }: CalloutProps) {
  const colors = semanticColors[variant];

  return (
    <div className={cn(
      "border-l-[3px] rounded-r-lg px-4 py-3 text-xs leading-relaxed",
      colors.border, colors.bg, colors.text,
      className
    )}>
      {children}
    </div>
  );
}
