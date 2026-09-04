# Guía de estilo — Vektor Precision CNC

## 1. Color

Fondo oscuro técnico, dos acentos con funciones separadas (acción vs. dato), tres colores de señal para estado. Valores completos y en formato CSS en [`tokens.css`](./tokens.css).

| Token | Hex | Uso |
|---|---|---|
| `carbon-950` | `#09090B` | Fondo base de página |
| `steel-900` | `#14181D` | Superficie de panel / card |
| `steel-800` | `#1E242B` | Superficie elevada / hover |
| `steel-700` | `#2B3138` | Bordes, hairlines, reglas de tabla |
| `steel-400` | `#8B93A1` | Texto secundario / muted |
| `paper-50` | `#F4F5F7` | Texto primario (blanco frío, no `#FFF` puro) |
| `torch-500` | `#FF6A00` | **Acento de acción** — CTAs, marca, foco interactivo |
| `torch-600` | `#E85D00` | Hover/pressed de acción |
| `readout-400` | `#33E1D8` | **Acento de dato** — métricas activas, estado en vivo, líneas de cota destacadas |
| `signal-green` | `#35D07F` | En tolerancia / disponible / aprobado |
| `signal-amber` | `#FFB020` | Pendiente / en cola / tiempo de entrega ajustado |
| `signal-red` | `#FF4D4D` | Fuera de tolerancia / rechazado / alerta |

**Regla de separación:** `torch-500` es lo único que el usuario puede accionar (botones, links, marca). `readout-400` es lo único que el taller reporta (una cifra, una medición, un estado en vivo). No se combinan en el mismo elemento. Si dudas de cuál usar, pregunta: "¿esto se hace clic o se lee?"

**Regla de contraste:** `torch-500` sobre `carbon-950` pasa AA para texto grande (≥18px/24px bold), botones e iconos — no para párrafos de cuerpo. El cuerpo de texto siempre usa `paper-50` o `steel-400` sobre fondo oscuro. `readout-400` se reserva para cifras grandes o badges con fondo sólido, nunca para párrafos.

**Nada de sombra gris genérica.** No usamos `box-shadow` gris suave para dar elevación (el cliché de "SaaS card kit"). La jerarquía de superficie se construye con el propio tono (`carbon-950` → `steel-900` → `steel-800`) y con hairlines de 1px, igual que capas en un plano CAD. El único "glow" permitido es el anillo de foco de accesibilidad y un resplandor sutil de `torch-500` en el CTA primario en hover.

## 2. Tipografía

Dos familias, cada una con un trabajo distinto — no hay una tercera para "decorar":

- **Archivo** (sans) — todo lo que es prosa: titulares, cuerpo, navegación, botones. Grotesca con carácter mecánico/expandido en los pesos altos; no es la sans por default de ningún framework.
- **IBM Plex Mono** — todo lo que es un dato real: tolerancias, dureza, dimensiones, tiempos de entrega, números de parte, modelos de máquina. Si el número viene de una hoja de specs, va en Plex Mono. Si es prosa que menciona un número de paso, va en Archivo.

No hay una tercera fuente para labels — los labels de campo (`TOLERANCIA`, `MATERIAL`) usan Plex Mono en mayúsculas porque son *nombres de campo de una hoja de datos real*, no eyebrows decorativos sobre un titular.

### Escala tipográfica

| Token | Tamaño / interlineado | Familia | Uso |
|---|---|---|---|
| `text-display` | 4.5rem / 1.0, tracking -0.02em | Archivo, 700 | Cifra hero (ej. "±0.001″") |
| `text-h1` | 3rem / 1.05, tracking -0.01em | Archivo, 700 | Titular de página |
| `text-h2` | 2.25rem / 1.15 | Archivo, 600 | Titular de sección |
| `text-h3` | 1.375rem / 1.3 | Archivo, 600 | Título de card/panel |
| `text-lead` | 1.125rem / 1.6 | Archivo, 400 | Párrafo introductorio |
| `text-body` | 1rem / 1.6 | Archivo, 400 | Cuerpo de texto |
| `text-sm` | 0.875rem / 1.45 | Archivo, 400 | Texto secundario, captions |
| `text-data-lg` | 2rem / 1.0 | Plex Mono, 600 | Métrica destacada (dentro de card) |
| `text-data` | 1rem / 1.4 | Plex Mono, 500 | Dato en línea (tabla, badge) |
| `text-label` | 0.75rem / 1.0, tracking 0.06em, uppercase | Plex Mono, 500 | Nombre de campo de datasheet |

Línea de texto de cuerpo objetivo: 60–75 caracteres. Nunca justificado — alineado a la izquierda siempre; es más fácil de escanear para alguien comparando specs.

## 3. Layout

**Alineación:** izquierda, densa, asimétrica — como una hoja de datos técnica, no un hero de marketing centrado. Los únicos elementos centrados son estados vacíos y modales de confirmación puntuales.

**Grid:** 12 columnas, contenedor máx. 1280px, gutter 24px. Los paneles de datos (specs, tablas de capacidad) pueden salirse del contenedor hasta el borde de viewport en desktop — un plano no tiene márgenes de cortesía.

**El dispositivo de firma — línea de cota:** un hairline de 1px con terminadores en forma de tick (⊢───⊣) se usa para acotar valores clave (una tolerancia, un rango de dimensión) y como separador de sección. Se usa con moderación — máximo un par de veces por vista — para que conserve peso. Ver especificación en [`03-components.md`](./03-components.md#línea-de-cota).

**Marcas de registro:** ticks en forma de L en las esquinas de paneles seleccionados (hero, panel de cotización), evocando las marcas de datum/alineación de una prensa de troquel. Decorativas pero con origen real — se usan solo en 1–2 paneles por vista, nunca en cards repetidas (si están en cada card, se vuelven ruido de plantilla, exactamente lo que queremos evitar).

**Radio de esquina:** dos valores, con jerarquía con significado:
- `radius-none` (0) — paneles, cards, tablas, secciones. Son planos, no burbujas.
- `radius-chamfer` (2px) — botones, inputs, badges. El chaflán (rompe de canto) es un término de maquinado real: una arista con un ligero desbaste, no una esquina viva ni un pill redondeado.

### Wireframe — Hero

```
┌─ carbon-950 ──────────────────────────────────────────────┐
│ ⌐                                                          │
│ VEKTOR PRECISION CNC              [Saltillo, Coahuila]     │
│ ──────────────────────────────────────────────────────    │
│                                                             │
│   Maquinados que entran            ⊢──────────────⊣        │
│   en tolerancia.                    ±0.001″                │
│   Punto.                            TOLERANCIA MÍNIMA      │
│                                                             │
│   Fresado, torneado, shims a medida                        │
│   y ensambles para automotriz       [ 63 HRC ] [ <24 h ]   │
│   y nearshoring en el norte de MX.  [ Mazak · Okuma ]      │
│                                                             │
│   [ Solicitar cotización ]  Ver capacidades →no arrow, plano│
│                                                          ⌐  │
└──────────────────────────────────────────────────────────┘
```
Asimétrico 60/40: bloque de titular + CTA a la izquierda, panel de especificación destacada (la cifra hero en Plex Mono, `readout-400`) a la derecha, con marcas de registro en las esquinas superior-izquierda e inferior-derecha del contenedor completo. Sin foto de stock de gente con casco mirando a cámara — si hay imagen, es macro de viruta/pieza/husillo, nunca retrato posado.

### Wireframe — Capacidades (grid de servicios)

```
CAPACIDADES ──────────────────────────────────────────

┌─────────────────┬─────────────────┬─────────────────┐
│ 01 FRESADO CNC   │ 02 TORNEADO CNC │ 03 SHIMS/LAINAS │
│ VERTICAL         │ ALTA PRECISIÓN  │ A MEDIDA         │
│                  │                  │                  │
│ Mesa hasta 2 m   │ Hasta ⌀14″       │ Hasta 63 HRC     │
│ ±0.001″          │ Mazak · Okuma    │ D2 · H13 · Vanadis│
│                  │                  │                  │
│ Ver ficha        │ Ver ficha        │ Ver ficha        │
└─────────────────┴─────────────────┴─────────────────┘
```
Aquí la numeración (01/02/03) sí corresponde — no es decorativa: son estaciones de un mismo taller, referenciables por número en una cotización ("necesito 02 y 03"). Cards con `radius-none`, borde `steel-700`, sin sombra; se diferencian del fondo solo por el salto de tono `carbon-950` → `steel-900`.

### Wireframe — Ficha de capacidad de máquina (tabla, no cards)

```
MODELO         TIPO        CAPACIDAD MÁX    TOLERANCIA   ESTADO
──────────────────────────────────────────────────────────────
Mazak VTC-800  Fresado 5X  2000 × 800 mm    ±0.001″      ● Disponible
Okuma LB3000   Torneado    ⌀356 × 1000 mm   ±0.0005″     ● Disponible
Mazak QT-Nexus Torneado    ⌀400 × 610 mm    ±0.001″      ◐ En cola (2 d)
```
Tabla real con reglas horizontales `steel-700`, no una grid de tarjetas — un comprador técnico escanea una tabla más rápido que tarjetas. El punto de estado usa `signal-green`/`signal-amber`/`signal-red`, texto en `text-data`.

### Wireframe — Footer

```
──────────────────────────────────────────────────────────
VEKTOR PRECISION CNC        CAPACIDADES        CONTACTO
Saltillo, Coahuila, MX      Fresado CNC        cotizaciones@vektorcnc.mx
                            Torneado CNC        +52 844 000 0000
                            Shims / lainas      Parque Industrial, Saltillo
                            Ensambles
──────────────────────────────────────────────────────────
© Vektor Precision CNC                    ISO 9001 en proceso
```
Tres columnas alineadas a la izquierda, sin degradado ni ilustración de fondo. El footer de una hoja de specs no necesita drama.

## 4. Iconografía

Línea, 1.5px de trazo, esquinas rectas o con el mismo chaflán de 2px que los botones — nunca iconos rellenos ni dentro de círculos de color (ese círculo-con-icono-pastel es otro tic de plantilla). Vocabulario: símbolos de acotación técnica (Ø, ±, ⌐), no metáforas genéricas de "servicio" (manos estrechándose, engranajes flotando, bombillas de idea).

## 5. Imagen y fotografía

Macro, luz direccional dura de una sola fuente (como una lámpara de inspección), sin poses. Temas: viruta de maquinado, refrigerante en corte, calibrador sobre pieza terminada, husillo en operación, textura de acero D2/H13. Nunca foto de stock genérica de "trabajador con casco sonriendo a cámara" — si aparece una persona, está trabajando, no posando, y el encuadre prioriza la pieza o la máquina sobre la cara.

## 6. Voz y tono

Directo, técnico, sin adjetivos de venta. Se afirma con datos, no con calificativos.

- **Sí:** "Fresado vertical, mesa hasta 2 m, ±0.001″." **No:** "Ofrecemos soluciones robustas de fresado de clase mundial."
- **Sí:** "Cotización en <24 h." **No:** "Tiempos de respuesta excepcionales."
- Botones dicen la acción exacta: "Solicitar cotización", "Ver ficha de máquina", "Descargar hoja de tolerancias" — nunca "Enviar" ni "Más información".
- Sin eyebrows decorativos tipo "— NUESTROS SERVICIOS —" sobre cada título de sección. Si una sección necesita contexto, el propio título lo dice.
- Sin flechas `→` pegadas a links de texto. El link se distingue por color (`torch-500`) y subrayado en hover, no por decoración.
