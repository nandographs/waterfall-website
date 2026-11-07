import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type React from "react";
import { clearCart, setQty, useCart } from "@/lib/cart";
import { fetchProducts, formatBRL, productImage, type Product } from "@/lib/catalog";
import { FUNCTIONS_URL, getAffiliateRef } from "@/lib/affiliate";


const inputCls = "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";

function Field({ label, name, ...rest }: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-neutral-600">{label}</span>
      <input name={name} required className={inputCls} {...rest} />
    </label>
  );
}

export default function CarrinhoPage() {
  const cart = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [coupon, setCoupon] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Carrinho | Loja Water Diamond";
    fetchProducts().then(setProducts);
  }, []);

  const lines = cart
    .map((l) => ({ ...l, product: products.find((p) => p.slug === l.slug) }))
    .filter((l): l is typeof l & { product: Product & { priceCents: number } } => l.product?.priceCents != null);
  const subtotal = lines.reduce((s, l) => s + l.product.priceCents * l.qty, 0);

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
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <a href="/loja" className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft size={16} /> Continuar comprando
      </a>
      <h1 className="mb-8 text-3xl font-semibold">Carrinho</h1>

      {lines.length === 0 ? (
        <p className="text-neutral-500">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid gap-10 md:grid-cols-[1fr_380px]">
          <form id="checkout" onSubmit={submit} className="flex flex-col gap-4">
            <h2 className="text-sm uppercase tracking-widest text-neutral-500">Seus dados</h2>
            <Field label="Nome completo" name="name" autoComplete="name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail" name="email" type="email" autoComplete="email" />
              <Field label="WhatsApp" name="phone" type="tel" autoComplete="tel" />
            </div>
            <Field label="CPF" name="cpf" inputMode="numeric" pattern="\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2}" title="CPF com 11 dígitos" />
            <h2 className="mt-4 text-sm uppercase tracking-widest text-neutral-500">Entrega</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="CEP" name="cep" inputMode="numeric" autoComplete="postal-code" />
              <div className="sm:col-span-2"><Field label="Rua" name="street" autoComplete="address-line1" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Número" name="number" />
              <div className="sm:col-span-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-neutral-600">Complemento</span>
                  <input name="complement" className={inputCls} />
                </label>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Bairro" name="district" />
              <Field label="Cidade" name="city" />
              <Field label="UF" name="state" maxLength={2} />
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-neutral-200 p-5">
            <ul className="flex flex-col gap-4">
              {lines.map((l) => {
                const img = productImage(l.product);
                return (
                  <li key={l.slug} className="flex gap-3">
                    {img && <img src={img.src} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{l.product.name}</p>
                      <p className="text-neutral-500">{formatBRL(l.product.priceCents)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button type="button" aria-label="Diminuir" onClick={() => setQty(l.slug, l.qty - 1)} className="rounded border p-1">
                          {l.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" aria-label="Aumentar" onClick={() => setQty(l.slug, l.qty + 1)} className="rounded border p-1"><Plus size={12} /></button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <label className="mt-5 flex flex-col gap-1 text-sm">
              <span className="text-neutral-600">Cupom</span>
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} className={inputCls} />
            </label>
            <div className="mt-5 flex justify-between border-t pt-4 text-sm">
              <span>Subtotal</span><span className="font-semibold">{formatBRL(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">Frete e desconto são calculados ao finalizar.</p>
            {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              form="checkout"
              disabled={busy}
              className="mt-4 w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {busy ? "Aguarde…" : "Ir para o pagamento"}
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

/** Página de retorno do Mercado Pago: /pedido?status=approved|pending|failure */
export function PedidoPage() {
  const status = new URLSearchParams(window.location.search).get("status");
  useEffect(() => {
    if (status === "approved" || status === "pending") clearCart();
    document.title = "Pedido | Loja Water Diamond";
  }, [status]);
  const msg =
    status === "approved" ? ["Pagamento aprovado", "Recebemos seu pedido. A confirmação segue para o seu e-mail."]
    : status === "pending" ? ["Pagamento em análise", "Assim que o Pix ou boleto for confirmado, o pedido é liberado."]
    : ["Pagamento não concluído", "Nada foi cobrado. Seus itens continuam no carrinho."];
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="mb-3 text-3xl font-semibold">{msg[0]}</h1>
      <p className="mb-8 text-neutral-600">{msg[1]}</p>
      <a href={status === "failure" ? "/carrinho" : "/loja"} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white">
        {status === "failure" ? "Voltar ao carrinho" : "Voltar à loja"}
      </a>
    </main>
  );
}
