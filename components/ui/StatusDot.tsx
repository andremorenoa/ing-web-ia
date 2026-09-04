type Status = "available" | "queued" | "rejected";

const STATUS_STYLES: Record<Status, { dot: string; label: string }> = {
  available: { dot: "bg-signal-green", label: "Disponible" },
  queued: { dot: "bg-signal-amber", label: "En cola" },
  rejected: { dot: "bg-signal-red", label: "Fuera de tolerancia" },
};

export function StatusDot({
  status,
  label,
  live = false,
}: {
  status: Status;
  label?: string;
  live?: boolean;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-steel-300">
      <span className="relative flex h-1.5 w-1.5">
        {live && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-pill opacity-75 motion-reduce:animate-none ${style.dot}`}
            aria-hidden="true"
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-pill ${style.dot}`} aria-hidden="true" />
      </span>
      {label ?? style.label}
    </span>
  );
}
