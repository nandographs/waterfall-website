import { supabase } from "./supabase";

export type Product = {
  slug: string;
  brand: "bionlife" | "waterdiamond";
  name: string;
  headline: string | null;
  image: string | null; // nome-base em /images, sem extensão
  priceCents: number | null; // null = sob consulta
  requiresConsultant: boolean;
};

type Row = {
  slug: string;
  brand: Product["brand"];
  name: string;
  headline: string | null;
  image: string | null;
  price_cents: number | null;
  requires_consultant: boolean;
};

// Fallback local: mantém a loja renderizando sem Supabase configurado (dev, preview).
// Espelha o seed de supabase/migrations/0001_loja_afiliados.sql.
const FALLBACK: Product[] = [
  { slug: "ion-center-slim", brand: "waterdiamond", name: "Ion Center Slim", headline: "Compacto e discreto", image: "SLIMIMG", priceCents: null, requiresConsultant: true },
  { slug: "ion-center-smart", brand: "waterdiamond", name: "Ion Center Smart", headline: "Tecnologia e praticidade", image: "SMARTIMG", priceCents: null, requiresConsultant: true },
  { slug: "ion-center-turbo", brand: "waterdiamond", name: "Ion Center Turbo", headline: "Máximo desempenho", image: "TURBOIMG", priceCents: null, requiresConsultant: true },
  { slug: "colchao-bionlife-especiais", brand: "bionlife", name: "BionLife Especiais", headline: "Completo e sofisticado", image: "bionlife-linha-especiais", priceCents: null, requiresConsultant: false },
  { slug: "colchao-bionlife-relax", brand: "bionlife", name: "BionLife Relax", headline: "Macio e acolhedor", image: "bionlife-linha-relax", priceCents: null, requiresConsultant: false },
  { slug: "colchao-bionlife-vacuo", brand: "bionlife", name: "BionLife A Vácuo", headline: "Macio e adaptável", image: "bionlife-linha-vacuo", priceCents: null, requiresConsultant: false },
  { slug: "colchao-bionlife-magnetico", brand: "bionlife", name: "BionLife Magnético", headline: "Firme e estruturado", image: "bionlife-linha-magnetico", priceCents: null, requiresConsultant: false },
];

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return FALLBACK;
  const { data, error } = await supabase
    .from("products")
    .select("slug, brand, name, headline, image, price_cents, requires_consultant")
    .order("sort_order");
  if (error || !data?.length) return FALLBACK;
  return (data as Row[]).map((r) => ({
    slug: r.slug,
    brand: r.brand,
    name: r.name,
    headline: r.headline,
    image: r.image,
    priceCents: r.price_cents,
    requiresConsultant: r.requires_consultant,
  }));
}

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Imagem do produto: .webp em /images, com versão -sm para celular. */
export const productImage = (p: Product) =>
  p.image ? { src: `/images/${p.image}.webp`, srcSet: `/images/${p.image}-sm.webp 480w, /images/${p.image}.webp 720w` } : null;
