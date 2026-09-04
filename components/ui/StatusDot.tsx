type Status = "available" | "queued" | "rejected";

const STATUS_STYLES: Record<Status, { dot: string; label: string }> = {
  available: { dot: "bg-signal-green", label: "Disponible" },
  queued: { dot: "bg-signal-amber", label: "En cola" },
  rejected: { dot: "bg-signal-red", label: "Fuera de tolerancia" },
};

export function StatusDot({ status, label }: { status: Status; label?: string }) {
  const style = STATUS_STYLES[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-steel-300">
      <span className={`h-1.5 w-1.5 rounded-pill ${style.dot}`} aria-hidden="true" />
      {label ?? style.label}
    </span>
  );
}
