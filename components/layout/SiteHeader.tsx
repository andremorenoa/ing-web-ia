import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/capacidades", label: "Capacidades" },
  { href: "/nosotros", label: "Nosotros" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-steel-700 bg-carbon-950">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="text-[1.05rem] font-bold tracking-[-0.01em]">
          VEKTOR<span className="text-torch-500">·</span>PRECISION CNC
        </Link>
        <nav className="flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-steel-300 hover:text-paper-50"
            >
              {link.label}
            </Link>
          ))}
          <LinkButton href="/#cotizacion" variant="primary" className="h-9 px-4 text-sm">
            Solicitar cotización
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
