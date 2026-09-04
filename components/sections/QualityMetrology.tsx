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
