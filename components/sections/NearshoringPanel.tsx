import { DataBadge } from "@/components/ui/DataBadge";
import { NEARSHORING_FACTS } from "@/lib/content";

export function NearshoringPanel() {
  return (
    <section className="border-b border-steel-700 bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Ventaja logística
        </span>
        <h2 className="mb-10 max-w-[28ch] text-[2.25rem] font-semibold leading-[1.15]">
          Saltillo está a 3 horas de la frontera, no a 3 semanas de barco.
        </h2>
        <div className="flex flex-wrap gap-4">
          {NEARSHORING_FACTS.map((fact) => (
            <DataBadge key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
