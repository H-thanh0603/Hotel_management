import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, label, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm transition-all duration-200",
            "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:cursor-not-allowed disabled:opacity-50", className
          )}
          ref={ref} {...props}
        >{children}</select>
      </div>
    );
  }
);
Select.displayName = "Select";
export { Select };
