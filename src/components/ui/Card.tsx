"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hoverable?: boolean;
}

export function Card({ className, glow, hoverable, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--surface-1)]",
        "transition-all duration-200",
        hoverable && "hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] cursor-pointer",
        glow && "glow-gold-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-5 py-4",
        "border-b border-[var(--border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("text-base font-semibold text-[var(--text-primary)]", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center px-5 py-4",
        "border-t border-[var(--border)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Stat card for the dashboard */
interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, subValue, trend, icon, className }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:-z-10",
        "before:bg-gradient-to-br before:from-[rgba(251,191,36,0.04)] before:to-transparent",
        className
      )}
    >
      <CardBody className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
          {subValue && (
            <p
              className={cn(
                "text-xs font-medium mt-1",
                isPositive && "text-[var(--positive)]",
                isNegative && "text-[var(--negative)]",
                trend === undefined && "text-[var(--text-secondary)]"
              )}
            >
              {trend !== undefined && (isPositive ? "▲ " : "▼ ")}
              {subValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gold-dim)] text-[var(--gold)]">
            {icon}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
