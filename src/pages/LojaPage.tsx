import { ArrowLeft, MessageCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/forms";
import { addToCart } from "@/lib/cart";
import { fetchProducts, formatBRL, productImage, type Product } from "@/lib/catalog";

const BRAND_LABEL: Record<Product["brand"], string> = {
  waterdiamond: "Water Diamond Ion Center",
  bionlife: "BionLife",
};

function Price({ product }: { product: Product }) {
  return product.priceCents === null ? (
    <span className="text-sm text-neutral-500">Valor sob consulta</span>
  ) : (
    <span className="text-lg font-semibold">{formatBRL(product.priceCents)}</span>
  );
}

function consultantUrl(product: Product) {
  return whatsappLink(`Olá! Vim pela loja e quero saber mais sobre o ${product.name}.`);
}

function ProductCard({ product }: { product: Product; key?: React.Key }) {
  const img = productImage(product);
  return (
    <a
      href={`/loja/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
        {img && (
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500">{BRAND_LABEL[product.brand]}</p>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.headline && <p className="text-sm text-neutral-600">{product.headline}</p>}
        <div className="mt-auto pt-4">
          <Price product={product} />
        </div>
      </div>
    </a>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const img = productImage(product);
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="overflow-hidden rounded-2xl bg-neutral-100">
        {img && <img src={img.src} srcSet={img.srcSet} sizes="(min-width: 768px) 50vw, 100vw" alt={product.name} className="w-full object-cover" />}
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-widest text-neutral-500">{BRAND_LABEL[product.brand]}</p>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        {product.headline && <p className="text-neutral-600">{product.headline}</p>}
        <Price product={product} />
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          {product.priceCents !== null && (
            <button
              type="button"
              onClick={() => {
                addToCart(product.slug);
                window.location.href = "/carrinho";
              }}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Comprar
            </button>
          )}
          <a
            href={consultantUrl(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700"
          >
            <MessageCircle size={16} /> Falar com um consultor
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LojaPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const slug = window.location.pathname.replace(/\/$/, "").split("/")[2];
  const current = slug ? products?.find((p) => p.slug === slug) : undefined;

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  useEffect(() => {
    document.title = current ? `${current.name} | Loja Water Diamond` : "Loja | Water Diamond e BionLife";
  }, [current]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <a href={slug ? "/loja" : "/"} className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={16} /> {slug ? "Voltar à loja" : "Voltar ao site"}
      </a>

      {!products ? (
        <p className="text-neutral-500">Carregando…</p>
      ) : slug ? (
        current ? <ProductDetail product={current} /> : <p>Produto não encontrado.</p>
      ) : (
        <>
          <h1 className="mb-8 text-3xl font-semibold">Loja</h1>
          {(["waterdiamond", "bionlife"] as const).map((brand) => (
            <section key={brand} className="mb-12">
              <h2 className="mb-4 text-sm uppercase tracking-widest text-neutral-500">{BRAND_LABEL[brand]}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {products.filter((p) => p.brand === brand).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}
