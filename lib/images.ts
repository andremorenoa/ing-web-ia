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
} = {
  heroMachining: {
    src: "https://images.pexels.com/photos/8865187/pexels-photo-8865187.jpeg?cs=srgb&dl=pexels-daniel-smyth-83914874-8865187.jpg&fm=jpg",
    alt: "Fresadora CNC cortando una pieza metálica, con refrigerante en el punto de corte",
    width: 5627,
    height: 3751,
    credit: {
      photographer: "Daniel Smyth",
      url: "https://www.pexels.com/@daniel-smyth-83914874/",
    },
  },
  plantOverview: {
    src: "https://images.pexels.com/photos/31352672/pexels-photo-31352672.jpeg?cs=srgb&dl=pexels-mazhar-ulazhar-50963217-31352672.jpg&fm=jpg",
    alt: "Piso de planta de un taller de maquinado industrial con varios centros CNC",
    width: 3195,
    height: 1799,
    credit: {
      photographer: "Mazhar Ulazhar",
      url: "https://www.pexels.com/@mazhar-ulazhar-50963217/",
    },
  },
  metrology: {
    src: "https://images.pexels.com/photos/36003971/pexels-photo-36003971.jpeg",
    alt: "Calibrador de precisión midiendo una pieza metálica maquinada",
    width: 2513,
    height: 3763,
    credit: {
      photographer: "Michael Orshan",
      url: "https://www.pexels.com/@michael-orshan-2159363670/",
    },
  },
  capabilitiesHeader: {
    src: "https://images.pexels.com/photos/28752153/pexels-photo-28752153.jpeg?cs=srgb&dl=pexels-connor-lucock-259838-28752153.jpg&fm=jpg",
    alt: "Piezas metálicas maquinadas de precisión en primer plano",
    width: 5683,
    height: 3789,
    credit: {
      photographer: "Connor Lucock",
      url: "https://www.pexels.com/@connor-lucock-259838/",
    },
  },
};

// Header images for the homepage service cards, keyed by docs/services.csv id.
// her-001 and her-002 (both "Herramental y Troqueles") intentionally share the
// same photo — a caliper measuring a machined part reads as "shims / piezas de
// desgaste" for either. All four URLs verified to resolve before use.
export const SERVICE_CARD_IMAGES: Record<string, StockImage> = {
  "cnc-001": {
    src: "https://images.pexels.com/photos/8956313/pexels-photo-8956313.jpeg?cs=srgb&dl=pexels-daniel-smyth-83914874-8956313.jpg&fm=jpg",
    alt: "Fresadora CNC vertical cortando metal con refrigerante en el punto de corte",
    width: 4718,
    height: 3176,
    credit: { photographer: "Daniel Smyth", url: "https://www.pexels.com/@daniel-smyth-83914874/" },
  },
  "cnc-003": {
    src: "https://images.pexels.com/photos/28929510/pexels-photo-28929510.jpeg?cs=srgb&dl=pexels-connor-lucock-259838-28929510.jpg&fm=jpg",
    alt: "Torno CNC de precisión con virutas metálicas y acabado cilíndrico pulido",
    width: 3456,
    height: 5184,
    credit: { photographer: "Connor Lucock", url: "https://www.pexels.com/@connor-lucock-259838/" },
  },
  "her-001": IMAGES.metrology,
  "her-002": IMAGES.metrology,
  "est-003": {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    alt: "Ensamble de piezas mecánicas de precisión sobre mesa de trabajo",
    width: 800,
    height: 534,
    credit: { photographer: "Unsplash", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" },
  },
};
