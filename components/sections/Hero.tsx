import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { CapabilityChip } from "@/components/ui/CapabilityChip";
import { CornerTicks } from "@/components/ui/CornerTicks";
import { DimensionLine } from "@/components/ui/DimensionLine";
import { HERO_METRICS } from "@/lib/content";
import type { StockImage } from "@/lib/images";

export function Hero({ image }: { image: StockImage }) {
  return (
    <section className="relative overflow-hidden border-b border-steel-700">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon-950 via-carbon-950/95 to-carbon-950/70" />
      <div className="relative mx-auto max-w-[1280px] px-6 pb-24 pt-16">
        <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <h1 className="mb-5 max-w-[13ch] text-[3rem] font-bold leading-[1.05] tracking-[-0.01em]">
              Maquinados que entran en tolerancia. Punto.
            </h1>
            <p className="mb-8 max-w-[46ch] text-lg text-steel-300">
              Fresado y torneado CNC de precisión, shims a medida y ensambles listos para
              instalar — para plantas que no tienen margen para una pieza fuera de spec.
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              {HERO_METRICS.map((metric) => (
                <CapabilityChip key={metric.label}>
                  {metric.value} <span className="text-steel-400">· {metric.label}</span>
                </CapabilityChip>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <LinkButton href="/#cotizacion" variant="primary">
                Solicitar cotización
              </LinkButton>
              <LinkButton href="/capacidades" variant="tertiary">
                Ver capacidades
              </LinkButton>
            </div>
          </div>
          <div className="relative border border-steel-700 bg-carbon-950/60 p-6 backdrop-blur-sm">
            <CornerTicks />
            <DimensionLine className="mb-2.5" />
            <div className="font-mono text-[3rem] font-semibold leading-none text-readout-400">
              ±0.001″
            </div>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
              Tolerancia mínima garantizada
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
