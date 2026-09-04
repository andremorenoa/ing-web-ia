import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { CapabilityChip } from "@/components/ui/CapabilityChip";
import { DataBadge } from "@/components/ui/DataBadge";
import { SERVICE_CARD_IMAGES } from "@/lib/images";
import type { Service } from "@/lib/services";

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="border-b border-steel-700">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <h2 className="mb-10 text-[2.25rem] font-semibold leading-[1.15]">
          Lo que sale del taller cada semana
        </h2>
        <div className="grid gap-px border border-steel-700 bg-steel-700 lg:grid-cols-3">
          {services.map((service, index) => {
            const cardImage = SERVICE_CARD_IMAGES[service.id];
            return (
            <article
              key={service.id}
              className="bg-steel-900 transition-colors hover:bg-steel-800 hover:ring-1 hover:ring-inset hover:ring-torch-500/40"
            >
              {cardImage && (
                <div className="relative aspect-video border-b border-steel-700">
                  <Image
                    src={cardImage.src}
                    alt={cardImage.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
              <span className="font-mono text-xs text-steel-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 mt-2 text-[1.375rem] font-semibold">{service.name}</h3>
              <p className="mb-4 text-sm text-steel-400">{service.description}</p>
              <ul className="mb-4 space-y-1 font-mono text-[0.9375rem] text-steel-300">
                {service.specs.slice(0, 2).map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              <div className="mb-4 flex flex-wrap gap-2">
                {service.materials.slice(0, 3).map((material) => (
                  <CapabilityChip key={material}>{material}</CapabilityChip>
                ))}
              </div>
              <div className="mb-5">
                <DataBadge label="Entrega" value={service.leadTime} />
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <Link
                  href={`/capacidades#${service.id}`}
                  className="text-sm text-torch-400 hover:underline focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
                >
                  Ver ficha
                </Link>
                <LinkButton href="/#cotizacion" variant="tertiary">
                  Cotizar este proceso
                </LinkButton>
              </div>
              </div>
            </article>
            );
          })}
        </div>
        <div className="mt-10">
          <LinkButton href="/capacidades" variant="secondary">
            Ver todas las capacidades
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
