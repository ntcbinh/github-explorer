import { CheckCircle2 } from "../icons";
import type { ReactNode } from "react";

export const StrengthItem = ({ children }: { children: ReactNode | string }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
    <span>{children}</span>
  </li>
);
