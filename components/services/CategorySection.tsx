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
              <th
                scope="col"
                className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Proceso
              </th>
              <th
                scope="col"
                className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Materiales
              </th>
              <th
                scope="col"
                className="py-3 pr-4 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
                Especificaciones
              </th>
              <th
                scope="col"
                className="py-3 font-mono text-xs uppercase tracking-[0.06em] text-steel-400"
              >
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
