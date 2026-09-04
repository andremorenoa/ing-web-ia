# Design tokens — Vektor Precision CNC

Documentación de todos los tokens. Los valores viven como CSS real, listos para Tailwind v4, en [`tokens.css`](./tokens.css) — ese archivo se importa desde `app/globals.css` (ver [Integración](#integración)).

Tailwind v4 lee variables `@theme` directamente como utilidades (`--color-torch-500` → `bg-torch-500`, `text-torch-500`, `border-torch-500`, etc.), así que no hace falta un `tailwind.config.js` aparte — los tokens *son* la config.

## Color

Ver rationale de cada color y la regla de separación acción/dato en [`01-style-guide.md`](./01-style-guide.md#1-color). Escala completa (incluye pasos intermedios no listados en la guía de estilo, para hover/active/disabled):

| Token | Hex | Escala |
|---|---|---|
| `carbon-950` | `#09090B` | fondo base |
| `carbon-900` | `#0F1013` | fondo secundario (secciones alternas) |
| `steel-900` | `#14181D` | superficie de panel |
| `steel-800` | `#1E242B` | superficie elevada / hover de card |
| `steel-700` | `#2B3138` | borde, hairline, regla de tabla |
| `steel-600` | `#454D57` | borde en hover / focus sutil |
| `steel-400` | `#8B93A1` | texto secundario |
| `steel-300` | `#AEB4BE` | texto secundario sobre superficie elevada |
| `paper-50` | `#F4F5F7` | texto primario |
| `torch-500` | `#FF6A00` | acento de acción — default |
| `torch-600` | `#E85D00` | acento de acción — hover/pressed |
| `torch-400` | `#FF8A33` | acento de acción — sobre fondo oscuro en texto pequeño (link) |
| `torch-950` | `#2B1200` | fondo de badge/tag con `torch-400` de texto |
| `readout-400` | `#33E1D8` | acento de dato — default |
| `readout-300` | `#6BEBE4` | acento de dato — hover en elementos interactivos de dato (raro) |
| `readout-950` | `#062523` | fondo de badge de dato |
| `signal-green` | `#35D07F` | disponible / en tolerancia |
| `signal-amber` | `#FFB020` | en cola / pendiente |
| `signal-red` | `#FF4D4D` | rechazado / fuera de tolerancia |

## Tipografía

| Token | Valor |
|---|---|
| `font-sans` | `"Archivo", "Archivo Fallback", system-ui, sans-serif` |
| `font-mono` | `"IBM Plex Mono", "IBM Plex Mono Fallback", ui-monospace, monospace` |

Escala tipográfica completa (tamaño, interlineado, tracking) en [`01-style-guide.md`](./01-style-guide.md#escala-tipográfica) — los tokens `text-display` … `text-label` están definidos como utilidades compuestas en `tokens.css`.

Pesos usados: Archivo 400 (body), 600 (h2/h3, botones), 700 (h1/display). Plex Mono 500 (dato en línea, label), 600 (dato destacado). No se usan pesos fuera de esta lista.

## Espaciado

Escala base de Tailwind (múltiplos de 0.25rem) sin modificar — no hay razón de negocio para reinventar la escala de espaciado. Dos tokens semánticos añadidos para la densidad "hoja de datos":

| Token | Valor | Uso |
|---|---|---|
| `spacing-panel` | `1.5rem` (24px) | padding interno estándar de panel/card |
| `spacing-panel-tight` | `1rem` (16px) | padding interno de fila de tabla / badge grande |

## Radio de esquina

| Token | Valor | Uso |
|---|---|---|
| `radius-none` | `0` | paneles, cards, tablas, secciones |
| `radius-chamfer` | `0.125rem` (2px) | botones, inputs, badges, tags |
| `radius-pill` | `999px` | únicamente el punto/pill de estado en vivo (● Disponible) |

## Borde y elevación

| Token | Valor | Uso |
|---|---|---|
| `border-hairline` | `1px solid var(--color-steel-700)` | borde default de panel/tabla |
| `border-hairline-hover` | `1px solid var(--color-steel-600)` | hover de card interactiva |
| `border-accent` | `1px solid var(--color-torch-500)` | selección activa / tab activo |
| `ring-focus` | `0 0 0 3px rgba(255,106,0,0.35)` | anillo de foco visible (accesibilidad, todos los elementos interactivos) |
| `glow-cta-hover` | `0 0 24px -4px rgba(255,106,0,0.45)` | único "glow" permitido — hover de CTA primario |

No existe token de `shadow` gris. Si algo necesita separarse del fondo, sube un escalón en la escala `carbon` → `steel` o usa `border-hairline`.

## Movimiento

Un solo momento animado por vista como máximo (secuencia de entrada del hero); todo lo demás es transición de estado (hover, focus, expand), 150–200ms, sin "fade-slide-up" en cascada por sección.

| Token | Valor | Uso |
|---|---|---|
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | default de todas las transiciones |
| `duration-fast` | `120ms` | hover de color/borde |
| `duration-base` | `200ms` | expandir/colapsar, aparición de badge |
| `duration-hero` | `600ms` | única secuencia de entrada del hero |

Respeta `prefers-reduced-motion: reduce` — con esa preferencia, la secuencia del hero se omite (el contenido aparece en su estado final) y las transiciones de hover se recortan a opacidad/color sin desplazamiento.

## Breakpoints

Se usan los breakpoints default de Tailwind v4 (`sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem). Un solo breakpoint adicional para las tablas de capacidad de máquina, que necesitan scroll horizontal antes que colapsar en cards:

| Token | Valor | Uso |
|---|---|---|
| `--breakpoint-table` | `56rem` (896px) | debajo de este ancho, `MachineTable` cambia a scroll horizontal con hairline de sombra en el borde, no a cards apiladas |

## Integración

En `app/globals.css`, importar el archivo de tokens antes del `@theme inline` existente (o fusionar sus bloques `@theme` — Tailwind v4 permite múltiples declaraciones `@theme`, se combinan):

```css
@import "tailwindcss";
@import "../docs/design/tokens.css";

body {
  background: var(--color-carbon-950);
  color: var(--color-paper-50);
  font-family: var(--font-sans);
}
```

Los nombres `--color-background` / `--color-foreground` del scaffold original quedan obsoletos una vez adoptado el sistema — se reemplazan por `--color-carbon-950` / `--color-paper-50` directamente en los componentes.
