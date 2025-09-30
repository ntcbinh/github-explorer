import type { ReactNode } from "react";

export const TechTag = ({ children }: { children: ReactNode | string }) => (
  <span className="inline-block bg-gray-100 text-gray-700 font-mono text-xs px-2 py-1 rounded-md border border-gray-200">
    {children}
  </span>
);
