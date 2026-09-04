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
