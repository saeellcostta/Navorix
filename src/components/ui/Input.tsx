import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, leftAdornment, rightAdornment, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAdornment && (
            <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
              {leftAdornment}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg text-sm font-medium",
              "bg-[var(--surface-2)] text-[var(--text-primary)]",
              "border border-[var(--border)]",
              "px-4 py-2.5 h-11",
              "placeholder:text-[var(--text-muted)]",
              "transition-all duration-150",
              "focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30",
              "hover:border-[var(--border-strong)]",
              leftAdornment  && "pl-10",
              rightAdornment && "pr-10",
              error          && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/30",
              className
            )}
            {...props}
          />
          {rightAdornment && (
            <div className="absolute right-3 text-[var(--text-muted)]">
              {rightAdornment}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-[var(--text-muted)]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[#ef4444]">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";


interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg text-sm font-medium resize-none",
            "bg-[var(--surface-2)] text-[var(--text-primary)]",
            "border border-[var(--border)]",
            "px-4 py-3 min-h-24",
            "placeholder:text-[var(--text-muted)]",
            "transition-all duration-150",
            "focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/30",
            "hover:border-[var(--border-strong)]",
            error && "border-[#ef4444] focus:border-[#ef4444]",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
        {error && <p className="text-xs text-[#ef4444]">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
