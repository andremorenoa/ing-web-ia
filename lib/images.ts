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
