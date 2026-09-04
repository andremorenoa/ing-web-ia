import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "tertiary" | "destructive";

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-torch-500 text-carbon-950 hover:bg-torch-600 hover:shadow-[var(--glow-cta-hover)]",
  secondary:
    "bg-transparent text-paper-50 border border-steel-700 hover:border-torch-500/40 hover:bg-steel-900",
  tertiary: "h-auto bg-transparent px-0 text-torch-400 hover:underline",
  destructive:
    "bg-transparent text-signal-red border border-signal-red/40 hover:bg-signal-red/10",
};

const BASE_CLASSES =
  "inline-flex h-11 items-center justify-center gap-2 rounded-chamfer px-5 font-sans text-[0.9375rem] font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-[var(--ring-focus)] disabled:cursor-not-allowed disabled:opacity-40";

export function Button({
  variant = "primary",
  children,
  className = "",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "secondary",
  children,
  className = "",
  href,
  ...rest
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const combinedClassName = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  if (href && (href.startsWith("/") || href.startsWith("#"))) {
    return (
      <Link href={href} className={combinedClassName} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={combinedClassName} {...rest}>
      {children}
    </a>
  );
}
