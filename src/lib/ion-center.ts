/**
 * Linha Water Diamond Ion Center: conteúdo editorial e ficha técnica de cada modelo.
 * Preço e disponibilidade NÃO moram aqui: vêm do catálogo (Supabase), pelo `slug`.
 */

export type GalleryImage = {
  /** Nome-base em /images, sem extensão (existe também a versão -sm). */
  base: string;
  alt: string;
  /** "contain" para recortes com fundo transparente, "cover" para fotos de ambiente. */
  fit: "contain" | "cover";
};

export type Finish = "Branco" | "Preto";

export type IonCenterModel = {
  slug: string;
  tag: string;
  name: string;
  headline: string;
  image: string;
  imageSm: string;
  imageAlt: string;
  description: string;
  highlights: string[];
  indicated: string;
  cta: string;
  featured?: boolean;
  finishes: Finish[];
  /** Galeria por acabamento. Quando não há foto do acabamento, usa `shared`. */
  gallery: Partial<Record<Finish, GalleryImage[]>> & { shared: GalleryImage[] };
  warranty: string;
  specs: [string, string][];
};

export const ionCenterProducts: IonCenterModel[] = [
  {
    slug: "ion-center-slim",
    tag: "Slim",
    name: "Ion Center Slim",
    headline: "Compacto e discreto",
    image: "/images/SLIMIMG.webp",
    imageSm: "/images/SLIMIMG-sm.webp",
    imageAlt: "Ion Center Slim instalado sob a bancada de uma cozinha branca",
    description: "Ideal para quem busca uma central de tratamento eficiente, elegante e integrada ao ambiente.",
    highlights: [
      "Design slim",
      "Água natural",
      "4 refis Max WaterDiamond",
      "Instalação em parede, bancada ou sob a pia",
      "Compatível com Faucet, Gourmet, máquinas de café e bebedouros",
    ],
    indicated: "Cozinhas residenciais, ambientes gourmet e aplicações sob bancada.",
    cta: "Comprar Slim",
    finishes: ["Branco", "Preto"],
    gallery: {
      Branco: [
        { base: "white02", alt: "Ion Center Slim branco, vista em ângulo", fit: "contain" },
        { base: "white01", alt: "Ion Center Slim branco, vista frontal", fit: "contain" },
      ],
      Preto: [
        { base: "black02", alt: "Ion Center Slim preto, vista em ângulo", fit: "contain" },
        { base: "black01", alt: "Ion Center Slim preto, vista frontal", fit: "contain" },
      ],
      shared: [
        { base: "ioncenterkitchen", alt: "Ion Center Slim branco e preto sobre bancada de mármore", fit: "cover" },
        { base: "SLIMIMG", alt: "Ion Center Slim instalado sob a bancada de uma cozinha branca", fit: "cover" },
      ],
    },
    warranty: "1 ano",
    specs: [
      ["Marca", "Waterfall"],
      ["Modelo", "WaterDiamond IonCenter Slim"],
      ["Cor", "Branco, Preto"],
      ["Instalação", "Parede ou bancada"],
      ["Tipo de água", "Natural"],
      ["Refis", "4 refis Max WaterDiamond"],
      ["Saída de água", "Sim"],
      ["Vida útil do refil", "9 a 18 meses ou até 6.000 L de água"],
      ["Vazão nominal", "0,75 L/minuto"],
      ["Pressão de funcionamento", "3 a 40 metros de coluna de água"],
      ["Temperatura de operação", "5°C a 42°C"],
      ["Material", "Poliestireno, ABS, polipropileno e carvão ativado"],
      ["Tamanho com embalagem (cm)", "30,5 x 41 x 12"],
      ["Tamanho sem embalagem (cm)", "30 x 40 x 11,5"],
      ["Peso com embalagem", "3,5 kg"],
      ["Peso sem embalagem", "3 kg"],
      ["Garantia", "01 ano"],
    ],
  },
  {
    slug: "ion-center-smart",
    tag: "Smart",
    name: "Ion Center Smart",
    headline: "Praticidade no dia a dia",
    image: "/images/SMARTIMG.webp",
    imageSm: "/images/SMARTIMG-sm.webp",
    imageAlt: "Ion Center Smart preto sobre a bancada de uma cozinha, com uma mulher servindo um copo de água",
    description: "Une tratamento completo com a conveniência de água fria, gelada e natural em um sistema compacto.",
    highlights: [
      "Água fria, gelada e natural",
      "600ml de armazenamento de água gelada",
      "Refrigeração eletrônica",
      "Disponível em branco e preto",
      "Sistema integrado ao tratamento WaterDiamond",
    ],
    indicated: "Famílias, cozinhas modernas, escritórios e ambientes de uso frequente.",
    cta: "Comprar Smart",
    featured: true,
    finishes: ["Branco", "Preto"],
    gallery: {
      shared: [
        { base: "SMARTIMG", alt: "Ion Center Smart preto sobre a bancada de uma cozinha", fit: "cover" },
      ],
    },
    warranty: "12 meses",
    specs: [
      ["Marca", "Waterfall"],
      ["Modelo", "WaterDiamond IonCenter Smart"],
      ["Água", "Fria, Gelada, Natural"],
      ["Capacidade de refrigeração", "200 ml/h"],
      ["Capacidade para armazenar", "600 ml de água gelada"],
      ["Refrigeração por", "Refrigeração eletrônica"],
      ["Cor", "Branco, Preto"],
      ["Medida (L x A x P/cm)", "16 x 47 x 36,5 cm"],
      ["Peso líquido", "3,7 kg"],
      ["Potência", "65 W"],
      ["Vazão mínima recomendada", "0,5 L/h"],
      ["Voltagem", "Bivolt"],
      ["Garantia", "12 meses"],
    ],
  },
  {
    slug: "ion-center-turbo",
    tag: "Turbo",
    name: "Ion Center Turbo",
    headline: "Mais capacidade e performance",
    image: "/images/TURBOIMG.webp",
    imageSm: "/images/TURBOIMG-sm.webp",
    imageAlt: "Ion Center Turbo preto sobre a bancada de uma cozinha, com um casal preparando alimentos",
    description: "A versão mais robusta da linha, criada para ambientes que precisam de mais volume e água gelada disponível por mais tempo.",
    highlights: [
      "Água gelada e natural",
      "1,5L/h de capacidade de refrigeração",
      "2,8L de armazenamento de água gelada",
      "Refrigeração por compressor",
      "Disponível em branco e preto",
    ],
    indicated: "Famílias maiores, empresas, consultórios, escritórios e espaços com alto consumo.",
    cta: "Comprar Turbo",
    finishes: ["Branco", "Preto"],
    gallery: {
      shared: [
        { base: "TURBOIMG", alt: "Ion Center Turbo sobre a bancada de uma cozinha", fit: "cover" },
      ],
    },
    warranty: "12 meses",
    specs: [
      ["Marca", "Waterfall"],
      ["Modelo", "WaterDiamond IonCenter Turbo"],
      ["Água", "Gelada, Natural"],
      ["Capacidade de refrigeração", "1,5 L/h"],
      ["Capacidade para armazenar", "2,8 L de água gelada"],
      ["Refrigeração por", "Compressor"],
      ["Cor", "Branco, Preto"],
      ["Medida (L x A x P/cm)", "25,5 x 49 x 36,6 cm"],
      ["Peso líquido", "8,9 kg"],
      ["Vazão mínima recomendada", "0,5 L/h"],
      ["Voltagem", "127 V, 220 V"],
      ["Garantia", "12 meses"],
    ],
  },
];

export const findIonCenterModel = (slug: string) => ionCenterProducts.find((m) => m.slug === slug);

export const galleryFor = (model: IonCenterModel, finish: Finish): GalleryImage[] => [
  ...(model.gallery[finish] ?? []),
  ...model.gallery.shared,
];
