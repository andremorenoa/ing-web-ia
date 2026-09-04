export function DimensionLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-steel-600 ${className}`} aria-hidden="true">
      <span>⊢</span>
      <span className="h-px flex-1 bg-steel-700" />
      <span>⊣</span>
    </div>
  );
}
