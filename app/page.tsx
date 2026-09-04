import { Hero } from "@/components/sections/Hero";
import { NearshoringPanel } from "@/components/sections/NearshoringPanel";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { ShimsSpotlight } from "@/components/sections/ShimsSpotlight";
import { IMAGES } from "@/lib/images";
import { getFeaturedServices, getServices } from "@/lib/services";

export default function HomePage() {
  const services = getServices();
  const featuredServices = getFeaturedServices(services);
  const shimsService = services.find((service) => service.id === "her-001");

  return (
    <>
      <Hero image={IMAGES.heroMachining} />
      <NearshoringPanel />
      <ServicesPreview services={featuredServices} />
      {shimsService && <ShimsSpotlight service={shimsService} />}
      <QuoteForm />
    </>
  );
}
