import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)} role="status" aria-live="polite">
      <div className={cn(
        "bg-nobel-gold rounded-full flex items-center justify-center shadow-lg animate-pulse",
        sizeClasses[size]
      )}
        style={{
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, spin 3s linear infinite"
        }}
      >
        <Shield className={cn("text-white", iconClasses[size])} aria-hidden="true" />
      </div>
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

