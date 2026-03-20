"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  const borderColors = {
    success: "border-l-success",
    error: "border-l-error",
    info: "border-l-muted",
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg border border-border border-l-4 ${borderColors[type]} bg-card px-4 py-3 shadow-lg animate-in slide-in-from-right-full duration-300`}
      role="alert"
    >
      <p className="text-sm text-foreground">{message}</p>
      <button
        onClick={onClose}
        className="text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none [&>*]:pointer-events-auto">
      {children}
    </div>
  );
}
