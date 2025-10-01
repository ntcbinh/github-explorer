import React from "react";
import type { SelectProps } from "../interfaces";

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, items, ...props }, ref) => {
    const baseClasses =
      "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white";

    return (
      <select ref={ref} className={`${baseClasses} ${className}`.trim()} {...props}>
        {children ??
          items?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    );
  },
);

Select.displayName = "Select";
