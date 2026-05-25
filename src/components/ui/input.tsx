import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3.5 py-2 text-sm transition-all duration-200",
            "placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
            error ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 hover:border-gray-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };
