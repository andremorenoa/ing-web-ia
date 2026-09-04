import { Hero } from "@/components/sections/Hero";
import { NearshoringPanel } from "@/components/sections/NearshoringPanel";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { IMAGES } from "@/lib/images";
import { getFeaturedServices } from "@/lib/services";

export default function HomePage() {
  const featuredServices = getFeaturedServices();

  return (
    <>
      <Hero image={IMAGES.heroMachining} />
      <NearshoringPanel />
      <ServicesPreview services={featuredServices} />
      <QuoteForm />
    </>
  );
}
