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

/** Torneira que acompanha o aparelho. */
export type Faucet = "Básico" | "Faucet" | "Gourmet";
export const FAUCETS: Faucet[] = ["Básico", "Faucet", "Gourmet"];

/**
 * A sacola e o checkout guardam a configuração num único texto `variant`, ex.: "Preto - Gourmet".
 * O separador é " - " porque o checkout só aceita letras, números, espaço e hífen nesse campo.
 */
export const variantOf = (finish: Finish, faucet: Faucet) => `${finish} - ${faucet}`;

export const parseVariant = (variant?: string): { finish?: Finish; faucet?: Faucet } => {
  const [f, t] = (variant ?? "").split(" - ");
  return {
    finish: f === "Branco" || f === "Preto" ? f : undefined,
    faucet: FAUCETS.includes(t as Faucet) ? (t as Faucet) : undefined,
  };
};

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
    imageAlt: "Ion Center Slim preto, vista frontal com a janela dos quatro refis",
    description: "O mais fino da linha, com 11,5 cm de profundidade, para instalar na parede, na bancada ou sob a pia, com saída de água natural.",
    highlights: [
      "Design slim",
      "Água natural",
      "4 refis Max Water Diamond",
      "Instalação em parede, bancada ou sob a pia",
      "Compatível com Faucet, Gourmet, máquinas de café e bebedouros",
    ],
    indicated: "Cozinhas residenciais, ambientes gourmet e aplicações sob bancada.",
    cta: "Comprar Slim",
    finishes: ["Branco", "Preto"],
    gallery: {
      Branco: [
        { base: "slim-branco", alt: "Ion Center Slim branco, vista frontal com a janela dos quatro refis", fit: "cover" },
        { base: "white02", alt: "Ion Center Slim branco, vista em ângulo", fit: "contain" },
        { base: "white01", alt: "Ion Center Slim branco, vista frontal", fit: "contain" },
      ],
      Preto: [
        { base: "slim-preto", alt: "Ion Center Slim preto, vista frontal com a janela dos quatro refis", fit: "cover" },
        { base: "black02", alt: "Ion Center Slim preto, vista em ângulo", fit: "contain" },
        { base: "black01", alt: "Ion Center Slim preto, vista frontal", fit: "contain" },
      ],
      shared: [
        { base: "ioncenterkitchen", alt: "Ion Center Slim branco e preto sobre bancada de mármore", fit: "cover" },
        { base: "SLIM-ambiente", alt: "Ion Center Slim instalado sob a bancada de uma cozinha branca", fit: "cover" },
      ],
    },
    warranty: "1 ano",
    specs: [
      ["Marca", "Waterfall"],
      ["Modelo", "WaterDiamond IonCenter Slim"],
      ["Cor", "Branco, Preto"],
      ["Instalação", "Parede ou bancada"],
      ["Tipo de água", "Natural"],
      ["Refis", "4 refis Max Water Diamond"],
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
    headline: "Água gelada na bancada",
    image: "/images/SMARTIMG.webp",
    imageSm: "/images/SMARTIMG-sm.webp",
    imageAlt: "Ion Center Smart branco, vista frontal",
    description: "Água natural, fria e gelada saindo do mesmo aparelho, com 600 ml de gelada sempre prontos.",
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
      Branco: [
        { base: "smart-branco", alt: "Ion Center Smart branco, vista frontal", fit: "cover" },
        { base: "smart-branco-cozinha", alt: "Ion Center Smart branco sobre a bancada de uma cozinha", fit: "cover" },
      ],
      Preto: [{ base: "smart-preto", alt: "Ion Center Smart preto, vista frontal", fit: "cover" }],
      shared: [
        { base: "SMART-ambiente", alt: "Ion Center Smart preto sobre a bancada de uma cozinha", fit: "cover" },
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
    headline: "Água gelada para alto consumo",
    image: "/images/TURBOIMG.webp",
    imageSm: "/images/TURBOIMG-sm.webp",
    imageAlt: "Ion Center Turbo preto, vista frontal",
    description: "Refrigeração por compressor e 2,8 L de água gelada guardados, indicado para casas e escritórios com alto consumo.",
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
      Branco: [{ base: "turbo-branco", alt: "Ion Center Turbo branco, vista frontal", fit: "cover" }],
      Preto: [
        { base: "turbo-preto", alt: "Ion Center Turbo preto, vista frontal", fit: "cover" },
        { base: "turbo-preto-cozinha", alt: "Ion Center Turbo preto sobre a bancada de uma cozinha", fit: "cover" },
      ],
      shared: [
        { base: "TURBO-ambiente", alt: "Ion Center Turbo sobre a bancada de uma cozinha", fit: "cover" },
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

/** Todas as fotos do modelo: primeiro as do acabamento escolhido, depois as dos outros e as compartilhadas.
    Os recortes em fundo branco ("contain") vão para o fim, depois das fotos produzidas.
    A primeira é sempre do acabamento escolhido (o carrinho usa ela como miniatura). */
export const galleryFor = (model: IonCenterModel, finish: Finish): GalleryImage[] => {
  const all = [
    ...(model.gallery[finish] ?? []),
    ...model.finishes.filter((f) => f !== finish).flatMap((f) => model.gallery[f] ?? []),
    ...model.gallery.shared,
  ];
  return [...all.filter((g) => g.fit !== "contain"), ...all.filter((g) => g.fit === "contain")];
};
