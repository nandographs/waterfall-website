// Cria o pedido (preços lidos do banco, nunca do navegador) e a cobrança no Asaas.
// O cliente paga na fatura hospedada do Asaas e escolhe ali Pix, cartão ou boleto.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ASAAS_KEY = Deno.env.get("ASAAS_API_KEY")!;
// Produção: https://api.asaas.com/v3 · Sandbox: https://api-sandbox.asaas.com/v3
const ASAAS_URL = (Deno.env.get("ASAAS_API_URL") ?? "https://api.asaas.com/v3").replace(/\/$/, "");
const SITE_URL = Deno.env.get("SITE_URL")!;
// Frete fixo em centavos até existir regra por região/produto. 0 = frete grátis.
const SHIPPING_CENTS = Number(Deno.env.get("SHIPPING_CENTS") ?? 0);

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const asaas = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(`${ASAAS_URL}${path}`, {
    ...init,
    headers: { access_token: ASAAS_KEY, "Content-Type": "application/json", "User-Agent": "waterdiamond-loja", ...init.headers },
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
};

// Reaproveita o cliente pelo CPF para não duplicar cadastro no Asaas a cada compra.
async function asaasCustomer(c: { name: string; email: string; phone: string; cpf: string }) {
  const found = await asaas(`/customers?cpfCnpj=${c.cpf}&limit=1`);
  const existing = found.ok ? found.data?.data?.[0] : null;
  const payload = { name: c.name, email: c.email, cpfCnpj: c.cpf, ...(c.phone ? { mobilePhone: c.phone.replace(/\D/g, "") } : {}) };
  const res = existing
    ? await asaas(`/customers/${existing.id}`, { method: "PUT", body: JSON.stringify(payload) })
    : await asaas("/customers", { method: "POST", body: JSON.stringify(payload) });
  if (!res.ok || !res.data?.id) {
    console.error("Asaas recusou o cliente", res.status, JSON.stringify(res.data));
    return null;
  }
  return res.data.id as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
  // Loja em manutenção até o secret STORE_OPEN ser "true".
  if (Deno.env.get("STORE_OPEN") !== "true") return json({ error: "Loja em manutenção. Fale com um consultor pelo WhatsApp." }, 503);

  try {
    const body = await req.json();
    const customer = {
      name: str(body.customer?.name), email: str(body.customer?.email).toLowerCase(),
      phone: str(body.customer?.phone, 30), cpf: str(body.customer?.cpf, 14).replace(/\D/g, ""),
    };
    if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || customer.cpf.length !== 11)
      return json({ error: "Confira nome, e-mail e CPF." }, 400);

    const items: { slug: string; qty: number; variant?: string }[] = Array.isArray(body.items) ? body.items : [];
    if (!items.length || items.length > 20) return json({ error: "Carrinho vazio." }, 400);

    const { data: products } = await db
      .from("products")
      .select("id, slug, name, price_cents, stock, commission_pct")
      .in("slug", items.map((i) => str(i.slug)))
      .eq("active", true)
      .not("price_cents", "is", null);

    const lines = items.map((i) => {
      const p = products?.find((x) => x.slug === i.slug);
      const qty = Number(i.qty);
      if (!p || !Number.isInteger(qty) || qty < 1 || qty > 10) throw new Error(`Produto indisponível: ${str(i.slug, 60)}`);
      if (p.stock !== null && p.stock < qty) throw new Error(`Sem estoque: ${p.name}`);
      // Acabamento escolhido na loja (ex.: "Preto"). Só texto curto; não altera preço.
      const variant = str(i.variant, 30).replace(/[^\p{L}\p{N} -]/gu, "");
      return { p, qty, variant };
    });
    const subtotal = lines.reduce((s, l) => s + l.p.price_cents * l.qty, 0);

    // Afiliado: cupom tem prioridade; senão o ?ref= do navegador. Auto-indicação é ignorada.
    let affiliate: { id: string; email: string; commission_pct: number } | null = null;
    let couponId: string | null = null;
    let discountPct = 0;

    const couponCode = str(body.coupon, 40).toLowerCase();
    if (couponCode) {
      const { data: c } = await db.from("coupons").select("id, affiliate_id, discount_pct").ilike("code", couponCode).eq("active", true).maybeSingle();
      if (!c) return json({ error: "Cupom inválido." }, 400);
      couponId = c.id;
      discountPct = Number(c.discount_pct);
      if (c.affiliate_id) {
        const { data } = await db.from("affiliates").select("id, email, commission_pct").eq("id", c.affiliate_id).eq("status", "active").maybeSingle();
        affiliate = data;
      }
    }
    const ref = str(body.affiliateRef, 30).toLowerCase();
    if (!affiliate && ref) {
      const { data } = await db.from("affiliates").select("id, email, commission_pct").eq("code", ref).eq("status", "active").maybeSingle();
      affiliate = data;
    }
    if (affiliate && affiliate.email.toLowerCase() === customer.email) affiliate = null;

    const discount = Math.round((subtotal * discountPct) / 100);
    const total = subtotal - discount + SHIPPING_CENTS;

    const { data: order, error } = await db.from("orders").insert({
      customer_name: customer.name, customer_email: customer.email, customer_phone: customer.phone, customer_cpf: customer.cpf,
      shipping: Object.fromEntries(Object.entries(body.shipping ?? {}).map(([k, v]) => [k, str(v, 120)])),
      subtotal_cents: subtotal, discount_cents: discount, shipping_cents: SHIPPING_CENTS, total_cents: total,
      affiliate_id: affiliate?.id ?? null, coupon_id: couponId,
    }).select("id, number").single();
    if (error || !order) throw new Error("Falha ao criar o pedido.");

    await db.from("order_items").insert(lines.map((l) => ({
      order_id: order.id, product_id: l.p.id, name: l.variant ? `${l.p.name} · ${l.variant}` : l.p.name, unit_cents: l.p.price_cents, quantity: l.qty,
    })));

    // Uma cobrança só, com o total final (já com desconto e frete), evita divergência de centavos.
    // billingType UNDEFINED deixa o cliente escolher Pix, cartão ou boleto na fatura.
    const customerId = await asaasCustomer(customer);
    const due = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
    const pay = customerId
      ? await asaas("/payments", {
        method: "POST",
        body: JSON.stringify({
          customer: customerId,
          billingType: "UNDEFINED",
          value: total / 100,
          dueDate: due,
          description: `Pedido #${order.number} Water Diamond`,
          externalReference: order.id,
          // O Asaas só aceita successUrl no domínio cadastrado na conta; em localhost o cliente volta pelo botão.
          ...(SITE_URL.startsWith("https://")
            ? { callback: { successUrl: `${SITE_URL}/pedido?status=approved`, autoRedirect: true } }
            : {}),
        }),
      })
      : null;
    if (!pay?.ok || !pay.data?.invoiceUrl) {
      if (pay) console.error("Asaas recusou a cobrança", pay.status, JSON.stringify(pay.data));
      await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      throw new Error("Não foi possível iniciar o pagamento.");
    }
    await db.from("orders").update({ payment_id: pay.data.id }).eq("id", order.id);
    return json({ url: pay.data.invoiceUrl, orderNumber: order.number });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erro inesperado." }, 400);
  }
});
