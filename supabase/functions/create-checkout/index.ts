// Cria o pedido (preços lidos do banco, nunca do navegador) e a preferência de pagamento no Mercado Pago.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/cors.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
const SITE_URL = Deno.env.get("SITE_URL")!;
// Frete fixo em centavos até existir regra por região/produto. 0 = frete grátis.
const SHIPPING_CENTS = Number(Deno.env.get("SHIPPING_CENTS") ?? 0);

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);

  try {
    const body = await req.json();
    const customer = {
      name: str(body.customer?.name), email: str(body.customer?.email).toLowerCase(),
      phone: str(body.customer?.phone, 30), cpf: str(body.customer?.cpf, 14).replace(/\D/g, ""),
    };
    if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || customer.cpf.length !== 11)
      return json({ error: "Confira nome, e-mail e CPF." }, 400);

    const items: { slug: string; qty: number }[] = Array.isArray(body.items) ? body.items : [];
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
      return { p, qty };
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
      order_id: order.id, product_id: l.p.id, name: l.p.name, unit_cents: l.p.price_cents, quantity: l.qty,
    })));

    // Uma linha só, com o total final (já com desconto e frete), evita divergência de centavos.
    const mp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { Authorization: `Bearer ${MP_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ title: `Pedido #${order.number} Water Diamond`, quantity: 1, currency_id: "BRL", unit_price: total / 100 }],
        payer: { name: customer.name, email: customer.email },
        external_reference: order.id,
        notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mp-webhook`,
        back_urls: { success: `${SITE_URL}/pedido?status=approved`, pending: `${SITE_URL}/pedido?status=pending`, failure: `${SITE_URL}/pedido?status=failure` },
        auto_return: "approved",
      }),
    });
    const pref = await mp.json();
    if (!mp.ok || !pref.init_point) {
      await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      throw new Error("Não foi possível iniciar o pagamento.");
    }
    return json({ url: pref.init_point, orderNumber: order.number });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erro inesperado." }, 400);
  }
});
