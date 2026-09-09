"use client";

import { useState } from "react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/capacidades", label: "Capacidades" },
  { href: "/nosotros", label: "Nosotros" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-steel-700 bg-carbon-950">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link
          href="/"
          className="text-[1.05rem] font-bold tracking-[-0.01em]"
          onClick={() => setIsMenuOpen(false)}
        >
          VEKTOR<span className="text-torch-500">·</span>PRECISION CNC
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-steel-300 hover:text-paper-50 focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
            >
              {link.label}
            </Link>
          ))}
          <LinkButton href="/#cotizacion" variant="secondary" className="h-9 px-4 text-sm">
            Solicitar cotización
          </LinkButton>
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-chamfer border border-steel-700 text-paper-50 focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)] md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <MenuIcon open={isMenuOpen} />
        </button>
      </div>
      {isMenuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Menú móvil"
          className="flex flex-col gap-1 border-t border-steel-700 px-6 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-chamfer px-2 py-2.5 text-sm text-steel-300 hover:bg-steel-900 hover:text-paper-50 focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)]"
            >
              {link.label}
            </Link>
          ))}
          <LinkButton href="/#cotizacion" variant="secondary" className="mt-2 w-full justify-center">
            Solicitar cotización
          </LinkButton>
        </nav>
      )}
    </header>
  );
}
