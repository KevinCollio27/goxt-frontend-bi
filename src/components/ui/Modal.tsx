"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  /** Render con justify-between: Cancel a la izquierda, acción a la derecha */
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]",
          sizeMap[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-6 py-5 border-b border-gray-100 shrink-0">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center shadow-sm shrink-0">
              <Icon size={16} className="text-ash" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-ink leading-snug">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer — justify-between: Cancel izquierda, acción derecha */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
