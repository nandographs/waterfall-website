import type React from "react";
import { useEffect, useState } from "react";
import { Check, ChevronRight, CreditCard, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { whatsappLink } from "@/lib/forms";
import { addToCart, useCartCount } from "@/lib/cart";
import { isPurchasable, productImage, useProducts, type Product } from "@/lib/catalog";
import { findIonCenterModel } from "@/lib/ion-center";
import IonCenterBuy, { priceText } from "@/components/ion-center-buy";
import { FloatingWhatsAppButton, SidebarMenu, SiteFooter, SiteHeader } from "@/components/site-shell";

const shell = "mx-auto w-full max-w-[1440px] px-5 md:px-12";

const BRANDS: { id: Product["brand"]; title: string; aside: string; link: { label: string; href: string } }[] = [
  {
    id: "waterdiamond",
    title: "Water Diamond Ion Center.",
    aside: "Tratamento completo da água, instalado na sua cozinha.",
    link: { label: "Conhecer a tecnologia", href: "/#etapas" },
  },
  {
    id: "bionlife",
    title: "BionLife.",
    aside: "Colchões com tecnologias para cada momento do descanso.",
    link: { label: "Conhecer a BionLife", href: "" },
  },
];

/** Em produção a BionLife vive no subdomínio próprio; em desenvolvimento, em /bionlife. */
const bionlifeUrl = () =>
  import.meta.env.DEV ? "/bionlife" : `${window.location.protocol}//bionlife.${window.location.host.replace(/^www\./, "")}`;

const consultUrl = (label: string) => whatsappLink(`Olá! Vim pela loja e quero um orçamento do ${label}.`);

const TRUST = [
  { icon: CreditCard, title: "Pix, cartão ou boleto", text: "Pagamento processado pelo Mercado Pago." },
  { icon: Truck, title: "Frete no checkout", text: "O valor da entrega aparece antes de você pagar." },
  { icon: ShieldCheck, title: "Compra segura", text: "Os dados do pagamento ficam com o Mercado Pago, não com o site." },
  { icon: MessageCircle, title: "Consultor no WhatsApp", text: "Ajuda para escolher antes e depois da compra." },
];

function ProductCard({ product }: { product: Product; key?: React.Key }) {
  const img = productImage(product);
  const purchasable = product.priceCents !== null;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-frost">
      <a href={`/loja/${product.slug}`} className="block aspect-[4/5] overflow-hidden" tabIndex={-1} aria-hidden="true">
        {img && (
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${product.brand === "waterdiamond" ? "object-[50%_72%]" : ""}`}
          />
        )}
      </a>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="t-headline">
          <a href={`/loja/${product.slug}`} className="hover:underline hover:underline-offset-4">{product.name}</a>
        </h3>
        {product.headline && <p className="t-small mt-1 text-pewter">{product.headline}</p>}
        <p className="t-body mt-5 font-medium [font-variant-numeric:tabular-nums]">{priceText(product)}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
          <a href={`/loja/${product.slug}`} className="btn-action min-h-9 px-4 text-[0.875rem]">
            {purchasable ? "Comprar" : "Ver opções"}
          </a>
          {!purchasable && (
            <a href={consultUrl(product.name)} target="_blank" rel="noopener noreferrer" className="link-arrow text-[0.9375rem] text-link">
              Pedir orçamento
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function TrustStrip() {
  return (
    <ul className="grid gap-x-8 gap-y-8 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
      {TRUST.map(({ icon: Icon, title, text }) => (
        <li key={title} className="flex gap-4">
          <Icon size={24} strokeWidth={1.5} className="shrink-0 text-obsidian" aria-hidden="true" />
          <div>
            <p className="t-title">{title}</p>
            <p className="t-small mt-1 text-pewter">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Você está em" className="t-small flex items-center gap-1.5 text-pewter">
      <a href="/loja" className="hover:text-obsidian">Loja</a>
      <ChevronRight size={14} aria-hidden="true" />
      <span className="text-obsidian">{name}</span>
    </nav>
  );
}

/** Página de produto genérica (BionLife e qualquer item sem configurador próprio). */
function SimpleProduct({ product }: { product: Product }) {
  const img = productImage(product);
  const purchasable = product.priceCents !== null;
  const cartCount = useCartCount();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2400);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      <div className="aspect-square overflow-hidden rounded-[28px] bg-frost">
        {img && <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 1024px) 55vw, 92vw" alt={product.name} className="h-full w-full object-cover" />}
      </div>
      <div className="self-center">
        <p className="t-small font-semibold text-signal-ink">{product.brand === "bionlife" ? "BionLife" : "Water Diamond"}</p>
        <h1 className="t-display mt-2">{product.name}</h1>
        {product.headline && <p className="t-headline mt-3 text-pewter">{product.headline}</p>}

        <div className="mt-10 rounded-[22px] bg-frost p-6 md:p-7">
          <p className="text-[1.75rem] font-semibold leading-none tracking-[-0.025em] [font-variant-numeric:tabular-nums]">{priceText(product)}</p>
          <p className="t-small mt-3 text-pewter">
            {purchasable
              ? "Pagamento pelo Mercado Pago: Pix, cartão ou boleto. Frete calculado ao finalizar."
              : "Um consultor envia o orçamento e tira suas dúvidas pelo WhatsApp."}
          </p>
          {purchasable ? (
            <button
              type="button"
              onClick={() => {
                addToCart(product.slug);
                setAdded(true);
              }}
              className="btn-action mt-6 min-h-12 w-full text-base"
            >
              {added ? <><Check size={18} aria-hidden="true" /> Adicionado à sacola</> : "Adicionar à sacola"}
            </button>
          ) : (
            <a href={consultUrl(product.name)} target="_blank" rel="noopener noreferrer" className="btn-action mt-6 min-h-12 w-full text-base">
              Pedir orçamento
            </a>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {purchasable && (
              <a href={consultUrl(product.name)} target="_blank" rel="noopener noreferrer" className="link-arrow text-[0.9375rem] text-link">
                Falar com um consultor
                <ChevronRight size={16} aria-hidden="true" />
              </a>
            )}
            {cartCount > 0 && (
              <a href="/carrinho" className="link-arrow text-[0.9375rem] text-link">
                Ver sacola ({cartCount})
                <ChevronRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {product.brand === "bionlife" && (
          <a href={bionlifeUrl()} className="link-arrow mt-8 text-link">
            Conhecer a linha BionLife
            <ChevronRight size={18} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}

function IonCenterProductPage({ initialSlug, products }: { initialSlug: string; products: Product[] }) {
  const [slug, setSlug] = useState(initialSlug);
  const model = findIonCenterModel(slug)!;

  useEffect(() => {
    document.title = `${model.name} | Loja Water Diamond`;
  }, [model.name]);

  return (
    <>
      <IonCenterBuy
        products={products}
        slug={slug}
        onSlugChange={(next) => {
          setSlug(next);
          window.history.replaceState(null, "", `/loja/${next}`);
        }}
        onConsult={(label) => window.open(consultUrl(label), "_blank", "noopener")}
      />

      <section className="mt-24 grid gap-12 border-t border-hairline pt-14 md:mt-32 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <h2 className="t-headline-lg">Ficha técnica.</h2>
          <p className="t-body mt-4 text-pewter">{model.indicated}</p>
          <ul className="mt-8 space-y-3">
            {model.highlights.map((h) => (
              <li key={h} className="t-small flex items-start gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-action" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <a href="/#etapas" className="link-arrow mt-10 text-link">
            Como funciona o tratamento
            <ChevronRight size={18} aria-hidden="true" />
          </a>
        </div>
        <dl className="border-t border-hairline">
          {model.specs.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[1fr_1.3fr] gap-4 border-b border-hairline py-3.5">
              <dt className="t-small text-pewter">{label}</dt>
              <dd className="t-small font-medium [font-variant-numeric:tabular-nums]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}

export default function LojaPage() {
  const products = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slug = window.location.pathname.replace(/\/$/, "").split("/")[2];
  const current = slug ? products?.find((p) => p.slug === slug) : undefined;
  const ionModel = slug ? findIonCenterModel(slug) : undefined;

  useEffect(() => {
    if (!slug) document.title = "Loja | Water Diamond e BionLife";
    else if (current && !ionModel) document.title = `${current.name} | Loja Water Diamond`;
  }, [slug, current, ionModel]);

  return (
    <div className="wd min-h-screen bg-white text-obsidian selection:bg-action/15">
      <SiteHeader onMenuOpen={() => setIsMenuOpen(true)} cta={null} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="pb-24 pt-28 md:pb-32 md:pt-32">
        {slug ? (
          <div className={shell}>
            <Breadcrumb name={ionModel?.name ?? current?.name ?? "Produto"} />
            <div className="mt-8">
              {!products ? (
                <div className="grid gap-10 lg:grid-cols-2">
                  <div className="aspect-square animate-pulse rounded-[28px] bg-frost" />
                  <div className="space-y-4">
                    <div className="h-10 w-2/3 animate-pulse rounded-lg bg-frost" />
                    <div className="h-5 w-1/2 animate-pulse rounded-lg bg-frost" />
                  </div>
                </div>
              ) : ionModel ? (
                <IonCenterProductPage initialSlug={ionModel.slug} products={products} />
              ) : current ? (
                <SimpleProduct product={current} />
              ) : (
                <div className="py-16">
                  <h1 className="t-display">Produto não encontrado.</h1>
                  <a href="/loja" className="link-arrow mt-6 text-link">Ver todos os produtos <ChevronRight size={18} /></a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={shell}>
            <h1 className="t-display max-w-[18ch]">
              Loja. <span className="text-pewter">Água tratada em casa e um descanso melhor.</span>
            </h1>
            <a href={consultUrl("produto da loja")} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6 text-link">
              Precisa de ajuda para escolher? Fale com um consultor
              <ChevronRight size={18} aria-hidden="true" />
            </a>

            {BRANDS.map((brand) => {
              const list = products?.filter((p) => p.brand === brand.id) ?? [];
              const href = brand.id === "bionlife" ? bionlifeUrl() : brand.link.href;
              return (
                <section key={brand.id} className="mt-20 md:mt-28" aria-labelledby={`marca-${brand.id}`}>
                  <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                    <h2 id={`marca-${brand.id}`} className="t-headline-lg">
                      {brand.title} <span className="text-pewter">{brand.aside}</span>
                    </h2>
                    <a href={href} className="link-arrow text-link">
                      {brand.link.label}
                      <ChevronRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                  <div className={`mt-8 grid gap-4 sm:grid-cols-2 md:gap-5 ${list.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                    {!products
                      ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/6] animate-pulse rounded-[28px] bg-frost" />)
                      : list.map((p) => <ProductCard key={p.slug} product={p} />)}
                  </div>
                </section>
              );
            })}

            <div className="mt-24 md:mt-32">
              <TrustStrip />
            </div>
          </div>
        )}
      </main>

      <FloatingWhatsAppButton />
      <SiteFooter />
    </div>
  );
}
