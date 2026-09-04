import type { ReactNode } from "react";

export function CapabilityChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-steel-700 px-2.5 py-1.5 font-mono text-[1rem] text-steel-300">
      {children}
    </span>
  );
}
