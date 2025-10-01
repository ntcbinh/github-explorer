import React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  const baseClasses =
    "w-full pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return <input ref={ref} className={`${baseClasses} ${className}`.trim()} {...props} />;
});

Input.displayName = "Input";
