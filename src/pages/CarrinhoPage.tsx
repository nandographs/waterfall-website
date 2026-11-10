import { CheckCircle2, ChevronRight, Clock, Lock, Minus, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { clearCart, lineKey, setQty, useCart } from "@/lib/cart";
import { formatBRL, isPurchasable, productImage, useProducts, type Product } from "@/lib/catalog";
import { FUNCTIONS_URL, getAffiliateRef } from "@/lib/affiliate";
import { WHATSAPP_DIRECT_URL } from "@/lib/forms";
import { findIonCenterModel, galleryFor, type Finish } from "@/lib/ion-center";
import { FloatingWhatsAppButton, SidebarMenu, SiteFooter, SiteHeader } from "@/components/site-shell";

const shell = "mx-auto w-full max-w-[1200px] px-5 md:px-12";

/** Miniatura da linha: usa o recorte do acabamento escolhido quando existe; senão a foto do catálogo. */
function lineThumb(product: Product, variant?: string) {
  const model = findIonCenterModel(product.slug);
  const shot = model && variant && model.finishes.includes(variant as Finish) ? galleryFor(model, variant as Finish)[0] : null;
  if (shot) return { src: `/images/${shot.base}-sm.webp`, fit: shot.fit };
  const img = productImage(product);
  return img ? { src: img.src, fit: "cover" as const } : null;
}

function Field({
  label,
  name,
  optional = false,
  className = "",
  ...rest
}: { label: string; name: string; optional?: boolean; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[0.8125rem] font-medium text-pewter">
        {label}
        {optional && <span className="font-normal"> (opcional)</span>}
      </span>
      <input name={name} required={!optional} className="wd-input" {...rest} />
    </label>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="wd min-h-screen bg-white text-obsidian selection:bg-action/15">
      <SiteHeader onMenuOpen={() => setIsMenuOpen(true)} cta={null} />
      <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <main className="pb-24 pt-28 md:pb-32 md:pt-32">{children}</main>
      <FloatingWhatsAppButton />
      <SiteFooter />
    </div>
  );
}

export default function CarrinhoPage() {
  const cart = useCart();
  const products = useProducts();
  const [coupon, setCoupon] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Sacola | Loja Water Diamond";
  }, []);

  const lines = cart
    .map((l) => ({ ...l, product: products?.find((p) => p.slug === l.slug) }))
    .filter((l): l is typeof l & { product: Product & { priceCents: number } } => isPurchasable(l.product));
  const subtotal = lines.reduce((s, l) => s + l.product.priceCents * l.qty, 0);
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FUNCTIONS_URL) return setError("Checkout indisponível: Supabase não configurado.");
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${FUNCTIONS_URL}/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
        body: JSON.stringify({
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty, ...(l.variant ? { variant: l.variant } : {}) })),
          coupon: coupon.trim() || undefined,
          affiliateRef: getAffiliateRef() ?? undefined,
          customer: { name: f.get("name"), email: f.get("email"), phone: f.get("phone"), cpf: f.get("cpf") },
          shipping: {
            cep: f.get("cep"), street: f.get("street"), number: f.get("number"),
            complement: f.get("complement"), district: f.get("district"), city: f.get("city"), state: f.get("state"),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Não foi possível iniciar o pagamento.");
      window.location.href = data.url; // checkout hospedado do Mercado Pago
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setBusy(false);
    }
  }

  if (!products) {
    return (
      <Shell>
        <div className={shell}>
          <div className="h-14 w-64 animate-pulse rounded-xl bg-frost" />
          <div className="mt-12 h-32 animate-pulse rounded-[22px] bg-frost" />
        </div>
      </Shell>
    );
  }

  if (lines.length === 0) {
    return (
      <Shell>
        <div className={`${shell} py-10 text-center md:py-20`}>
          <h1 className="t-display">Sua sacola está vazia.</h1>
          <p className="t-body mx-auto mt-5 max-w-md text-pewter">
            Escolha o seu Ion Center e acompanhe tudo por aqui até o pagamento.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <a href="/loja" className="btn-action">Ver a loja</a>
            <a href="/#comprar" className="link-arrow text-link">
              Configurar o Ion Center
              <ChevronRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className={shell}>
        <h1 className="t-display">
          Sua sacola. <span className="text-pewter [font-variant-numeric:tabular-nums]">{formatBRL(subtotal)}</span>
        </h1>
        <p className="t-body mt-4 text-pewter">
          {itemCount} {itemCount === 1 ? "item" : "itens"} · frete e desconto calculados no pagamento.
        </p>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div>
            {/* Itens */}
            <ul className="border-t border-hairline">
              {lines.map((l) => {
                const img = lineThumb(l.product, l.variant);
                return (
                  <li key={lineKey(l)} className="flex gap-5 border-b border-hairline py-7 md:gap-8">
                    <a href={`/loja/${l.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-frost md:h-32 md:w-32">
                      {img && <img src={img.src} alt="" className={img.fit === "contain" ? "h-full w-full object-contain p-2" : "h-full w-full object-cover"} />}
                    </a>
                    <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:justify-between">
                      <div>
                        <a href={`/loja/${l.slug}`} className="t-headline font-semibold hover:underline hover:underline-offset-4">{l.product.name}</a>
                        {l.variant && <p className="t-small mt-1 text-pewter">Acabamento: {l.variant}</p>}
                        <p className="t-small mt-1 text-pewter [font-variant-numeric:tabular-nums]">{formatBRL(l.product.priceCents)} cada</p>
                      </div>
                      <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                        <div className="flex items-center rounded-full ring-1 ring-hairline">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${l.product.name}`}
                            onClick={() => setQty(l.slug, l.qty - 1, l.variant)}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-obsidian hover:bg-frost"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="w-7 text-center text-[0.9375rem] font-medium [font-variant-numeric:tabular-nums]" aria-live="polite">{l.qty}</span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${l.product.name}`}
                            onClick={() => setQty(l.slug, l.qty + 1, l.variant)}
                            disabled={l.qty >= 10}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-obsidian hover:bg-frost disabled:opacity-40"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="t-title [font-variant-numeric:tabular-nums]">{formatBRL(l.product.priceCents * l.qty)}</p>
                          <button
                            type="button"
                            onClick={() => setQty(l.slug, 0, l.variant)}
                            className="t-small mt-1 cursor-pointer text-link hover:underline"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Dados para o pedido */}
            <form id="checkout" onSubmit={submit} className="mt-16">
              <h2 className="t-headline-lg">Seus dados.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Nome completo" name="name" autoComplete="name" className="sm:col-span-2" />
                <Field label="E-mail" name="email" type="email" autoComplete="email" />
                <Field label="WhatsApp" name="phone" type="tel" autoComplete="tel" />
                <Field
                  label="CPF"
                  name="cpf"
                  inputMode="numeric"
                  pattern="\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2}"
                  title="CPF com 11 dígitos"
                  className="sm:col-span-2"
                />
              </div>

              <h2 className="t-headline-lg mt-14">Entrega.</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-6">
                <Field label="CEP" name="cep" inputMode="numeric" autoComplete="postal-code" className="sm:col-span-2" />
                <Field label="Rua" name="street" autoComplete="address-line1" className="sm:col-span-4" />
                <Field label="Número" name="number" className="sm:col-span-2" />
                <Field label="Complemento" name="complement" optional autoComplete="address-line2" className="sm:col-span-4" />
                <Field label="Bairro" name="district" className="sm:col-span-2" />
                <Field label="Cidade" name="city" autoComplete="address-level2" className="sm:col-span-3" />
                <Field label="UF" name="state" maxLength={2} autoComplete="address-level1" className="sm:col-span-1" />
              </div>
            </form>
          </div>

          {/* Resumo */}
          <aside className="h-fit rounded-[28px] bg-frost p-7 lg:sticky lg:top-24">
            <h2 className="t-headline">Resumo</h2>
            <dl className="mt-6 space-y-3 text-[0.9375rem] [font-variant-numeric:tabular-nums]">
              <div className="flex justify-between">
                <dt className="text-pewter">Subtotal</dt>
                <dd>{formatBRL(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pewter">Frete</dt>
                <dd className="text-pewter">Calculado no pagamento</dd>
              </div>
            </dl>

            <label className="mt-6 flex flex-col gap-1.5">
              <span className="text-[0.8125rem] font-medium text-pewter">Cupom de desconto</span>
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} autoComplete="off" className="wd-input" placeholder="Se você tiver um" />
            </label>

            <div className="mt-6 flex items-baseline justify-between border-t border-hairline pt-5">
              <span className="t-title">Total estimado</span>
              <span className="text-[1.5rem] font-semibold tracking-[-0.02em] [font-variant-numeric:tabular-nums]">{formatBRL(subtotal)}</span>
            </div>

            {error && <p role="alert" className="t-small mt-4 font-medium text-red-600">{error}</p>}

            <button type="submit" form="checkout" disabled={busy} className="btn-action mt-6 min-h-12 w-full text-base">
              {busy ? "Aguarde…" : "Ir para o pagamento"}
            </button>
            <p className="t-caption mt-4 flex items-start gap-2 text-pewter">
              <Lock size={14} className="mt-px shrink-0" aria-hidden="true" />
              Você conclui o pagamento no ambiente do Mercado Pago, com Pix, cartão ou boleto.
            </p>
            <a href={WHATSAPP_DIRECT_URL} target="_blank" rel="noopener noreferrer" className="link-arrow mt-6 text-[0.9375rem] text-link">
              Dúvidas? Fale com um consultor
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

/** Página de retorno do Mercado Pago: /pedido?status=approved|pending|failure */
export function PedidoPage() {
  const status = new URLSearchParams(window.location.search).get("status");
  useEffect(() => {
    if (status === "approved" || status === "pending") clearCart();
    document.title = "Pedido | Loja Water Diamond";
  }, [status]);

  const view =
    status === "approved"
      ? { icon: CheckCircle2, color: "text-action", title: "Pagamento aprovado.", text: "Recebemos seu pedido. A confirmação segue para o seu e-mail." }
      : status === "pending"
        ? { icon: Clock, color: "text-signal-ink", title: "Pagamento em análise.", text: "Assim que o Pix ou boleto for confirmado, o pedido é liberado." }
        : { icon: XCircle, color: "text-pewter", title: "Pagamento não concluído.", text: "Nada foi cobrado. Seus itens continuam na sacola." };
  const Icon = view.icon;

  return (
    <Shell>
      <div className={`${shell} max-w-2xl py-10 text-center md:py-20`}>
        <Icon size={48} strokeWidth={1.4} className={`mx-auto ${view.color}`} aria-hidden="true" />
        <h1 className="t-display mt-6">{view.title}</h1>
        <p className="t-body mx-auto mt-5 max-w-md text-pewter">{view.text}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a href={status === "failure" ? "/carrinho" : "/loja"} className="btn-action">
            {status === "failure" ? "Voltar à sacola" : "Voltar à loja"}
          </a>
          <a href={WHATSAPP_DIRECT_URL} target="_blank" rel="noopener noreferrer" className="link-arrow text-link">
            Falar com um consultor
            <ChevronRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Shell>
  );
}
