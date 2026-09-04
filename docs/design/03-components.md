# Especificación de componentes — Vektor Precision CNC

Convención: las clases de ejemplo asumen los tokens de [`tokens.css`](./tokens.css) cargados vía Tailwind v4. `<!-- dato -->` marca contenido que siempre va en `font-mono`.

---

## Botón

**Anatomía:** label (Archivo 600) + ícono opcional a la izquierda (nunca a la derecha, nunca flecha). Un solo radio (`chamfer`, 2px). Sin gradientes.

| Variante | Fondo | Texto | Borde | Uso |
|---|---|---|---|---|
| Primario | `torch-500` | `carbon-950` | ninguno | Una sola por vista — la acción de conversión ("Solicitar cotización") |
| Secundario | transparente | `paper-50` | `steel-700` | Acciones alternas ("Ver ficha de máquina") |
| Terciario / link | transparente | `torch-400` | ninguno, subrayado en hover | Navegación inline |
| Destructivo | transparente | `signal-red` | `signal-red` a 40% opacidad | Cancelar cotización, eliminar adjunto |

**Estados:**
- Hover primario: fondo `torch-600` + `glow-cta-hover`.
- Hover secundario: `border-hairline-hover`, fondo `steel-900`.
- Focus (todas): `ring-focus`, visible siempre — nunca `outline: none` sin reemplazo.
- Disabled: opacidad 40%, `cursor-not-allowed`, sin hover.

**Tamaño:** altura 44px (`h-11`) default, 36px (`h-9`) compacto para uso dentro de tablas. Padding horizontal `1.25rem`.

```html
<button class="h-11 px-5 rounded-chamfer bg-torch-500 text-carbon-950 font-sans font-semibold
               hover:bg-torch-600 hover:shadow-[var(--glow-cta-hover)]
               focus-visible:shadow-[var(--ring-focus)] transition-colors duration-fast">
  Solicitar cotización
</button>
```

---

## Badge de dato

Para tolerancia, dureza, tiempo de entrega, material — cualquier valor que venga de una hoja de specs. **Nunca** para etiquetas de categoría genéricas (eso es un `Tag`, ver abajo).

**Anatomía:** label en `text-label` (mono, uppercase, `steel-400`) + valor en `text-data` (mono, `readout-400` o `paper-50`). Fondo `readout-950` si el badge es autocontenido (chip suelto); transparente si vive dentro de un panel que ya tiene fondo propio.

```html
<span class="inline-flex items-baseline gap-2 px-3 py-1.5 rounded-chamfer bg-readout-950 border border-readout-400/20">
  <span class="text-label text-steel-400">TOLERANCIA</span>
  <span class="text-data text-readout-400"><!-- ±0.001″ --></span>
</span>
```

**Variante de estado** (disponibilidad de máquina, avance de cotización) usa `radius-pill` y un punto de color en vez de fondo tintado — es la única excepción autorizada al radio 0/chamfer:

```html
<span class="inline-flex items-center gap-1.5 text-data text-steel-300">
  <span class="w-1.5 h-1.5 rounded-pill bg-signal-green"></span>
  <!-- Disponible -->
</span>
```

---

## Chip de capacidad

Distinto del badge (que siempre trae un label de campo explícito) y del tag (texto corrido sin borde). El chip es un hecho autocontenido de escaneo rápido — vive en el hero o en resúmenes densos donde no hay espacio para el par label/valor completo. Borde `steel-700`, texto `steel-300` en mono, sin fondo tintado (a diferencia del badge, que sí usa `readout-950`) — así no compite con los verdaderos badges de dato de la misma vista.

```html
<span class="inline-block px-2.5 py-1.5 text-data text-steel-300 border border-steel-700">
  <!-- 63 HRC máx. -->
</span>
```

Regla de uso: máximo una fila de chips por vista (ej. la fila bajo el hero). Si aparecen en cada card además del hero, retirar de las cards — es ruido repetido, y el badge o el tag ya cubren ese caso dentro de una card.

## Tag (categoría, no dato)

Texto plano en `text-sm`, sin fondo, separado por el propio espaciado — no todo necesita una píldora. Usado para material/proceso en listados: `D2 · H13 · Vanadis` se escribe como texto corrido en `steel-400`, no como tres badges — reservamos el badge para el valor que el usuario está decidiendo (tolerancia, tiempo), no para cada palabra clave.

---

## Panel / Card

**Anatomía:** `radius-none`, `border-hairline`, fondo `steel-900` sobre `carbon-950` (o `steel-800` sobre `carbon-900` en secciones alternas). Padding `spacing-panel`. Sin sombra.

- **Card de capacidad** (grid de servicios): número de estación (01/02/03, `text-label` `steel-400`) + título `text-h3` + 2 datos clave en `text-data` + link "Ver ficha" (terciario). Hover: `border-hairline-hover`, sin desplazamiento ni escala — un cambio de borde es suficiente feedback.
- **Card de proyecto/caso:** imagen macro (aspect 4:3, object-cover) sin overlay de gradiente decorativo, título del proyecto, una línea de resultado con cifra en mono (ej. "Reducción de 30% en tiempo de ciclo").

```html
<article class="border border-steel-700 bg-steel-900 p-panel hover:border-steel-600 transition-colors duration-fast">
  <span class="text-label text-steel-400">01</span>
  <h3 class="text-h3 text-paper-50 mt-2">Fresado CNC vertical</h3>
  <dl class="mt-4 space-y-1 text-data text-steel-300">
    <div>Mesa hasta <!-- 2000 × 800 mm --></div>
    <div>Tolerancia <!-- ±0.001″ --></div>
  </dl>
  <a href="#" class="text-torch-400 text-sm mt-4 inline-block hover:underline">Ver ficha</a>
</article>
```

---

## Línea de cota (dimension line)

El dispositivo de firma del sistema — un hairline con terminadores en tick que acota un valor. Uso: máximo 1–2 por vista (hero, y opcionalmente un dato destacado en la página de capacidades). Nunca decorativo puro: siempre acota algo con un valor real a un lado.

```
⊢───────────────────⊣
```

```html
<div class="flex items-center gap-3">
  <span aria-hidden="true" class="text-steel-600">⊢</span>
  <span class="flex-1 h-px bg-steel-700"></span>
  <span aria-hidden="true" class="text-steel-600">⊣</span>
</div>
<div class="text-data-lg text-readout-400 mt-2"><!-- ±0.001″ --></div>
<div class="text-label text-steel-400">TOLERANCIA MÍNIMA</div>
```

Color del hairline: `steel-700` por default; `torch-500` solo cuando la línea acota el valor hero de la vista (uso único, no repetido).

---

## Marca de registro (corner tick)

Ticks en L en las esquinas de un panel, evocando marcas de datum de troquel. Puramente decorativo pero con presupuesto estricto: **máximo 1–2 paneles por vista** (el hero y, si aplica, el panel de formulario de cotización). Si se repite en cada card, retirar — es la regla de restraint del sistema.

```html
<div class="relative border border-steel-700 p-panel">
  <span aria-hidden="true" class="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-torch-500"></span>
  <span aria-hidden="true" class="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-torch-500"></span>
  <!-- contenido del panel -->
</div>
```

---

## Tabla de capacidad de máquina (`MachineTable`)

Tabla real (`<table>`), no grid de cards — un comprador técnico escanea filas más rápido. Encabezados en `text-label`, celdas de dato en `text-data` (mono), reglas horizontales `border-hairline`, sin líneas verticales. Fila con hover `steel-900`. Columna de estado usa el badge de estado (punto + texto).

Bajo `--breakpoint-table` (896px): la tabla no colapsa a cards — se envuelve en un contenedor `overflow-x-auto` con una sombra hairline en el borde para indicar que hay más contenido (`box-shadow: inset -8px 0 8px -8px steel-700`), preservando la lectura tabular en vez de fragmentar los datos.

```html
<div class="overflow-x-auto">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="text-label text-steel-400 border-b border-steel-700">
        <th class="py-3 pr-4">Modelo</th>
        <th class="py-3 pr-4">Tipo</th>
        <th class="py-3 pr-4">Capacidad máx.</th>
        <th class="py-3 pr-4">Tolerancia</th>
        <th class="py-3">Estado</th>
      </tr>
    </thead>
    <tbody class="text-data text-paper-50">
      <tr class="border-b border-steel-700 hover:bg-steel-900">
        <td class="py-3 pr-4"><!-- Mazak VTC-800 --></td>
        <td class="py-3 pr-4 text-steel-300">Fresado 5X</td>
        <td class="py-3 pr-4"><!-- 2000 × 800 mm --></td>
        <td class="py-3 pr-4"><!-- ±0.001″ --></td>
        <td class="py-3">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-pill bg-signal-green"></span>
            Disponible
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Formulario de cotización

Los inputs se estilizan como campos de lectura de instrumento: fondo `carbon-900`, borde `hairline`, label `text-label` arriba (no placeholder-como-label — un placeholder que desaparece al escribir no sirve para alguien llenando specs de una pieza). Focus: `border-accent` + `ring-focus`.

Campos mínimos: material (select con D2/H13/Vanadis/Otro), tolerancia requerida (input con sufijo `″`), cantidad, adjuntar dibujo (drag-and-drop, acepta `.dxf/.step/.pdf`), fecha de entrega deseada.

```html
<label class="block">
  <span class="text-label text-steel-400">MATERIAL</span>
  <select class="mt-1.5 w-full h-11 px-3 bg-carbon-900 border border-steel-700 rounded-chamfer text-paper-50
                 focus:border-torch-500 focus:shadow-[var(--ring-focus)] outline-none">
    <option>D2</option>
    <option>H13</option>
    <option>Vanadis</option>
    <option>Otro</option>
  </select>
</label>
```

**Error:** borde `signal-red`, mensaje debajo en `text-sm` `signal-red`, sin ícono de alerta redundante si el texto ya lo dice. **Éxito de envío:** no un modal centrado — un panel inline con `border-accent` y confirmación con el número de folio en mono ("Cotización #VKT-00412 recibida").

---

## Navegación

Barra fija, `carbon-950` con `border-b border-steel-700` (no sombra al hacer scroll — el hairline ya separa). Logo/wordmark a la izquierda, links a la derecha en `text-sm`, CTA primario compacto al final. Sin mega-menú — cuatro secciones máximo (Capacidades, Proyectos, Nosotros, Contacto).

Link activo: no un fondo de píldora — un `border-b-2 border-torch-500` de 2px, coherente con el lenguaje de hairlines/cotas del resto del sistema.

---

## Footer

Ver wireframe en [`01-style-guide.md`](./01-style-guide.md#wireframe--footer). Tres columnas alineadas a la izquierda sobre `carbon-900`, separadas del contenido por un `border-hairline`. Sin newsletter signup (no es un producto de consumo) — el único formulario del sitio es la cotización.

---

## Accesibilidad — checklist por componente

- Todo elemento interactivo tiene `focus-visible` con `ring-focus`; nunca se remueve el outline sin sustituto.
- Contraste de texto de cuerpo (`paper-50`/`steel-400` sobre `carbon-950`/`steel-900`) verificado AA en tamaño body; `torch-500`/`readout-400` restringidos a texto grande, iconos o fondos sólidos (badges) por la regla de contraste en [`02-tokens.md`](./02-tokens.md).
- Estado (disponible/en cola/rechazado) nunca se comunica solo por color — siempre acompañado de texto o forma del punto.
- `prefers-reduced-motion: reduce` respetado (ver [`02-tokens.md`](./02-tokens.md#movimiento)).
- Tablas usan `<table>` semántico con `<th scope="col">`; formularios usan `<label>` real asociado, no solo placeholder.
