const MACHINES = [
  {
    model: "Mazak VTC-800",
    type: "Fresado vertical 3/4 ejes",
    travel: "X 2000 · Y 800 · Z 600 mm",
    spindle: "12,000 RPM",
    application: "Moldes, placas base, piezas estructurales",
  },
  {
    model: "Mazak VTC-Nexus",
    type: "Fresado vertical 5 ejes",
    travel: "X 762 · Y 510 · Z 510 mm",
    spindle: "15,000 RPM",
    application: "Piezas críticas de geometría compleja",
  },
  {
    model: "Okuma LB3000",
    type: "Torneado CNC",
    travel: "⌀356 × 1000 mm",
    spindle: "4,500 RPM",
    application: "Ejes, flechas, componentes cilíndricos",
  },
  {
    model: "Okuma Genos L300",
    type: "Torneado de precisión",
    travel: "⌀300 × 500 mm",
    spindle: "6,000 RPM",
    application: "Piezas de precisión, lotes cortos",
  },
];

const METROLOGY_EQUIPMENT = [
  "Calibradores digitales Mitutoyo",
  "Micrómetros de exteriores e interiores",
  "Bloques patrón certificados",
  "Mesa de granito para inspección dimensional",
];

export function MachineSpecTable() {
  return (
    <section className="border-b border-steel-700 py-16">
      <h2 className="mb-8 text-[2.25rem] font-semibold leading-[1.15]">
        Parque de máquinas y metrología
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-steel-700">
              <th
                scope="col"
                className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Equipo
              </th>
              <th
                scope="col"
                className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Recorridos
              </th>
              <th
                scope="col"
                className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Husillo
              </th>
              <th
                scope="col"
                className="py-3 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Aplicación típica
              </th>
            </tr>
          </thead>
          <tbody>
            {MACHINES.map((machine) => (
              <tr key={machine.model} className="border-b border-steel-700 hover:bg-steel-900">
                <td className="py-3 pr-4">
                  <div className="font-medium">{machine.model}</div>
                  <p className="text-sm text-steel-400">{machine.type}</p>
                </td>
                <td className="py-3 pr-4 font-mono text-[0.9375rem] text-steel-300">
                  {machine.travel}
                </td>
                <td className="py-3 pr-4 font-mono text-[0.9375rem] text-readout-400">
                  {machine.spindle}
                </td>
                <td className="py-3 font-mono text-[0.9375rem] text-steel-300">
                  {machine.application}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10 border border-steel-700 bg-steel-900 p-6">
        <h3 className="mb-4 text-[1.375rem] font-semibold">Metrología e inspección</h3>
        <ul className="grid gap-2 font-mono text-sm text-steel-300 sm:grid-cols-2">
          {METROLOGY_EQUIPMENT.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
