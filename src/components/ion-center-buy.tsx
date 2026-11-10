import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronRight, CreditCard, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { addToCart, useCartCount } from "@/lib/cart";
import { formatBRL, isPurchasable, type Product } from "@/lib/catalog";
import { galleryFor, ionCenterProducts, type Finish, type IonCenterModel } from "@/lib/ion-center";

const SWATCH: Record<Finish, string> = {
  Branco: "border border-hairline bg-white",
  Preto: "bg-obsidian",
};

export const priceText = (p: Product | undefined | null) =>
  isPurchasable(p) ? formatBRL(p.priceCents) : "Valor sob consulta";

/** "A partir de R$ X" considerando só os modelos com preço publicado. */
export const lowestPrice = (products: Product[] | null, slugs = ionCenterProducts.map((m) => m.slug)) => {
  const prices = (products ?? []).filter((p) => slugs.includes(p.slug) && isPurchasable(p)).map((p) => p.priceCents as number);
  return prices.length ? Math.min(...prices) : null;
};

/**
 * Configurador de compra da linha Ion Center: modelo → acabamento → sacola.
 * Modelos sem preço no catálogo viram pedido de orçamento com o consultor.
 */
export default function IonCenterBuy({
  products,
  slug,
  onSlugChange,
  onConsult,
  showModelPicker = true,
}: {
  products: Product[] | null;
  slug: string;
  onSlugChange: (slug: string) => void;
  onConsult: (label: string) => void;
  showModelPicker?: boolean;
}) {
  const model: IonCenterModel = ionCenterProducts.find((m) => m.slug === slug) ?? ionCenterProducts[0];
  const [finish, setFinish] = useState<Finish>(model.finishes[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const cartCount = useCartCount();

  const product = products?.find((p) => p.slug === model.slug);
  const purchasable = isPurchasable(product);
  const gallery = galleryFor(model, finish);
  const image = gallery[Math.min(imageIndex, gallery.length - 1)];
  const label = `${model.name} · ${finish}`;

  useEffect(() => {
    if (!model.finishes.includes(finish)) setFinish(model.finishes[0]);
    setImageIndex(0);
  }, [model.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setImageIndex(0), [finish]);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 2400);
    return () => clearTimeout(t);
  }, [justAdded]);

  const handlePrimary = () => {
    if (purchasable) {
      addToCart(model.slug, 1, finish);
      setJustAdded(true);
    } else {
      onConsult(label);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      {/* Galeria */}
      <div className="self-start lg:sticky lg:top-24">
        <div className="relative aspect-square overflow-hidden rounded-[28px] bg-white">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.img
              key={`${model.slug}-${image.base}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              src={`/images/${image.base}.webp`}
              srcSet={`/images/${image.base}-sm.webp 520w, /images/${image.base}.webp 900w`}
              sizes="(max-width: 1024px) 92vw, 55vw"
              alt={image.alt}
              decoding="async"
              className={
                image.fit === "contain"
                  ? "absolute inset-[8%] h-[84%] w-[84%] object-contain"
                  : "absolute inset-0 h-full w-full object-cover"
              }
            />
          </AnimatePresence>
        </div>

        {gallery.length > 1 && (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Fotos do produto">
            {gallery.map((g, i) => (
              <button
                type="button"
                key={g.base}
                role="tab"
                aria-selected={i === imageIndex}
                aria-label={g.alt}
                onClick={() => setImageIndex(i)}
                className={`relative h-[4.5rem] w-[4.5rem] shrink-0 cursor-pointer overflow-hidden rounded-[16px] bg-white transition-shadow ${
                  i === imageIndex ? "ring-2 ring-action" : "ring-1 ring-hairline hover:ring-pewter"
                }`}
              >
                <img
                  src={`/images/${g.base}-sm.webp`}
                  alt=""
                  loading="lazy"
                  className={g.fit === "contain" ? "h-full w-full object-contain p-1.5" : "h-full w-full object-cover"}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Configuração */}
      <div className="text-obsidian">
        <p className="t-small font-semibold text-signal-ink">{purchasable ? "Disponível para compra" : "Sob orçamento"}</p>
        <h3 className="t-headline-lg mt-1">{model.name}</h3>
        <p className="t-body mt-3 text-pewter">{model.description}</p>

        {showModelPicker && (
          <fieldset className="mt-10">
            <legend className="t-title">
              Modelo. <span className="text-pewter">Qual combina com a sua rotina?</span>
            </legend>
            <div className="mt-4 grid gap-2.5" role="radiogroup" aria-label="Modelo">
              {ionCenterProducts.map((m) => {
                const selected = m.slug === model.slug;
                const p = products?.find((x) => x.slug === m.slug);
                return (
                  <button
                    type="button"
                    key={m.slug}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onSlugChange(m.slug)}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-[16px] bg-white px-5 py-4 text-left transition-shadow ${
                      selected ? "ring-2 ring-action" : "ring-1 ring-hairline hover:ring-pewter"
                    }`}
                  >
                    <span>
                      <span className="block text-[1.0625rem] font-semibold tracking-[-0.012em]">{m.name}</span>
                      <span className="t-small block text-pewter">{m.headline}</span>
                    </span>
                    <span className="t-small shrink-0 text-right [font-variant-numeric:tabular-nums]">
                      {products ? priceText(p) : "…"}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <fieldset className="mt-10">
          <legend className="t-title">
            Acabamento. <span className="text-pewter">Escolha a cor.</span>
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Acabamento">
            {model.finishes.map((f) => {
              const selected = f === finish;
              return (
                <button
                  type="button"
                  key={f}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setFinish(f)}
                  className={`flex cursor-pointer items-center gap-3 rounded-[16px] bg-white px-5 py-4 transition-shadow ${
                    selected ? "ring-2 ring-action" : "ring-1 ring-hairline hover:ring-pewter"
                  }`}
                >
                  <span className={`h-6 w-6 shrink-0 rounded-full ${SWATCH[f]}`} aria-hidden="true" />
                  <span className="text-[1.0625rem] font-semibold tracking-[-0.012em]">{f}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Resumo e ação */}
        <div className="mt-10 rounded-[22px] bg-white p-6 md:p-7">
          <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
            <p className="t-small text-pewter">{label}</p>
            <p className="text-[1.75rem] font-semibold leading-none tracking-[-0.025em] [font-variant-numeric:tabular-nums]">
              {products ? priceText(product) : <span className="inline-block h-7 w-28 animate-pulse rounded-lg bg-frost align-middle" />}
            </p>
          </div>
          <p className="t-small mt-3 text-pewter">
            {purchasable
              ? "Pagamento pelo Mercado Pago: Pix, cartão ou boleto. Frete calculado ao finalizar."
              : "Um consultor monta o orçamento com você, incluindo a instalação ideal para a sua cozinha."}
          </p>

          <button type="button" onClick={handlePrimary} disabled={!products} className="btn-action mt-6 min-h-12 w-full text-base">
            {justAdded ? (
              <>
                <Check size={18} aria-hidden="true" /> Adicionado à sacola
              </>
            ) : purchasable ? (
              "Adicionar à sacola"
            ) : (
              "Solicitar orçamento"
            )}
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => onConsult(label)} className="link-arrow text-[0.9375rem] text-link">
              Falar com um consultor
              <ChevronRight size={16} aria-hidden="true" />
            </button>
            {cartCount > 0 && (
              <a href="/carrinho" className="link-arrow text-[0.9375rem] text-link">
                Ver sacola ({cartCount})
                <ChevronRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <ul className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {[
            { icon: ShieldCheck, text: `Garantia de ${model.warranty}` },
            { icon: CreditCard, text: "Pix, cartão ou boleto" },
            { icon: Truck, text: "Frete calculado no checkout" },
            { icon: MessageCircle, text: "Consultor no WhatsApp" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="t-small flex items-center gap-3 text-obsidian">
              <Icon size={20} strokeWidth={1.6} className="shrink-0 text-pewter" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
