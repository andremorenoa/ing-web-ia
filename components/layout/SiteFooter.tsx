import { CONTACT } from "@/lib/content";

const CAPABILITY_LINKS = [
  { href: "/capacidades#maquinados-cnc", label: "Fresado CNC" },
  { href: "/capacidades#maquinados-cnc", label: "Torneado CNC" },
  { href: "/capacidades#herramental-y-troqueles", label: "Shims / lainas" },
  { href: "/capacidades#estampado-y-ensamble", label: "Ensambles" },
];

export function SiteFooter() {
  return (
    <footer className="bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-8 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="mb-2 text-[1.05rem] font-bold tracking-[-0.01em]">
              VEKTOR<span className="text-torch-500">·</span>PRECISION CNC
            </div>
            <p className="max-w-[34ch] text-[0.9375rem] text-steel-400">
              Saltillo, Coahuila, México. Maquinados de precisión para automotriz y nearshoring.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
              Capacidades
            </h4>
            {CAPABILITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-1 text-[0.9375rem] text-steel-300 hover:text-paper-50 focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
              Contacto
            </h4>
            <a
              href={`mailto:${CONTACT.email}`}
              className="block py-1 text-[0.9375rem] text-steel-300 hover:text-paper-50 focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="block py-1 text-[0.9375rem] text-steel-300 hover:text-paper-50 focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
            >
              {CONTACT.phone}
            </a>
            <span className="block py-1 text-[0.9375rem] text-steel-300">{CONTACT.address}</span>
          </div>
        </div>
        <div className="flex justify-between border-t border-steel-700 py-6 text-[0.8125rem] text-steel-400">
          <span>© Vektor Precision CNC</span>
          <span>ISO 9001 en proceso</span>
        </div>
      </div>
    </footer>
  );
}
