import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-semibold px-2.5 py-0.5 leading-none",
  {
    variants: {
      variant: {
        gold:     "bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.3)]",
        green:    "bg-[rgba(34,197,94,0.12)] text-[#22c55e] border border-[rgba(34,197,94,0.25)]",
        red:      "bg-[rgba(239,68,68,0.12)] text-[#ef4444] border border-[rgba(239,68,68,0.25)]",
        blue:     "bg-[rgba(59,130,246,0.12)] text-[#3b82f6] border border-[rgba(59,130,246,0.25)]",
        surface:  "bg-[var(--surface-3)] text-[var(--text-secondary)] border border-[var(--border)]",
        trending: "bg-gradient-to-r from-[rgba(251,191,36,0.2)] to-[rgba(245,158,11,0.1)] text-[#fbbf24] border border-[rgba(251,191,36,0.3)]",
        new:      "bg-[rgba(34,197,94,0.1)] text-[#4ade80] border border-[rgba(34,197,94,0.2)]",
      },
    },
    defaultVariants: {
      variant: "surface",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            variant === "green" || variant === "new" ? "bg-[#22c55e]" : "",
            variant === "red"   ? "bg-[#ef4444]"  : "",
            variant === "gold" || variant === "trending" ? "bg-[#fbbf24]" : "",
          )}
        />
      )}
      {children}
    </span>
  );
}
