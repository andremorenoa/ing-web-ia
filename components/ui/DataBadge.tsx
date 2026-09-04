interface DataBadgeProps {
  label: string;
  value: string;
  className?: string;
}

export function DataBadge({ label, value, className = "" }: DataBadgeProps) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-chamfer border border-readout-400/20 bg-readout-950 px-3 py-1.5 ${className}`}
    >
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-steel-400">
        {label}
      </span>
      <span className="font-mono text-[0.9375rem] text-readout-400">{value}</span>
    </span>
  );
}
