export interface StockImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: { photographer: string; url: string };
}

export const IMAGES: {
  heroMachining: StockImage;
  plantOverview: StockImage;
  metrology: StockImage;
  capabilitiesHeader: StockImage;
  specialProjects: StockImage;
} = {
  heroMachining: {
    src: "/images/hero-machining.webp",
    alt: "Fresadora CNC cortando una pieza metálica, con refrigerante en el punto de corte",
    width: 1920,
    height: 1280,
    credit: {
      photographer: "Daniel Smyth",
      url: "https://www.pexels.com/@daniel-smyth-83914874/",
    },
  },
  plantOverview: {
    src: "/images/plant-overview.webp",
    alt: "Piso de planta de un taller de maquinado industrial con varios centros CNC",
    width: 1920,
    height: 1081,
    credit: {
      photographer: "Mazhar Ulazhar",
      url: "https://www.pexels.com/@mazhar-ulazhar-50963217/",
    },
  },
  metrology: {
    src: "/images/metrology.webp",
    alt: "Calibrador de precisión midiendo una pieza metálica maquinada",
    width: 1200,
    height: 1797,
    credit: {
      photographer: "Michael Orshan",
      url: "https://www.pexels.com/@michael-orshan-2159363670/",
    },
  },
  capabilitiesHeader: {
    src: "/images/capabilities-header.webp",
    alt: "Piezas metálicas maquinadas de precisión en primer plano",
    width: 1920,
    height: 1280,
    credit: {
      photographer: "Connor Lucock",
      url: "https://www.pexels.com/@connor-lucock-259838/",
    },
  },
  specialProjects: {
    src: "/images/service-special-projects.webp",
    alt: "Ingeniero revisando un diseño técnico en AutoCAD en pantalla",
    width: 1000,
    height: 667,
    credit: {
      photographer: "ThisIsEngineering",
      url: "https://www.pexels.com/@thisisengineering",
    },
  },
};

// Header images for the homepage service cards, keyed by docs/services.csv id.
export const SERVICE_CARD_IMAGES: Record<string, StockImage> = {
  "cnc-001": {
    src: "/images/service-cnc-001.webp",
    alt: "Fresadora CNC vertical cortando metal con refrigerante en el punto de corte",
    width: 1000,
    height: 673,
    credit: { photographer: "Daniel Smyth", url: "https://www.pexels.com/@daniel-smyth-83914874/" },
  },
  "cnc-003": {
    src: "/images/service-cnc-003.webp",
    alt: "Torno CNC de precisión con virutas metálicas y acabado cilíndrico pulido",
    width: 1000,
    height: 1500,
    credit: { photographer: "Connor Lucock", url: "https://www.pexels.com/@connor-lucock-259838/" },
  },
  "her-001": IMAGES.metrology,
  "her-002": {
    src: "/images/service-her-002.webp",
    alt: "Fresa de corte de metal duro en primer plano, representando piezas de desgaste endurecidas",
    width: 1000,
    height: 715,
    credit: { photographer: "Pixabay", url: "https://www.pexels.com/@pixabay" },
  },
  "est-003": {
    src: "/images/service-est-003.webp",
    alt: "Ensamble de piezas mecánicas de precisión sobre mesa de trabajo",
    width: 800,
    height: 534,
    credit: { photographer: "Unsplash", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
  },
};
