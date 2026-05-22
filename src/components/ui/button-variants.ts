import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold text-sm leading-none",
    "rounded-lg transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
    "disabled:opacity-50 disabled:pointer-events-none",
    "cursor-pointer select-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-[#fbbf24] to-[#d97706]",
          "text-[#08080f]",
          "hover:from-[#fcd34d] hover:to-[#f59e0b]",
          "shadow-[0_0_16px_rgba(251,191,36,0.25)]",
          "hover:shadow-[0_0_24px_rgba(251,191,36,0.4)]",
        ],
        secondary: [
          "bg-[var(--surface-3)] text-[var(--text-primary)]",
          "border border-[var(--border)]",
          "hover:border-[var(--border-strong)] hover:bg-[var(--surface-4)]",
        ],
        outline: [
          "bg-transparent text-[var(--gold)]",
          "border border-[var(--border-strong)]",
          "hover:bg-[var(--gold-dim)] hover:shadow-[var(--gold-glow)]",
        ],
        ghost: [
          "bg-transparent text-[var(--text-secondary)]",
          "hover:bg-[var(--surface-3)] hover:text-[var(--text-primary)]",
        ],
        danger: [
          "bg-[#ef4444]/10 text-[#ef4444]",
          "border border-[#ef4444]/30",
          "hover:bg-[#ef4444]/20 hover:border-[#ef4444]/50",
        ],
        buy: [
          "bg-gradient-to-r from-[#22c55e] to-[#16a34a]",
          "text-white font-bold",
          "hover:from-[#4ade80] hover:to-[#22c55e]",
          "shadow-[0_0_16px_rgba(34,197,94,0.2)]",
          "hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]",
        ],
        sell: [
          "bg-gradient-to-r from-[#ef4444] to-[#dc2626]",
          "text-white font-bold",
          "hover:from-[#f87171] hover:to-[#ef4444]",
          "shadow-[0_0_16px_rgba(239,68,68,0.2)]",
          "hover:shadow-[0_0_24px_rgba(239,68,68,0.35)]",
        ],
      },
      size: {
        xs:   "h-7  px-3 text-xs rounded-md",
        sm:   "h-8  px-4 text-xs",
        md:   "h-10 px-5 text-sm",
        lg:   "h-12 px-7 text-base",
        xl:   "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
