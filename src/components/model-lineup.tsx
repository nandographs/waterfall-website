import { useState, type Key } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Droplets, Ruler, Snowflake, Users, Zap } from "lucide-react";
import { ionCenterProducts, type Finish, type IonCenterModel } from "@/lib/ion-center";
import { isPurchasable, type Product } from "@/lib/catalog";
import { priceText } from "@/components/ion-center-buy";

/** Foto de ambiente de cada modelo por acabamento, com o ponto de foco para o recorte quadrado. */
const SCENE: Record<string, Record<Finish, { base: string; pos: string }>> = {
  "ion-center-slim": {
    Branco: { base: "SLIM-ambiente", pos: "50% 78%" },
    Preto: { base: "ioncenterkitchen", pos: "50% 50%" },
  },
  "ion-center-smart": {
    Branco: { base: "smart-branco-cozinha", pos: "55% 55%" },
    Preto: { base: "SMART-ambiente", pos: "60% 55%" },
  },
  "ion-center-turbo": {
    Branco: { base: "TURBO-ambiente", pos: "60% 62%" },
    Preto: { base: "turbo-preto-cozinha", pos: "55% 55%" },
  },
};

type Stat = { icon: typeof Droplets; value: string; label: string } | null;

/**
 * Os mesmos cinco pontos para os três modelos, na mesma ordem, para a comparação ser lida em linha.
 * `null` mostra um traço: o recurso não existe naquele modelo. Valores tirados da ficha técnica.
 */
const STATS: Record<string, Stat[]> = {
  "ion-center-slim": [
    { icon: Droplets, value: "Natural", label: "Tipo de água" },
    null,
    null,
    { icon: Ruler, value: "11,5 cm", label: "de profundidade" },
    { icon: Users, value: "Cozinhas e espaços gourmet", label: "Indicado para" },
  ],
  "ion-center-smart": [
    { icon: Droplets, value: "Natural, fria e gelada", label: "Tipo de água" },
    { icon: Snowflake, value: "600 ml", label: "de água gelada sempre pronta" },
    { icon: Zap, value: "Eletrônica", label: "Refrigeração, 200 ml por hora" },
    { icon: Ruler, value: "16 cm", label: "de largura, sobre a bancada" },
    { icon: Users, value: "Famílias e escritórios", label: "Indicado para" },
  ],
  "ion-center-turbo": [
    { icon: Droplets, value: "Natural e gelada", label: "Tipo de água" },
    { icon: Snowflake, value: "2,8 L", label: "de água gelada sempre pronta" },
    { icon: Zap, value: "Compressor", label: "Refrigeração, 1,5 L por hora" },
    { icon: Ruler, value: "25,5 cm", label: "de largura, sobre a bancada" },
    { icon: Users, value: "Famílias maiores e empresas", label: "Indicado para" },
  ],
};

/** Resumo de uma frase de cada modelo. */
const SUMMARY: Record<string, string> = {
  "ion-center-slim": "Central de tratamento compacta para instalar na parede, na bancada ou sob a pia, com saída de água natural.",
  "ion-center-smart": "Purificador de bancada com saída de água natural, fria e gelada.",
  "ion-center-turbo": "Purificador de bancada com a maior capacidade de refrigeração da linha.",
};

const SWATCH: Record<Finish, string> = {
  Branco: "bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.18)]",
  Preto: "bg-obsidian",
};

function ModelColumn({
  model,
  product,
  loading,
  onBuy,
  onSpecs,
}: {
  model: IonCenterModel;
  product: Product | undefined;
  loading: boolean;
  key?: Key;
  onBuy: (slug: string) => void;
  onSpecs: (model: IonCenterModel) => void;
}) {
  const [finish, setFinish] = useState<Finish>(model.finishes[0]);
  const scene = SCENE[model.slug]?.[finish];
  const base = scene?.base;

  return (
    // No desktop cada coluna herda as linhas da grade (subgrid), então foto, nome e cada ponto ficam alinhados.
    <article className="flex w-[78vw] max-w-[22rem] shrink-0 snap-start flex-col text-center md:row-span-10 md:grid md:w-auto md:max-w-none md:grid-rows-subgrid md:gap-0">
      <a
        href={`/loja/${model.slug}`}
        className="relative block aspect-square overflow-hidden rounded-[28px] bg-obsidian"
        aria-label={`Ver o ${model.name}`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={base}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            src={`/images/${base}.webp`}
            srcSet={`/images/${base}-sm.webp 500w, /images/${base}.webp 900w`}
            sizes="(max-width: 768px) 78vw, 30vw"
            alt={`${model.name} ${finish.toLowerCase()}`}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: scene?.pos }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
          />
        </AnimatePresence>
      </a>

      <div className="mt-6 flex justify-center gap-3" role="radiogroup" aria-label={`Cor do ${model.name}`}>
        {model.finishes.map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={f === finish}
            aria-label={f}
            onClick={() => setFinish(f)}
            className={`h-6 w-6 cursor-pointer rounded-full ring-offset-2 ring-offset-frost transition-shadow ${SWATCH[f]} ${
              f === finish ? "ring-2 ring-action" : "hover:ring-1 hover:ring-pewter"
            }`}
          />
        ))}
      </div>

      <div className="mt-6">
        <h3 className="t-headline-lg">{model.tag}</h3>
        <p className="t-body mt-2 text-pewter">{model.headline}</p>
        <p className="t-small mx-auto mt-4 max-w-[19rem] text-obsidian/80">{SUMMARY[model.slug]}</p>
      </div>

      <p className="t-title mt-5 [font-variant-numeric:tabular-nums]">
        {loading ? <span className="inline-block h-5 w-28 animate-pulse rounded-lg bg-white align-middle" /> : priceText(product)}
      </p>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button type="button" onClick={() => onBuy(model.slug)} className="btn-action">
          {loading || isPurchasable(product) ? "Comprar" : "Pedir orçamento"}
        </button>
        <button type="button" onClick={() => onSpecs(model)} className="link-arrow text-link">
          Ficha técnica
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {(STATS[model.slug] ?? []).map((stat, i) => (
        <div key={i} className={`flex flex-col items-center px-4 pt-8 ${i === 0 ? "mt-10 border-t border-hairline" : ""}`}>
          {stat ? (
            <>
              <stat.icon size={28} strokeWidth={1.4} className="text-obsidian" aria-hidden="true" />
              <p className="t-title mt-3">{stat.value}</p>
              <p className="t-small mt-1 max-w-[16rem] text-pewter">{stat.label}</p>
            </>
          ) : (
            <span className="mt-3 block h-px w-6 bg-pewter/50" aria-label="Não tem" />
          )}
        </div>
      ))}
    </article>
  );
}

/** Comparação dos três modelos no estilo "qual é o ideal para você": foto, cor, preço e os mesmos pontos em linha. */
export default function ModelLineup({
  products,
  onBuy,
  onSpecs,
}: {
  products: Product[] | null;
  onBuy: (slug: string) => void;
  onSpecs: (model: IonCenterModel) => void;
}) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-x-8 md:overflow-visible md:px-0 lg:gap-x-12 [&::-webkit-scrollbar]:hidden">
      {ionCenterProducts.map((model) => (
        <ModelColumn
          key={model.slug}
          model={model}
          product={products?.find((p) => p.slug === model.slug)}
          loading={!products}
          onBuy={onBuy}
          onSpecs={onSpecs}
        />
      ))}
    </div>
  );
}
