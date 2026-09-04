# Vektor Precision CNC — Brief de diseño

## Quién es

**Vektor Precision CNC.** Taller de maquinados CNC de precisión en Saltillo, Coahuila, que fabrica para el corredor automotriz del norte de México y clientes de nearshoring. No vende "soluciones de ingeniería" en abstracto — vende piezas que entran en tolerancia o no entran, en el plazo que prometió o no lo cumplió.

**Servicios:**
1. Fresado CNC vertical — mesas hasta 2 m, tolerancias de ±0.001".
2. Torneado CNC de alta precisión — piezas únicas y de gran formato hasta 14", centros Mazak y Okuma.
3. Shims / lainas a medida y piezas de desgaste para troqueles — dureza hasta 63 HRC en D2, H13 y Vanadis.
4. Ensambles y sub-ensambles industriales listos para instalar.

## Audiencia

Ingenieros de manufactura, compradores técnicos y gerentes de calidad de plantas automotrices y proveedores Tier 1/Tier 2. Gente que lee hojas de datos por trabajo, no landing pages. Llegan comparando talleres por tres cosas: **¿puedes con esta tolerancia?**, **¿en qué material?**, **¿para cuándo?** El sitio tiene que responder eso antes que "confíen en nosotros".

## El trabajo del sitio

Convertir una visita en una cotización con specs adjuntas. Todo lo demás (marca, credibilidad, "por qué nosotros") es secundario a que el visitante encuentre rápido: capacidad de máquina, tolerancia, material, tiempo de entrega.

## Por qué no el look del template de referencia

La referencia (`references/1.png`, template "Kondor") es el kit genérico de sitios de ingeniería: naranja sobre oscuro, tarjetas redondeadas idénticas, sombra gris suave bajo todo, iconos de línea en círculos, hero centrado con foto de stock de gente con casco. Es reconocible como plantilla comprada, no como un taller específico.

Lo que sí tomamos de ese mundo: paleta oscura técnica y un acento de precisión — porque eso **sí** corresponde al objeto real (una cabina de máquina CNC, un lector DRO, un panel de control Fanuc/Mazak son fondos oscuros con acentos de estado). La diferencia es de dónde sale cada decisión:

- El vocabulario visual viene del **objeto de trabajo real**: dibujo técnico acotado, hoja de especificaciones, lector de cota digital, marcas de registro de una prensa de troquel — no de un kit de componentes de SaaS.
- Los datos (tolerancia, dureza, tiempo de entrega) se presentan como **lecturas de instrumento** (monoespaciada, alineación tabular), nunca como decoración.
- Un acento de acción (naranja) y un acento de dato/estado (cian) están separados por función, no por gusto — así como en un panel real la luz de "ACTIVO" nunca es del mismo color que el botón de "CICLO START".

## Principios

1. **Cada línea es una cota, no un adorno.** Los hairlines, marcas de esquina y separadores existen porque acotan algo (una medida, un límite, una sección) — igual que en un plano.
2. **Los números se leen como instrumento.** Toda cifra técnica (tolerancia, HRC, tiempo, dimensión) va en monoespaciada, alineada, nunca en la tipografía de párrafo.
3. **Un acento para actuar, otro para leer.** Naranja = lo que el usuario puede hacer (cotizar, contactar). Cian = lo que la máquina/el taller está reportando (estado, dato, métrica). Nunca se intercambian.
4. **Alineado a la izquierda, denso, asimétrico.** Como una hoja de datos, no como un hero de marketing centrado. El contenido gana al espacio decorativo.
5. **Vocabulario real.** "±0.001", "63 HRC", "D2 / H13 / Vanadis", "Mazak / Okuma", "<24 h" — nunca "soluciones robustas" ni "excelencia operacional".

Ver [`01-style-guide.md`](./01-style-guide.md) para la guía de estilo, [`02-tokens.md`](./02-tokens.md) / [`tokens.css`](./tokens.css) para los tokens, [`03-components.md`](./03-components.md) para especificación de componentes, y [`style-guide.html`](./style-guide.html) para la referencia viva.
