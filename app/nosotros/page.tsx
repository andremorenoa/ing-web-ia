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
