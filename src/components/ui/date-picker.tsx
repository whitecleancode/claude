"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="date"
          className={cn(
            "w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm",
            "focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50",
            "transition-all duration-200",
            "[color-scheme:dark]",
            error && "border-neon-pink/50 focus:ring-neon-pink/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-neon-pink">{error}</p>}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";
