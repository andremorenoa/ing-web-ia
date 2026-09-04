import { LinkButton } from "@/components/ui/Button";
import { CapabilityChip } from "@/components/ui/CapabilityChip";
import type { Service } from "@/lib/services";

export function ShimsSpotlight({ service }: { service: Service }) {
  return (
    <section className="border-b border-steel-700 bg-carbon-900">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <h2 className="mb-4 text-[2.25rem] font-semibold leading-[1.15]">{service.name}</h2>
          <p className="mb-6 max-w-[52ch] text-lg text-steel-300">
            {service.description} Cortamos por hilo y láser en aceros templados, latón y acero
            inoxidable, con tolerancias de espesor milimétricas.
          </p>
          <div className="mb-6 flex flex-wrap gap-3">
            {service.specs.map((spec) => (
              <CapabilityChip key={spec}>{spec}</CapabilityChip>
            ))}
          </div>
          <p className="mb-8 font-mono text-sm text-steel-400">
            {service.materials.join(" · ")}
          </p>
          <LinkButton href="/#cotizacion" variant="secondary">
            Cotizar shims y lainas
          </LinkButton>
        </div>
        <div className="border border-steel-700 bg-steel-900 p-6">
          <dl className="divide-y divide-steel-700 font-mono text-sm text-readout-400">
            {service.specs.map((spec) => (
              <div key={spec} className="py-3 first:pt-0 last:pb-0">
                {spec}
              </div>
            ))}
            <div className="py-3 first:pt-0 last:pb-0">Entrega {service.leadTime}</div>
          </dl>
        </div>
      </div>
    </section>
  );
}
