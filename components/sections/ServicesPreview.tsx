import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import type { Service } from "@/lib/services";

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="border-b border-steel-700">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <h2 className="mb-10 text-[2.25rem] font-semibold leading-[1.15]">
          Lo que sale del taller cada semana
        </h2>
        <div className="grid gap-px border border-steel-700 bg-steel-700 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="bg-steel-900 p-6 transition-colors hover:bg-steel-800"
            >
              <span className="font-mono text-xs text-steel-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-4 mt-2 text-[1.375rem] font-semibold">{service.name}</h3>
              <ul className="mb-5 space-y-1 font-mono text-[0.9375rem] text-steel-300">
                {service.specs.slice(0, 2).map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
              <Link
                href={`/capacidades#${service.id}`}
                className="text-sm text-torch-400 hover:underline focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
              >
                Ver ficha
              </Link>
            </article>
          ))}
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
