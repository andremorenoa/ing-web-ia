# Vektor Precision CNC — Sitio Web (Home / Nosotros / Capacidades) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three main pages of the Vektor Precision CNC marketing site (Home, Nosotros/Planta, Capacidades y Servicios) on the existing Next.js 16 / React 19 / Tailwind v4 scaffold, fully wired to the design system in `docs/design/` and the real service data in `docs/services.csv`.

**Architecture:** Data fetching happens only inside the three `app/**/page.tsx` Server Components (reading `docs/services.csv` via `lib/services.ts`, and static copy from `lib/content.ts` / `lib/images.ts`). Every presentational piece — UI primitives (`components/ui/`), layout shell (`components/layout/`), and page sections (`components/sections/`, `components/services/`) — is a synchronous component that receives data through props, so it can be unit-tested with React Testing Library without needing to render an async Server Component inside Vitest. The design tokens already documented in `docs/design/tokens.css` are imported into `app/globals.css` and consumed as Tailwind v4 utilities (`bg-torch-500`, `rounded-chamfer`, etc.) exactly as specified in `docs/design/03-components.md` — no new colors, radii, or shadows are invented outside that file. Stock photography is hotlinked from the Pexels CDN (`images.pexels.com`) via `next/image`, sourced live with WebSearch/WebFetch at execution time — no photo URL is fabricated.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript 5. Testing added by this plan: Vitest + React Testing Library + jsdom.

**Spec:**
- User brief (this conversation): 3 pages, hero with technical metrics (±0.001″, <24h, 63 HRC), Saltillo↔Laredo nearshoring advantage (300 km / 3 hrs, T-MEC, sin fletes marítimos), visible "Solicitar Cotización" CTA to a technical form, Nosotros page (historia, calidad, metrología, compromiso Tier 1/2), Capacidades page rendering all of `docs/services.csv` as a technical catalog, Pexels stock photography throughout.
- `docs/design/00-brief.md`, `01-style-guide.md`, `02-tokens.md`, `03-components.md`, `tokens.css`, `style-guide.html` — the design system this build must comply with.
- `docs/services.csv` — the 15-row services dataset the Capacidades page must render in full.

## Global Constraints

- Reuse `docs/design/tokens.css` tokens exclusively — no hardcoded hex colors, no gray `box-shadow`, no font-family outside `--font-sans` (Archivo) / `--font-mono` (IBM Plex Mono). If a class isn't already demonstrated in `docs/design/03-components.md` or `style-guide.html`, it must still map to an existing token.
- `radius-none` on panels/cards/tables/sections; `radius-chamfer` (2px, `rounded-chamfer`) on buttons/inputs/badges/chips; `radius-pill` only on the live-status dot.
- `torch-*` colors only on actionable elements (CTAs, links, active/focus state, brand mark). `readout-*` colors only on reported data/metrics. Never combined on one element.
- IBM Plex Mono (`font-mono`) only wraps real technical data (tolerances, hardness, dimensions, lead times, machine/material names). Prose stays in Archivo (`font-sans`, the default).
- Content is in Spanish throughout, matching `docs/design/01-style-guide.md` §6 voice/tone — concrete technical vocabulary, no generic corporate language, no decorative ALL-CAPS eyebrows, no arrow-suffixed CTAs.
- The services catalog is data-driven: `docs/services.csv` is the single source of truth. Nothing about individual services is hardcoded into components — add a row to the CSV and it must appear on `/capacidades` and (if `featured=TRUE`) in the homepage preview without touching component code.
- Category order on `/capacidades` is fixed and matches the CSV's real category names exactly: `Maquinados CNC`, `Herramental y Troqueles`, `Estampado y Ensamble`, `Acabados y Tratamientos`.
- Stock photography comes only from images actually found and verified via WebSearch/WebFetch at execution time (real `images.pexels.com` URLs, checked to resolve). Never invent a `pexels.com/photos/<id>` URL.
- No backend/API/email-sending is in scope for this plan — the quote form (`#cotizacion`) is structurally complete (labels, fields, submit button) per `docs/design/03-components.md`, but wiring it to a real submission endpoint is explicitly future work, out of scope here.
- Package manager is npm (`package-lock.json` present, no other lockfile). Path alias `@/*` → project root already configured in `tsconfig.json`.

---

### Task 1: Test tooling (Vitest + React Testing Library)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/smoke.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` runs Vitest once (CI mode); `@testing-library/jest-dom` matchers (`toBeInTheDocument`, etc.) available in every `*.test.ts(x)` file after importing `vitest.setup.ts` as a setup file; path alias `@/*` resolvable from test files.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/dom
```

- [ ] **Step 2: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Write a failing smoke test — `lib/smoke.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("test tooling", () => {
  it("runs and resolves the @ alias", async () => {
    const pkg = await import("@/package.json");
    expect(pkg.default.name).toBe("ing-web-ia");
  });
});
```

- [ ] **Step 5: Add the `test` script to `package.json`**

Add under `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 6: Run the test and confirm it passes**

Run: `npm test`
Expected: `lib/smoke.test.ts` passes, 1 test, 0 failures. If the `@/package.json` import fails to resolve JSON, confirm `resolveJsonModule: true` is set in `tsconfig.json` (it already is).

- [ ] **Step 7: Delete the throwaway smoke test**

The smoke test served only to prove the tooling works — remove `lib/smoke.test.ts` now (real tests start in Task 3).

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "test: add Vitest + React Testing Library tooling"
```

---

### Task 2: Design tokens, fonts, and remote image config

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `next.config.ts`

**Interfaces:**
- Consumes: `docs/design/tokens.css` (all `--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--spacing-*` tokens)
- Produces: Tailwind utilities for every token in `docs/design/tokens.css` (e.g. `bg-torch-500`, `rounded-chamfer`, `font-mono`) become available to every component written in later tasks; `next/image` accepts `https://images.pexels.com/**` as a remote source.

- [ ] **Step 1: Import the token file and replace scaffold styling in `app/globals.css`**

Replace the full contents of `app/globals.css` with:

```css
@import "tailwindcss";
@import "../docs/design/tokens.css";

body {
  background: var(--color-carbon-950);
  color: var(--color-paper-50);
  font-family: var(--font-sans);
}
```

- [ ] **Step 2: Swap Geist for Archivo / IBM Plex Mono in `app/layout.tsx`**

Replace the font imports and metadata in `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vektor Precision CNC — Maquinados de precisión en Saltillo",
  description:
    "Fresado y torneado CNC de precisión, shims a medida, herramental y ensambles para automotriz y nearshoring en Saltillo, Coahuila.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

Note: `SiteHeader`/`SiteFooter` don't exist yet — they're built in Task 6. This task's build check (Step 4) will fail until then, which is expected; re-run it after Task 6 lands, or implement Tasks 2 and 6 back-to-back.

- [ ] **Step 3: Point `--font-sans` / `--font-mono` at the loaded font variables**

`docs/design/tokens.css` defines `--font-sans` and `--font-mono` as literal family names. Override them with the `next/font` CSS variables by adding this block to `app/globals.css`, after the `@import` lines:

```css
:root {
  --font-sans: var(--font-archivo), system-ui, sans-serif;
  --font-mono: var(--font-ibm-plex-mono), ui-monospace, monospace;
}
```

- [ ] **Step 4: Allow Pexels-hosted images in `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Verify with a build (once Task 6 also lands)**

Run: `npm run build`
Expected: build succeeds with no CSS/font errors. (If run before Task 6, expect a module-not-found error for `@/components/layout/SiteHeader` — that's the known dependency noted in Step 2, not a bug in this task.)

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx next.config.ts
git commit -m "feat: wire design tokens, Archivo/IBM Plex Mono fonts, and Pexels image config"
```

---

### Task 3: Shared content constants

**Files:**
- Create: `lib/content.ts`
- Test: `lib/content.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `HERO_METRICS: { label: string; value: string }[]`, `NEARSHORING_FACTS: { label: string; value: string }[]`, `CONTACT: { email: string; phone: string; phoneHref: string; address: string }` — imported by `Hero`, `NearshoringPanel`, and `SiteFooter` in later tasks.

- [ ] **Step 1: Write the failing test — `lib/content.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { CONTACT, HERO_METRICS, NEARSHORING_FACTS } from "@/lib/content";

describe("HERO_METRICS", () => {
  it("has the three technical metrics from the brief, in order", () => {
    expect(HERO_METRICS.map((m) => m.value)).toEqual(["±0.001″", "<24 h", "63 HRC"]);
  });
});

describe("NEARSHORING_FACTS", () => {
  it("includes the Saltillo-Laredo logistics facts from the brief", () => {
    const values = NEARSHORING_FACTS.map((f) => f.value);
    expect(values).toEqual(["300 km", "3 hrs", "T-MEC", "Sin fletes marítimos"]);
  });
});

describe("CONTACT", () => {
  it("has a matching phone and phoneHref", () => {
    expect(CONTACT.phoneHref).toBe("tel:+528440000000");
    expect(CONTACT.email).toBe("cotizaciones@vektorcnc.mx");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/content.test.ts`
Expected: FAIL — `Cannot find module '@/lib/content'`

- [ ] **Step 3: Write `lib/content.ts`**

```ts
export const HERO_METRICS = [
  { label: "Tolerancia mínima", value: "±0.001″" },
  { label: "Cotización", value: "<24 h" },
  { label: "Dureza máxima", value: "63 HRC" },
];

export const NEARSHORING_FACTS = [
  { label: "Distancia a Laredo, TX", value: "300 km" },
  { label: "Tiempo en carretera", value: "3 hrs" },
  { label: "Tratado", value: "T-MEC" },
  { label: "Flete", value: "Sin fletes marítimos" },
];

export const CONTACT = {
  email: "cotizaciones@vektorcnc.mx",
  phone: "+52 844 000 0000",
  phoneHref: "tel:+528440000000",
  address: "Parque Industrial, Saltillo, Coahuila, México",
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/content.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts lib/content.test.ts
git commit -m "feat: add shared hero/nearshoring/contact content constants"
```

---

### Task 4: Services data layer (reads `docs/services.csv`)

**Files:**
- Create: `lib/services.ts`
- Test: `lib/services.test.ts`

**Interfaces:**
- Consumes: `docs/services.csv` (file on disk, relative to `process.cwd()`)
- Produces:
  - `type ServiceCategory = "Maquinados CNC" | "Herramental y Troqueles" | "Estampado y Ensamble" | "Acabados y Tratamientos"`
  - `interface Service { id: string; name: string; category: ServiceCategory; description: string; materials: string[]; specs: string[]; leadTime: string; featured: boolean }`
  - `interface CategoryGroup { category: ServiceCategory; services: Service[] }`
  - `SERVICE_CATEGORIES: ServiceCategory[]`
  - `parseServicesCsv(csvText: string): Service[]`
  - `getServices(): Service[]`
  - `getServicesByCategory(services?: Service[]): CategoryGroup[]`
  - `getFeaturedServices(services?: Service[]): Service[]`
  - Consumed by `ServicesPreview` (Task 10), `CategorySection` (Task 15), and `app/page.tsx` / `app/capacidades/page.tsx` (Tasks 12, 16).

- [ ] **Step 1: Write the failing tests — `lib/services.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  SERVICE_CATEGORIES,
  getFeaturedServices,
  getServices,
  getServicesByCategory,
  parseServicesCsv,
} from "@/lib/services";

const FIXTURE_CSV = `"id","name","category","description","materials","specs","lead_time","featured"
"a-1","Fresado de prueba","Maquinados CNC","Una descripción, con coma adentro.","Aluminio 6061, Acero 4140","Tolerancia ±0.001″; Mesa 2000 mm","24-48 hrs","TRUE"
"b-1","Anodizado de prueba","Acabados y Tratamientos","Otra descripción.","Aluminio 6061","Espesor 10 micras","3-5 días","FALSE"
`;

describe("parseServicesCsv", () => {
  it("parses quoted fields with embedded commas correctly", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    expect(services).toHaveLength(2);
    expect(services[0]).toEqual({
      id: "a-1",
      name: "Fresado de prueba",
      category: "Maquinados CNC",
      description: "Una descripción, con coma adentro.",
      materials: ["Aluminio 6061", "Acero 4140"],
      specs: ["Tolerancia ±0.001″", "Mesa 2000 mm"],
      leadTime: "24-48 hrs",
      featured: true,
    });
  });

  it("parses featured=FALSE as false", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    expect(services[1].featured).toBe(false);
  });
});

describe("getServicesByCategory", () => {
  it("groups services in the fixed SERVICE_CATEGORIES order and drops empty categories", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    const groups = getServicesByCategory(services);
    expect(groups.map((g) => g.category)).toEqual(["Maquinados CNC", "Acabados y Tratamientos"]);
    expect(groups[0].services).toHaveLength(1);
  });
});

describe("getFeaturedServices", () => {
  it("returns only featured=true services", () => {
    const services = parseServicesCsv(FIXTURE_CSV);
    expect(getFeaturedServices(services).map((s) => s.id)).toEqual(["a-1"]);
  });
});

describe("getServices (real docs/services.csv)", () => {
  it("reads and parses all 15 real services", () => {
    const services = getServices();
    expect(services).toHaveLength(15);
    for (const service of services) {
      expect(SERVICE_CATEGORIES).toContain(service.category);
      expect(service.id).toMatch(/^[a-z]+-\d{3}$/);
    }
  });

  it("includes the exact featured set from docs/services.csv", () => {
    const featured = getFeaturedServices(getServices()).map((s) => s.id).sort();
    expect(featured).toEqual(["cnc-001", "cnc-003", "est-003", "her-001", "her-002"]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- lib/services.test.ts`
Expected: FAIL — `Cannot find module '@/lib/services'`

- [ ] **Step 3: Write `lib/services.ts`**

```ts
import fs from "node:fs";
import path from "node:path";

export type ServiceCategory =
  | "Maquinados CNC"
  | "Herramental y Troqueles"
  | "Estampado y Ensamble"
  | "Acabados y Tratamientos";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  materials: string[];
  specs: string[];
  leadTime: string;
  featured: boolean;
}

export interface CategoryGroup {
  category: ServiceCategory;
  services: Service[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Maquinados CNC",
  "Herramental y Troqueles",
  "Estampado y Ensamble",
  "Acabados y Tratamientos",
];

export function parseServicesCsv(csvText: string): Service[] {
  const rows = parseCsvRows(csvText);
  const [header, ...dataRows] = rows;
  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => {
      const record: Record<string, string> = {};
      header.forEach((key, i) => {
        record[key] = row[i] ?? "";
      });
      return {
        id: record.id,
        name: record.name,
        category: record.category as ServiceCategory,
        description: record.description,
        materials: splitList(record.materials, ","),
        specs: splitList(record.specs, ";"),
        leadTime: record.lead_time,
        featured: record.featured.trim().toUpperCase() === "TRUE",
      };
    });
}

export function getServices(): Service[] {
  const csvPath = path.join(process.cwd(), "docs", "services.csv");
  const csvText = fs.readFileSync(csvPath, "utf8");
  return parseServicesCsv(csvText);
}

export function getServicesByCategory(services: Service[] = getServices()): CategoryGroup[] {
  return SERVICE_CATEGORIES.map((category) => ({
    category,
    services: services.filter((s) => s.category === category),
  })).filter((group) => group.services.length > 0);
}

export function getFeaturedServices(services: Service[] = getServices()): Service[] {
  return services.filter((s) => s.featured);
}

function splitList(value: string, separator: string): string[] {
  return value
    .split(separator)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- lib/services.test.ts`
Expected: PASS, 6 tests. If the "real docs/services.csv" tests fail on the featured-id list, run `node -e "console.log(require('fs').readFileSync('docs/services.csv','utf8'))"` and confirm which rows currently have `featured=TRUE` — update the assertion to match reality, don't edit the CSV to match the test.

- [ ] **Step 5: Commit**

```bash
git add lib/services.ts lib/services.test.ts
git commit -m "feat: add services CSV data layer with category grouping"
```

---

### Task 5: UI primitives

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/DataBadge.tsx`
- Create: `components/ui/CapabilityChip.tsx`
- Create: `components/ui/StatusDot.tsx`
- Create: `components/ui/DimensionLine.tsx`
- Create: `components/ui/CornerTicks.tsx`
- Test: `components/ui/Button.test.tsx`
- Test: `components/ui/DataBadge.test.tsx`
- Test: `components/ui/StatusDot.test.tsx`

**Interfaces:**
- Consumes: nothing (pure presentational, styled with Tailwind utilities from Task 2's tokens)
- Produces:
  - `Button({ variant?: "primary" | "secondary" | "tertiary" | "destructive", children, className?, ...ButtonHTMLAttributes })`
  - `LinkButton({ variant?, children, className?, ...AnchorHTMLAttributes })` (renders `<a>`)
  - `DataBadge({ label: string, value: string, className? })`
  - `CapabilityChip({ children: ReactNode })`
  - `StatusDot({ status: "available" | "queued" | "rejected", label?: string })`
  - `DimensionLine({ className? })`
  - `CornerTicks()`
  - All consumed by `Hero`, `NearshoringPanel`, `ServicesPreview`, `SiteHeader`, `SiteFooter`, `QuoteForm` in later tasks.

- [ ] **Step 1: Write the failing test — `components/ui/Button.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, LinkButton } from "@/components/ui/Button";

describe("Button", () => {
  it("renders the primary variant with the action-accent background class", () => {
    render(<Button variant="primary">Solicitar cotización</Button>);
    const button = screen.getByRole("button", { name: "Solicitar cotización" });
    expect(button.className).toContain("bg-torch-500");
  });

  it("defaults to the primary variant", () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole("button").className).toContain("bg-torch-500");
  });
});

describe("LinkButton", () => {
  it("renders an anchor with the given href", () => {
    render(
      <LinkButton href="/capacidades" variant="secondary">
        Ver capacidades
      </LinkButton>,
    );
    const link = screen.getByRole("link", { name: "Ver capacidades" });
    expect(link).toHaveAttribute("href", "/capacidades");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/ui/Button.test.tsx`
Expected: FAIL — `Cannot find module '@/components/ui/Button'`

- [ ] **Step 3: Write `components/ui/Button.tsx`**

```tsx
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
    "bg-transparent text-paper-50 border border-steel-700 hover:border-steel-600 hover:bg-steel-900",
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
  ...rest
}: BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/ui/Button.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 5: Write the failing test — `components/ui/DataBadge.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataBadge } from "@/components/ui/DataBadge";

describe("DataBadge", () => {
  it("renders the label and the mono-styled value", () => {
    render(<DataBadge label="Tolerancia" value="±0.001″" />);
    expect(screen.getByText("Tolerancia")).toBeInTheDocument();
    expect(screen.getByText("±0.001″")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails, then write `components/ui/DataBadge.tsx`**

Run: `npm test -- components/ui/DataBadge.test.tsx` — expect FAIL (module not found).

```tsx
interface DataBadgeProps {
  label: string;
  value: string;
  className?: string;
}

export function DataBadge({ label, value, className = "" }: DataBadgeProps) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 rounded-chamfer border border-readout-400/20 bg-readout-950 px-3 py-1.5 ${className}`}
    >
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-steel-400">
        {label}
      </span>
      <span className="font-mono text-[0.9375rem] text-readout-400">{value}</span>
    </span>
  );
}
```

Run: `npm test -- components/ui/DataBadge.test.tsx` — expect PASS.

- [ ] **Step 7: Write the failing test — `components/ui/StatusDot.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusDot } from "@/components/ui/StatusDot";

describe("StatusDot", () => {
  it("renders the default label for the available status", () => {
    render(<StatusDot status="available" />);
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("renders a custom label when given one", () => {
    render(<StatusDot status="queued" label="En cola (2 d)" />);
    expect(screen.getByText("En cola (2 d)")).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run test to verify it fails, then write `components/ui/StatusDot.tsx`**

Run: `npm test -- components/ui/StatusDot.test.tsx` — expect FAIL (module not found).

```tsx
type Status = "available" | "queued" | "rejected";

const STATUS_STYLES: Record<Status, { dot: string; label: string }> = {
  available: { dot: "bg-signal-green", label: "Disponible" },
  queued: { dot: "bg-signal-amber", label: "En cola" },
  rejected: { dot: "bg-signal-red", label: "Fuera de tolerancia" },
};

export function StatusDot({ status, label }: { status: Status; label?: string }) {
  const style = STATUS_STYLES[status];
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-steel-300">
      <span className={`h-1.5 w-1.5 rounded-pill ${style.dot}`} aria-hidden="true" />
      {label ?? style.label}
    </span>
  );
}
```

Run: `npm test -- components/ui/StatusDot.test.tsx` — expect PASS.

- [ ] **Step 9: Write the remaining pure-decorative primitives (no test — no logic to assert beyond "it renders", covered indirectly when `Hero` renders in Task 8)**

`components/ui/CapabilityChip.tsx`:

```tsx
import type { ReactNode } from "react";

export function CapabilityChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-steel-700 px-2.5 py-1.5 font-mono text-[1rem] text-steel-300">
      {children}
    </span>
  );
}
```

`components/ui/DimensionLine.tsx`:

```tsx
export function DimensionLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 text-steel-600 ${className}`} aria-hidden="true">
      <span>⊢</span>
      <span className="h-px flex-1 bg-steel-700" />
      <span>⊣</span>
    </div>
  );
}
```

`components/ui/CornerTicks.tsx`:

```tsx
export function CornerTicks() {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-torch-500"
      />
      <span
        aria-hidden="true"
        className="absolute -right-px -bottom-px h-3 w-3 border-b-2 border-r-2 border-torch-500"
      />
    </>
  );
}
```

- [ ] **Step 10: Run the full primitives test suite**

Run: `npm test -- components/ui`
Expected: PASS, 6 tests across 3 files.

- [ ] **Step 11: Commit**

```bash
git add components/ui
git commit -m "feat: add UI primitives (Button, DataBadge, CapabilityChip, StatusDot, DimensionLine, CornerTicks)"
```

---

### Task 6: Site header and footer

**Files:**
- Create: `components/layout/SiteHeader.tsx`
- Create: `components/layout/SiteFooter.tsx`
- Test: `components/layout/SiteHeader.test.tsx`
- Test: `components/layout/SiteFooter.test.tsx`

**Interfaces:**
- Consumes: `Button.LinkButton` (Task 5), `CONTACT` (Task 3)
- Produces: `SiteHeader()`, `SiteFooter()` — no props, imported directly into `app/layout.tsx` (Task 2, Step 2).

- [ ] **Step 1: Write the failing test — `components/layout/SiteHeader.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
  it("links to the three main routes and the quote CTA", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /capacidades/i })).toHaveAttribute(
      "href",
      "/capacidades",
    );
    expect(screen.getByRole("link", { name: /nosotros/i })).toHaveAttribute("href", "/nosotros");
    expect(screen.getByRole("link", { name: "Solicitar cotización" })).toHaveAttribute(
      "href",
      "/#cotizacion",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/layout/SiteHeader.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/layout/SiteHeader.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/layout/SiteHeader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write the failing test — `components/layout/SiteFooter.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  it("renders the contact email and phone from CONTACT", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "cotizaciones@vektorcnc.mx" })).toHaveAttribute(
      "href",
      "mailto:cotizaciones@vektorcnc.mx",
    );
    expect(screen.getByRole("link", { name: "+52 844 000 0000" })).toHaveAttribute(
      "href",
      "tel:+528440000000",
    );
  });
});
```

- [ ] **Step 6: Run test to verify it fails, then write `components/layout/SiteFooter.tsx`**

Run: `npm test -- components/layout/SiteFooter.test.tsx` — expect FAIL (module not found).

```tsx
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
                className="block py-1 text-[0.9375rem] text-steel-300 hover:text-paper-50"
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
              className="block py-1 text-[0.9375rem] text-steel-300 hover:text-paper-50"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.phoneHref}
              className="block py-1 text-[0.9375rem] text-steel-300 hover:text-paper-50"
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
```

Run: `npm test -- components/layout/SiteFooter.test.tsx` — expect PASS.

- [ ] **Step 7: Commit**

```bash
git add components/layout
git commit -m "feat: add SiteHeader and SiteFooter"
```

---

### Task 7: Source and register stock photography

**Files:**
- Create: `lib/images.ts`

**Interfaces:**
- Consumes: live web access (WebSearch/WebFetch) — performed at execution time, not fabricated
- Produces: `interface StockImage { src: string; alt: string; width: number; height: number; credit: { photographer: string; url: string } }`, `IMAGES: { heroMachining: StockImage; plantOverview: StockImage; metrology: StockImage; capabilitiesHeader: StockImage }` — consumed by `Hero` (Task 8), `app/nosotros/page.tsx` (Task 14), `app/capacidades/page.tsx` (Task 16).

**This task requires live web access and must not fabricate URLs.** Per the Global Constraints and the standing rule against guessing URLs, every `src` below must be a real `images.pexels.com` URL that was actually found and verified during execution — never a plausible-looking placeholder ID.

- [ ] **Step 1: Search Pexels for four themed photos**

Using WebSearch (or by browsing pexels.com directly), find one licensable photo for each theme, per `docs/design/01-style-guide.md` §5 (macro shots, single hard directional light, no posed "worker smiling at camera" stock clichés):

| Key | Theme | Search terms to try |
|---|---|---|
| `heroMachining` | CNC mill or lathe actively cutting metal, coolant/swarf visible | "CNC machining close up", "metal lathe cutting", "CNC milling machine" |
| `plantOverview` | Wide shot of an industrial machine shop floor | "machine shop factory floor", "industrial manufacturing plant" |
| `metrology` | Precision measurement — calipers, micrometer, or CMM on a metal part | "precision measurement caliper metal", "micrometer engineering" |
| `capabilitiesHeader` | Macro of finished/raw machined metal parts | "machined metal parts close up", "steel components macro" |

- [ ] **Step 2: Open each candidate photo's Pexels page and copy its real CDN URL**

For each theme, open the chosen photo's page (`https://www.pexels.com/photo/<slug>-<id>/`) and get the actual `images.pexels.com/photos/<id>/<filename>.jpeg` URL (visible in the page's download link or `<img>` source) — do not construct this URL from the slug/id by pattern-guessing.

- [ ] **Step 3: Verify each URL actually resolves**

Run (once per URL, substituting the real one found in Step 2):

```bash
curl -sI "https://images.pexels.com/photos/<id>/<filename>.jpeg" | head -1
```

Expected: `HTTP/2 200` (or `HTTP/1.1 200`). If a URL 404s, go back to Step 2 and re-copy it — Pexels filenames encode a specific size/crop, so a slightly-off filename will 404 even for a real photo id.

- [ ] **Step 4: Write `lib/images.ts` with the four verified images**

```ts
export interface StockImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: { photographer: string; url: string };
}

export const IMAGES: {
  heroMachining: StockImage;
  plantOverview: StockImage;
  metrology: StockImage;
  capabilitiesHeader: StockImage;
} = {
  // Fill each entry with the URL verified in Step 3, the photographer name
  // and profile URL shown on that photo's Pexels page, and the image's
  // actual pixel dimensions (also shown on the Pexels page).
  heroMachining: {
    src: "REPLACE_WITH_VERIFIED_PEXELS_URL",
    alt: "Fresadora CNC cortando una pieza metálica, con refrigerante en el punto de corte",
    width: 1920,
    height: 1280,
    credit: { photographer: "REPLACE", url: "REPLACE" },
  },
  plantOverview: {
    src: "REPLACE_WITH_VERIFIED_PEXELS_URL",
    alt: "Piso de planta de un taller de maquinado industrial con varios centros CNC",
    width: 1920,
    height: 1280,
    credit: { photographer: "REPLACE", url: "REPLACE" },
  },
  metrology: {
    src: "REPLACE_WITH_VERIFIED_PEXELS_URL",
    alt: "Calibrador de precisión midiendo una pieza metálica maquinada",
    width: 1920,
    height: 1280,
    credit: { photographer: "REPLACE", url: "REPLACE" },
  },
  capabilitiesHeader: {
    src: "REPLACE_WITH_VERIFIED_PEXELS_URL",
    alt: "Piezas metálicas maquinadas de precisión en primer plano",
    width: 1920,
    height: 1280,
    credit: { photographer: "REPLACE", url: "REPLACE" },
  },
};
```

Replace every `REPLACE*` placeholder with the real values from Steps 1–3 before moving on — this file is not done until all four are real, verified URLs.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors referencing `lib/images.ts`.

- [ ] **Step 6: Commit**

```bash
git add lib/images.ts
git commit -m "feat: register verified Pexels stock photography for hero/about/capacidades"
```

---

### Task 8: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Test: `components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `HERO_METRICS` (Task 3), `LinkButton` (Task 5), `DimensionLine`, `CornerTicks` (Task 5), `StockImage` type + `IMAGES.heroMachining` (Task 7)
- Produces: `Hero({ image: StockImage })` — used in `app/page.tsx` (Task 12).

- [ ] **Step 1: Write the failing test — `components/sections/Hero.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";
import type { StockImage } from "@/lib/images";

const FIXTURE_IMAGE: StockImage = {
  src: "https://images.pexels.com/photos/1/test.jpeg",
  alt: "Fresadora CNC de prueba",
  width: 1920,
  height: 1280,
  credit: { photographer: "Test", url: "https://pexels.com/@test" },
};

describe("Hero", () => {
  it("shows the three technical metrics and the quote CTA", () => {
    render(<Hero image={FIXTURE_IMAGE} />);
    expect(screen.getByText("±0.001″")).toBeInTheDocument();
    expect(screen.getByText("<24 h")).toBeInTheDocument();
    expect(screen.getByText("63 HRC")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar cotización" })).toHaveAttribute(
      "href",
      "/#cotizacion",
    );
  });

  it("renders the hero image with its alt text", () => {
    render(<Hero image={FIXTURE_IMAGE} />);
    expect(screen.getByAltText("Fresadora CNC de prueba")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/Hero.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/sections/Hero.tsx`**

```tsx
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
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
            <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
              Saltillo, Coahuila — automotriz &amp; nearshoring
            </span>
            <h1 className="mb-5 max-w-[13ch] text-[3.4rem] font-bold leading-[1.05] tracking-[-0.01em]">
              Maquinados que entran en tolerancia. Punto.
            </h1>
            <p className="mb-8 max-w-[46ch] text-lg text-steel-300">
              Fresado y torneado CNC de precisión, shims a medida y ensambles listos para
              instalar — para plantas que no tienen margen para una pieza fuera de spec.
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              {HERO_METRICS.map((metric) => (
                <span
                  key={metric.label}
                  className="border border-steel-700 px-2.5 py-1.5 font-mono text-[0.8125rem] text-steel-300"
                >
                  {metric.value} <span className="text-steel-400">· {metric.label}</span>
                </span>
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/Hero.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Hero.tsx components/sections/Hero.test.tsx
git commit -m "feat: add Hero section with technical metrics and quote CTA"
```

---

### Task 9: Nearshoring panel

**Files:**
- Create: `components/sections/NearshoringPanel.tsx`
- Test: `components/sections/NearshoringPanel.test.tsx`

**Interfaces:**
- Consumes: `NEARSHORING_FACTS` (Task 3), `DataBadge` (Task 5)
- Produces: `NearshoringPanel()` — no props, used in `app/page.tsx` (Task 12).

- [ ] **Step 1: Write the failing test — `components/sections/NearshoringPanel.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NearshoringPanel } from "@/components/sections/NearshoringPanel";

describe("NearshoringPanel", () => {
  it("shows the Saltillo-Laredo logistics facts", () => {
    render(<NearshoringPanel />);
    expect(screen.getByText("300 km")).toBeInTheDocument();
    expect(screen.getByText("3 hrs")).toBeInTheDocument();
    expect(screen.getByText("T-MEC")).toBeInTheDocument();
    expect(screen.getByText("Sin fletes marítimos")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/NearshoringPanel.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/sections/NearshoringPanel.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/NearshoringPanel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/NearshoringPanel.tsx components/sections/NearshoringPanel.test.tsx
git commit -m "feat: add nearshoring advantage panel"
```

---

### Task 10: Services preview (homepage)

**Files:**
- Create: `components/sections/ServicesPreview.tsx`
- Test: `components/sections/ServicesPreview.test.tsx`

**Interfaces:**
- Consumes: `Service` type (Task 4), `LinkButton` (Task 5)
- Produces: `ServicesPreview({ services: Service[] })` — used in `app/page.tsx` (Task 12) with `getFeaturedServices()`.

- [ ] **Step 1: Write the failing test — `components/sections/ServicesPreview.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import type { Service } from "@/lib/services";

const FIXTURE_SERVICES: Service[] = [
  {
    id: "cnc-001",
    name: "Fresado CNC Vertical — Mesa Grande",
    category: "Maquinados CNC",
    description: "Fresado de piezas de gran formato.",
    materials: ["Aluminio 6061", "Acero 4140"],
    specs: ["Mesa hasta 2000 × 800 mm", "Tolerancia ±0.001″"],
    leadTime: "3-5 días",
    featured: true,
  },
  {
    id: "her-001",
    name: "Shims / Lainas a Medida",
    category: "Herramental y Troqueles",
    description: "Shims de precisión.",
    materials: ["D2", "H13"],
    specs: ["Espesor desde 0.05 mm", "Dureza hasta 63 HRC"],
    leadTime: "<24 hrs",
    featured: true,
  },
];

describe("ServicesPreview", () => {
  it("renders one article per featured service with its top two specs", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    expect(screen.getByRole("heading", { name: "Fresado CNC Vertical — Mesa Grande" })).toBeInTheDocument();
    expect(screen.getByText("Mesa hasta 2000 × 800 mm")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shims / Lainas a Medida" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("links each card to its anchor on the capacidades page", () => {
    render(<ServicesPreview services={FIXTURE_SERVICES} />);
    const links = screen.getAllByRole("link", { name: "Ver ficha" });
    expect(links[0]).toHaveAttribute("href", "/capacidades#cnc-001");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/ServicesPreview.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/sections/ServicesPreview.tsx`**

```tsx
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import type { Service } from "@/lib/services";

export function ServicesPreview({ services }: { services: Service[] }) {
  return (
    <section className="border-b border-steel-700">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Capacidades
        </span>
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
                className="text-sm text-torch-400 hover:underline"
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/ServicesPreview.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/sections/ServicesPreview.tsx components/sections/ServicesPreview.test.tsx
git commit -m "feat: add homepage featured-services preview"
```

---

### Task 11: Quote form

**Files:**
- Create: `components/sections/QuoteForm.tsx`
- Test: `components/sections/QuoteForm.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 5)
- Produces: `QuoteForm()` — no props, rendered at `id="cotizacion"` in `app/page.tsx` (Task 12). Submission is not wired to a backend in this plan (see Global Constraints).

- [ ] **Step 1: Write the failing test — `components/sections/QuoteForm.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuoteForm } from "@/components/sections/QuoteForm";

describe("QuoteForm", () => {
  it("has the four required fields and a submit button", () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText("Material")).toBeInTheDocument();
    expect(screen.getByLabelText("Tolerancia requerida")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantidad")).toBeInTheDocument();
    expect(screen.getByLabelText("Fecha de entrega deseada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar solicitud" })).toBeInTheDocument();
  });

  it("offers the four material options from the design system", () => {
    render(<QuoteForm />);
    const select = screen.getByLabelText("Material") as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((o) => o.textContent);
    expect(optionLabels).toEqual(["D2", "H13", "Vanadis", "Otro"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/sections/QuoteForm.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/sections/QuoteForm.tsx`**

```tsx
import { Button } from "@/components/ui/Button";

const FIELD_CLASSES =
  "h-11 rounded-chamfer border border-steel-700 bg-carbon-900 px-3 text-paper-50 outline-none focus:border-torch-500 focus:shadow-[var(--ring-focus)]";
const LABEL_CLASSES = "font-mono text-xs uppercase tracking-[0.06em] text-steel-400";

export function QuoteForm() {
  return (
    <section id="cotizacion" className="bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Cotización
        </span>
        <h2 className="mb-10 text-[2.25rem] font-semibold leading-[1.15]">
          Solicitar cotización
        </h2>
        <form className="grid max-w-[640px] gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Material</span>
            <select name="material" required className={FIELD_CLASSES}>
              <option>D2</option>
              <option>H13</option>
              <option>Vanadis</option>
              <option>Otro</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Tolerancia requerida</span>
            <input
              name="tolerance"
              type="text"
              placeholder="±0.001″"
              required
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Cantidad</span>
            <input
              name="quantity"
              type="text"
              placeholder="Ej. 50 piezas"
              required
              className={FIELD_CLASSES}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_CLASSES}>Fecha de entrega deseada</span>
            <input name="dueDate" type="text" placeholder="DD/MM/AAAA" className={FIELD_CLASSES} />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary">
              Enviar solicitud
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/sections/QuoteForm.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/sections/QuoteForm.tsx components/sections/QuoteForm.test.tsx
git commit -m "feat: add quote request form"
```

---

### Task 12: Assemble the homepage

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 8), `NearshoringPanel` (Task 9), `ServicesPreview` (Task 10), `QuoteForm` (Task 11), `getFeaturedServices` (Task 4), `IMAGES.heroMachining` (Task 7)
- Produces: the `/` route.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Hero } from "@/components/sections/Hero";
import { NearshoringPanel } from "@/components/sections/NearshoringPanel";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { IMAGES } from "@/lib/images";
import { getFeaturedServices } from "@/lib/services";

export default function HomePage() {
  const featuredServices = getFeaturedServices();
  return (
    <>
      <Hero image={IMAGES.heroMachining} />
      <NearshoringPanel />
      <ServicesPreview services={featuredServices} />
      <QuoteForm />
    </>
  );
}
```

- [ ] **Step 2: Remove the now-unused scaffold assets**

`app/page.tsx` no longer uses `next/image`'s `Image` for the Next.js/Vercel logos — the old scaffold markup is fully replaced by Step 1, so there's nothing left to clean up in this file. Leave `public/next.svg`, `public/vercel.svg`, etc. in place; removing unused public assets is out of scope for this plan.

- [ ] **Step 3: Verify with a build and a manual walkthrough**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000`. Confirm: hero shows "±0.001″", "<24 h", "63 HRC" and a background machining photo; nearshoring section shows "300 km", "3 hrs", "T-MEC", "Sin fletes marítimos"; services preview shows the 5 featured rows from `docs/services.csv` (`cnc-001`, `cnc-003`, `her-001`, `her-002`, `est-003`); "Solicitar cotización" in the header and hero both scroll to the form at the bottom.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble homepage from Hero, NearshoringPanel, ServicesPreview, QuoteForm"
```

---

### Task 13: About page sections (historia, calidad y metrología)

**Files:**
- Create: `components/sections/AboutHistory.tsx`
- Create: `components/sections/QualityMetrology.tsx`
- Test: `components/sections/AboutHistory.test.tsx`
- Test: `components/sections/QualityMetrology.test.tsx`

**Interfaces:**
- Consumes: nothing beyond plain JSX/Tailwind
- Produces: `AboutHistory()`, `QualityMetrology()` — used in `app/nosotros/page.tsx` (Task 14).

- [ ] **Step 1: Write the failing test — `components/sections/AboutHistory.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutHistory } from "@/components/sections/AboutHistory";

describe("AboutHistory", () => {
  it("renders the page's single h1", () => {
    render(<AboutHistory />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Un taller que creció con el corredor automotriz de Saltillo",
      }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails, then write `components/sections/AboutHistory.tsx`**

Run: `npm test -- components/sections/AboutHistory.test.tsx` — expect FAIL (module not found).

```tsx
export function AboutHistory() {
  return (
    <section className="border-b border-steel-700">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Historia
        </span>
        <h1 className="mb-8 max-w-[20ch] text-[3rem] font-bold leading-[1.05] tracking-[-0.01em]">
          Un taller que creció con el corredor automotriz de Saltillo
        </h1>
        <div className="grid gap-10 lg:grid-cols-2">
          <p className="max-w-[60ch] text-lg leading-[1.6] text-steel-300">
            Vektor Precision CNC abrió piso en Saltillo maquinando piezas de reemplazo para
            líneas de estampado que no podían parar. De ahí salió el resto del taller: cuando una
            planta automotriz no puede esperar una pieza fuera de tolerancia, cada proceso que
            agregamos — torneado, herramental, ensamble — tuvo que responder a esa misma
            urgencia.
          </p>
          <p className="max-w-[60ch] text-lg leading-[1.6] text-steel-300">
            Hoy el taller trabaja en dos turnos sobre centros Mazak y Okuma, surtiendo piezas
            críticas a proveedores Tier 1 y Tier 2 del corredor Saltillo–Ramos Arizpe–Derramadero,
            con la frontera de Laredo a tres horas por carretera.
          </p>
        </div>
      </div>
    </section>
  );
}
```

Run: `npm test -- components/sections/AboutHistory.test.tsx` — expect PASS.

- [ ] **Step 3: Write the failing test — `components/sections/QualityMetrology.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QualityMetrology } from "@/components/sections/QualityMetrology";

describe("QualityMetrology", () => {
  it("covers metrology, traceability, and the Tier 1/2 delivery commitment", () => {
    render(<QualityMetrology />);
    expect(screen.getByText("Metrología en piso")).toBeInTheDocument();
    expect(screen.getByText("Trazabilidad por lote")).toBeInTheDocument();
    expect(screen.getByText("Compromiso Tier 1 / Tier 2")).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run test to verify it fails, then write `components/sections/QualityMetrology.tsx`**

Run: `npm test -- components/sections/QualityMetrology.test.tsx` — expect FAIL (module not found).

```tsx
const QUALITY_POINTS = [
  {
    title: "Metrología en piso",
    detail:
      "Máquina de medición por coordenadas (CMM) y calibradores certificados en cada celda de trabajo — la pieza se mide antes de salir, no se infiere.",
  },
  {
    title: "Trazabilidad por lote",
    detail:
      "Cada corrida queda documentada con certificado de material, reporte dimensional y número de lote — listo para el expediente PPAP del cliente.",
  },
  {
    title: "Compromiso Tier 1 / Tier 2",
    detail:
      "Entregas críticas con ventana de <24 h para piezas de reemplazo urgente, sin sacrificar el reporte dimensional que exige la línea.",
  },
];

export function QualityMetrology() {
  return (
    <section className="bg-carbon-900">
      <div className="mx-auto max-w-[1280px] px-6 py-20">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Control de calidad
        </span>
        <h2 className="mb-10 max-w-[28ch] text-[2.25rem] font-semibold leading-[1.15]">
          ISO 9001 en proceso de certificación
        </h2>
        <div className="grid gap-px border border-steel-700 bg-steel-700 lg:grid-cols-3">
          {QUALITY_POINTS.map((point) => (
            <div key={point.title} className="bg-steel-900 p-6">
              <h3 className="mb-3 text-[1.375rem] font-semibold">{point.title}</h3>
              <p className="text-[0.9375rem] leading-[1.6] text-steel-300">{point.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Run: `npm test -- components/sections/QualityMetrology.test.tsx` — expect PASS.

- [ ] **Step 5: Commit**

```bash
git add components/sections/AboutHistory.tsx components/sections/AboutHistory.test.tsx components/sections/QualityMetrology.tsx components/sections/QualityMetrology.test.tsx
git commit -m "feat: add About page history and quality/metrology sections"
```

---

### Task 14: Assemble the Nosotros page

**Files:**
- Create: `app/nosotros/page.tsx`

**Interfaces:**
- Consumes: `AboutHistory`, `QualityMetrology` (Task 13), `IMAGES.plantOverview` (Task 7)
- Produces: the `/nosotros` route.

- [ ] **Step 1: Write `app/nosotros/page.tsx`**

```tsx
import Image from "next/image";
import { AboutHistory } from "@/components/sections/AboutHistory";
import { QualityMetrology } from "@/components/sections/QualityMetrology";
import { IMAGES } from "@/lib/images";

export const metadata = {
  title: "Nosotros — Vektor Precision CNC",
  description:
    "Historia, control de calidad y metrología de Vektor Precision CNC, taller de maquinados de precisión en Saltillo, Coahuila.",
};

export default function NosotrosPage() {
  return (
    <>
      <AboutHistory />
      <section className="relative h-[420px] border-b border-steel-700">
        <Image
          src={IMAGES.plantOverview.src}
          alt={IMAGES.plantOverview.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>
      <QualityMetrology />
    </>
  );
}
```

- [ ] **Step 2: Verify with a build and a manual walkthrough**

Run: `npm run build`
Expected: build succeeds, `/nosotros` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/nosotros`. Confirm: h1 "Un taller que creció...", plant photo renders, and the three quality/metrology cards ("Metrología en piso", "Trazabilidad por lote", "Compromiso Tier 1 / Tier 2") are visible.

- [ ] **Step 3: Commit**

```bash
git add app/nosotros/page.tsx
git commit -m "feat: add /nosotros page"
```

---

### Task 15: Capabilities catalog components

**Files:**
- Create: `components/services/CategorySection.tsx`
- Test: `components/services/CategorySection.test.tsx`

**Interfaces:**
- Consumes: `CategoryGroup`, `Service` types (Task 4)
- Produces: `CategorySection({ group: CategoryGroup })` — used in `app/capacidades/page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test — `components/services/CategorySection.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategorySection } from "@/components/services/CategorySection";
import type { CategoryGroup } from "@/lib/services";

const FIXTURE_GROUP: CategoryGroup = {
  category: "Herramental y Troqueles",
  services: [
    {
      id: "her-001",
      name: "Shims / Lainas a Medida",
      category: "Herramental y Troqueles",
      description: "Shims de precisión.",
      materials: ["D2", "H13", "Vanadis"],
      specs: ["Espesor desde 0.05 mm", "Dureza hasta 63 HRC"],
      leadTime: "<24 hrs",
      featured: true,
    },
  ],
};

describe("CategorySection", () => {
  it("renders the category heading and one row per service", () => {
    render(<CategorySection group={FIXTURE_GROUP} />);
    expect(screen.getByRole("heading", { name: "Herramental y Troqueles" })).toBeInTheDocument();
    expect(screen.getByText("Shims / Lainas a Medida")).toBeInTheDocument();
    expect(screen.getByText("D2 · H13 · Vanadis")).toBeInTheDocument();
    expect(screen.getByText("<24 hrs")).toBeInTheDocument();
  });

  it("gives each service row an id matching its service id, for deep-linking", () => {
    render(<CategorySection group={FIXTURE_GROUP} />);
    expect(document.getElementById("her-001")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/services/CategorySection.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `components/services/CategorySection.tsx`**

```tsx
import type { CategoryGroup } from "@/lib/services";

function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
}

export function CategorySection({ group }: { group: CategoryGroup }) {
  return (
    <section id={slugify(group.category)} className="border-b border-steel-700 py-16">
      <h2 className="mb-8 text-[2.25rem] font-semibold leading-[1.15]">{group.category}</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-steel-700">
              <th className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
                Proceso
              </th>
              <th className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
                Materiales
              </th>
              <th className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
                Especificaciones
              </th>
              <th className="py-3 font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
                Entrega
              </th>
            </tr>
          </thead>
          <tbody>
            {group.services.map((service) => (
              <tr
                key={service.id}
                id={service.id}
                className="border-b border-steel-700 hover:bg-steel-900"
              >
                <td className="py-3 pr-4 font-medium">{service.name}</td>
                <td className="py-3 pr-4 font-mono text-[0.9375rem] text-steel-300">
                  {service.materials.join(" · ")}
                </td>
                <td className="py-3 pr-4 font-mono text-[0.9375rem] text-steel-300">
                  {service.specs.join(" · ")}
                </td>
                <td className="py-3">
                  <span className="font-mono text-[0.9375rem] text-readout-400">
                    {service.leadTime}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/services/CategorySection.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add components/services/CategorySection.tsx components/services/CategorySection.test.tsx
git commit -m "feat: add capacidades CategorySection table"
```

---

### Task 16: Assemble the Capacidades page

**Files:**
- Create: `app/capacidades/page.tsx`

**Interfaces:**
- Consumes: `getServicesByCategory` (Task 4), `CategorySection` (Task 15), `IMAGES.capabilitiesHeader` (Task 7)
- Produces: the `/capacidades` route.

- [ ] **Step 1: Write `app/capacidades/page.tsx`**

```tsx
import Image from "next/image";
import { CategorySection } from "@/components/services/CategorySection";
import { IMAGES } from "@/lib/images";
import { getServicesByCategory } from "@/lib/services";

export const metadata = {
  title: "Capacidades y Servicios — Vektor Precision CNC",
  description:
    "Catálogo técnico de fresado CNC, torneado, herramental, estampado, ensamble y acabados de Vektor Precision CNC.",
};

export default function CapacidadesPage() {
  const categoryGroups = getServicesByCategory();
  return (
    <div className="mx-auto max-w-[1280px] px-6">
      <header className="relative border-b border-steel-700 py-16">
        <div className="relative mb-10 h-[280px] border border-steel-700">
          <Image
            src={IMAGES.capabilitiesHeader.src}
            alt={IMAGES.capabilitiesHeader.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.06em] text-steel-400">
          Catálogo técnico
        </span>
        <h1 className="max-w-[24ch] text-[3rem] font-bold leading-[1.05] tracking-[-0.01em]">
          Capacidades y servicios
        </h1>
      </header>
      {categoryGroups.map((group) => (
        <CategorySection key={group.category} group={group} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify with a build and a manual walkthrough**

Run: `npm run build`
Expected: build succeeds, `/capacidades` listed in the route output.

Run: `npm run dev`, open `http://localhost:3000/capacidades`. Confirm: all 4 categories render as headings in the fixed order (Maquinados CNC, Herramental y Troqueles, Estampado y Ensamble, Acabados y Tratamientos) with all 15 rows total across them, materials/specs joined with " · ", and lead times visible in cyan (`readout-400`). Confirm a link like `http://localhost:3000/capacidades#her-001` scrolls to that row.

- [ ] **Step 3: Commit**

```bash
git add app/capacidades/page.tsx
git commit -m "feat: add /capacidades page rendering the full services catalog"
```

---

### Task 17: Full-site verification pass

**Files:** none (verification only)

**Interfaces:** none

- [ ] **Step 1: Run the full automated suite**

Run: `npm run lint`
Expected: no errors.

Run: `npm test`
Expected: all tests pass (services, content, UI primitives, layout, sections, services catalog).

Run: `npm run build`
Expected: succeeds, all three routes (`/`, `/nosotros`, `/capacidades`) listed with no errors or warnings about the Pexels remote pattern.

- [ ] **Step 2: Manual walkthrough of all three pages**

Run: `npm run dev`, then in a browser:
- `/` — hero metrics, nearshoring facts, 5 featured service cards, quote form all present; header/footer nav works; "Solicitar cotización" scrolls to `#cotizacion` from the header on every page.
- `/nosotros` — history, plant photo, quality/metrology cards.
- `/capacidades` — all 15 services across 4 categories, deep-links from the homepage preview (`/capacidades#cnc-001`, etc.) land on the right row.
- Resize to a narrow viewport (< 900px) and confirm the hero grid, capability grid, and footer grid stack to a single column, and the capacidades tables scroll horizontally instead of breaking layout.
- Tab through each page with the keyboard and confirm every interactive element (nav links, CTA buttons, form fields) shows a visible focus ring.

- [ ] **Step 3: Run the design-enforcer subagent in review mode**

Ask Claude: "Usa el subagente design-enforcer para revisar (solo revisión, sin corregir) las páginas `/`, `/nosotros` y `/capacidades`." Read its findings. For anything it flags as a real violation of `docs/design/`, fix it directly (small, targeted edits to the relevant component file) and re-run `npm test` for that component before committing.

- [ ] **Step 4: Commit any fixes from Step 3**

```bash
git add -A
git commit -m "fix: address design-enforcer findings on Home/Nosotros/Capacidades"
```

(Skip this step entirely if Step 3 found nothing to fix.)

---

## Self-Review

**Spec coverage:**
- Hero with technical metrics (±0.001″, <24h, 63 HRC) → Task 8, backed by `HERO_METRICS` (Task 3).
- Servicios principales destacados en Home → Task 10 (`ServicesPreview`, driven by `getFeaturedServices()`).
- Ventaja logística Saltillo–Texas (300 km / 3 hrs, T-MEC, sin fletes marítimos) → Task 9 (`NearshoringPanel`, backed by `NEARSHORING_FACTS`).
- Botón "Solicitar Cotización" → formulario técnico → Task 5 (`LinkButton`) + Task 11 (`QuoteForm` at `#cotizacion`) + Task 12 (wired into `app/page.tsx`) + Task 6 (header CTA present on every page).
- Nosotros/Planta: historia, control de calidad, metrología, compromiso Tier 1/2 → Task 13 (`AboutHistory`, `QualityMetrology`) + Task 14 (page assembly).
- Capacidades y Servicios: carga y muestra todo `docs/services.csv`, categorías claras, marcas de maquinaria, materiales → Task 4 (data layer), Task 15 (`CategorySection`), Task 16 (page assembly reading all 4 categories / 15 rows).
- Imágenes de stock de Pexels (manufactura, centros de maquinado, piezas metálicas) → Task 7 (sourced live, no fabricated URLs), consumed in Tasks 8, 14, 16.
- Cumplimiento del sistema de diseño (`docs/design/`) → Global Constraints enforced task-by-task via the exact token classes from `03-components.md`/`tokens.css`; verified end-to-end by the `design-enforcer` subagent in Task 17.

**Placeholder scan:** The only intentional placeholders are the four `REPLACE_WITH_VERIFIED_PEXELS_URL` / `REPLACE` markers in Task 7, Step 4 — these are explicitly called out as required live-lookup values (not vague "TBD"s) and Step 4 states the file isn't done until they're real. No other task contains a placeholder; every step has complete, runnable code.

**Type consistency:** `Service` / `ServiceCategory` / `CategoryGroup` (Task 4) are used identically in Tasks 10, 12, 15, 16. `StockImage` (Task 7) is used identically in Tasks 8, 14, 16. `LinkButton`/`Button` prop shape (Task 5) matches every call site in Tasks 6, 8, 10, 11. `SERVICE_CATEGORIES` string values match the CSV's real `category` column values exactly (confirmed against `docs/services.csv` in Task 4's Step 4 note).

---

**Plan complete and saved to `docs/superpowers/plans/2026-09-03-vektor-website.md`.** Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
