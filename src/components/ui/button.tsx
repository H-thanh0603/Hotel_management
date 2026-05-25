import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants: Record<string, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200",
      outline: "border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
      secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
      success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200",
    };
    const sizes: Record<string, string> = {
      default: "h-10 px-5 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-8 text-base",
      icon: "h-9 w-9",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
          variants[variant], sizes[size], className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
export type { ButtonProps };
