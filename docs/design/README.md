# Sistema de diseño — Vektor Precision CNC

Sistema de diseño completo para el sitio de Vektor Precision CNC (taller de maquinados CNC de precisión, Saltillo, Coahuila), construido para Next.js 16 / React 19 / Tailwind v4.

| Documento | Contenido |
|---|---|
| [`00-brief.md`](./00-brief.md) | A quién le hablamos, qué tiene que lograr el sitio, y por qué el sistema no copia el template de referencia |
| [`01-style-guide.md`](./01-style-guide.md) | Color, tipografía, layout, iconografía, imagen, voz y tono — con wireframes ASCII de hero, capacidades, tabla de máquinas y footer |
| [`02-tokens.md`](./02-tokens.md) | Documentación de cada token (color, tipo, espaciado, radio, movimiento, breakpoints) y cómo integrarlo |
| [`tokens.css`](./tokens.css) | Los tokens como `@theme` real de Tailwind v4 — listo para `@import` desde `app/globals.css` |
| [`03-components.md`](./03-components.md) | Especificación de cada componente (botón, badge, chip, panel, tabla, formulario, nav, footer) con anatomía, estados y HTML de ejemplo |
| [`style-guide.html`](./style-guide.html) | Referencia viva — abre el archivo en un navegador para ver todos los tokens y componentes juntos, ya renderizados |

## El objeto de diseño en una frase

Una hoja de especificaciones técnica, no un sitio de marketing con foto de gente con casco: fondo oscuro de panel de control, un acento naranja para lo que se puede accionar, un acento cian para lo que el taller reporta, y todo dato real en monoespaciada alineada como una lectura de instrumento.

## Referencias

La imagen en [`references/`](../desing/references/1.png) (dentro de `docs/desing/`, tal como existía en el repo) es el template genérico usado como punto de partida de categoría — no como objetivo visual. Ver el razonamiento completo en [`00-brief.md`](./00-brief.md#por-qué-no-el-look-del-template-de-referencia).

## Cómo usarlo en el código

1. Importar `tokens.css` desde `app/globals.css` (ver [`02-tokens.md`](./02-tokens.md#integración)).
2. Cargar las fuentes Archivo e IBM Plex Mono con `next/font/google`, igual que el scaffold actual carga Geist en `app/layout.tsx` — mismo mecanismo, otras familias.
3. Construir componentes de React siguiendo la anatomía y clases de ejemplo en [`03-components.md`](./03-components.md); son clases de utilidad Tailwind directas, no requieren una librería de componentes.
