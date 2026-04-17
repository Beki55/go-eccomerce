"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-gold-500",
        sizeClasses[size],
        className,
      )}
    />
  );
}

interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({
  message = "Loading...",
  className,
}: LoadingPageProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center bg-background",
        className,
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export function LoadingCard({
  message = "Loading...",
  className,
}: LoadingCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 space-y-4",
        className,
      )}
    >
      <LoadingSpinner size="md" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({
  className,
  lines = 2,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded"></div>
      ))}
    </div>
  );
}

interface LoadingCardSkeletonProps {
  className?: string;
  title?: boolean;
}

export function LoadingCardSkeleton({
  className,
  title = true,
}: LoadingCardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-background p-4 ring-1 ring-border animate-pulse",
        className,
      )}
    >
      {title && <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>}
      <LoadingSkeleton lines={3} />
    </div>
  );
}
