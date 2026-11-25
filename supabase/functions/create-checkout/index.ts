// Cria o pedido (preços lidos do banco, nunca do navegador) e a cobrança no Asaas.
// O cliente paga na fatura hospedada do Asaas e escolhe ali Pix, cartão ou boleto.
// Toda entrada do navegador é validada de novo aqui: a validação do formulário é só conforto.
import { createClient } from "npm:@supabase/supabase-js@2";
import { isAllowedOrigin, json, preflight } from "../_shared/cors.ts";
import { UserError, clientKey, rateLimit, readJson, str } from "../_shared/security.ts";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ASAAS_KEY = Deno.env.get("ASAAS_API_KEY")!;
// Produção: https://api.asaas.com/v3 · Sandbox: https://api-sandbox.asaas.com/v3
const ASAAS_URL = (Deno.env.get("ASAAS_API_URL") ?? "https://api.asaas.com/v3").replace(/\/$/, "");
const SITE_URL = Deno.env.get("SITE_URL")!;
// Frete fixo em centavos até existir regra por região/produto. 0 = frete grátis.
const SHIPPING_CENTS = Number(Deno.env.get("SHIPPING_CENTS") ?? 0);

// Acréscimo da torneira nos Ion Center (Tabela de Preços 2026). Espelha FAUCET_SURCHARGE_CENTS em src/lib/ion-center.ts.
// O price_cents do banco é o do modelo com a torneira básica.
const FAUCET_SURCHARGE_CENTS: Record<string, number> = { "Básico": 0, Faucet: 50000, Gourmet: 100000 };
const FINISHES = new Set(["Branco", "Preto"]);
const UFS = new Set("AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" "));

const SLUG = /^[a-z0-9-]{1,60}$/;
const CODE = /^[a-z0-9_-]{3,40}$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const NAME = /^[\p{L}\p{M}' .-]+$/u;

function validCpf(cpf: string) {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const len of [9, 10]) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    if (((sum * 10) % 11) % 10 !== Number(cpf[len])) return false;
  }
  return true;
}

/**
 * Configuração do Ion Center escolhida na loja: "Acabamento - Torneira" (ex.: "Preto - Gourmet"), ou só o
 * acabamento em sacolas antigas. Qualquer outro texto é recusado: assim ninguém leva uma torneira
 * mais cara pagando o preço da básica só trocando o texto.
 */
function readVariant(slug: string, raw: unknown) {
  const variant = str(raw, 30);
  if (!variant) return { label: "", surcharge: 0 };
  const [finish, faucet, ...rest] = variant.split(" - ");
  const ok =
    slug.startsWith("ion-center-") &&
    !rest.length &&
    FINISHES.has(finish) &&
    (faucet === undefined || Object.hasOwn(FAUCET_SURCHARGE_CENTS, faucet));
  if (!ok) throw new UserError("Confira a configuração dos itens da sacola.");
  return { label: variant, surcharge: faucet === undefined ? 0 : FAUCET_SURCHARGE_CENTS[faucet] };
}

/** Escapa % e _ para o ilike comparar o texto exato (sem curinga). */
const exact = (s: string) => s.replace(/[\\%_]/g, "\\$&");

const asaas = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(`${ASAAS_URL}${path}`, {
    ...init,
    headers: { access_token: ASAAS_KEY, "Content-Type": "application/json", "User-Agent": "waterdiamond-loja", ...init.headers },
  });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
};

// Reaproveita o cliente pelo CPF para não duplicar cadastro no Asaas a cada compra.
async function asaasCustomer(c: { name: string; email: string; phone: string; cpf: string }) {
  const found = await asaas(`/customers?cpfCnpj=${encodeURIComponent(c.cpf)}&limit=1`);
  const existing = found.ok ? found.data?.data?.[0] : null;
  const payload = { name: c.name, email: c.email, cpfCnpj: c.cpf, mobilePhone: c.phone };
  const res = existing
    ? await asaas(`/customers/${encodeURIComponent(existing.id)}`, { method: "PUT", body: JSON.stringify(payload) })
    : await asaas("/customers", { method: "POST", body: JSON.stringify(payload) });
  if (!res.ok || !res.data?.id) {
    // Só o código e a lista de erros: o corpo pode trazer dados pessoais do cliente.
    console.error("Asaas recusou o cliente", res.status, JSON.stringify(res.data?.errors ?? null));
    return null;
  }
  return res.data.id as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return preflight(req);
  if (req.method !== "POST") return json(req, { error: "Método não permitido" }, 405);
  // Só o próprio site chama esta função. O navegador sempre manda Origin num POST com JSON.
  if (!isAllowedOrigin(req.headers.get("origin"))) return json(req, { error: "Origem não permitida." }, 403);
  // Loja em manutenção até o secret STORE_OPEN ser "true".
  if (Deno.env.get("STORE_OPEN") !== "true") return json(req, { error: "Loja em manutenção. Fale com um consultor pelo WhatsApp." }, 503);

  // Limites: 10 tentativas por visitante a cada 10 min e um teto geral contra ataque distribuído.
  const visitor = await clientKey(req);
  if (!(await rateLimit(db, `checkout:${visitor}`, 600, 10)) || !(await rateLimit(db, "checkout:all", 600, 300))) {
    return json(req, { error: "Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo." }, 429);
  }

  try {
    const body = await readJson(req, 16_384);

    // ---------- Cliente ----------
    const c = body.customer ?? {};
    const customer = {
      name: str(c.name, 120).replace(/\s+/g, " "),
      email: str(c.email, 254).toLowerCase(),
      phone: str(c.phone, 30).replace(/\D/g, ""),
      cpf: str(c.cpf, 14).replace(/\D/g, ""),
    };
    if (customer.name.length < 3 || !NAME.test(customer.name)) throw new UserError("Confira o nome completo.");
    if (!EMAIL.test(customer.email)) throw new UserError("Confira o e-mail.");
    // Celular com DDD (10 ou 11 dígitos). O +55 digitado é removido, porque o Asaas não aceita o código do país.
    if (customer.phone.length > 11 && customer.phone.startsWith("55")) customer.phone = customer.phone.slice(2);
    if (customer.phone.length < 10 || customer.phone.length > 11) throw new UserError("Confira o WhatsApp com DDD.");
    if (!validCpf(customer.cpf)) throw new UserError("Confira o CPF.");

    // ---------- Entrega (só os campos esperados, nada além) ----------
    const s = body.shipping ?? {};
    const shipping = {
      cep: str(s.cep, 9).replace(/\D/g, ""),
      street: str(s.street, 120),
      number: str(s.number, 20),
      complement: str(s.complement, 80),
      district: str(s.district, 80),
      city: str(s.city, 80),
      state: str(s.state, 2).toUpperCase(),
    };
    if (shipping.cep.length !== 8 || !shipping.street || !shipping.number || !shipping.district || !shipping.city || !UFS.has(shipping.state)) {
      throw new UserError("Confira o endereço de entrega.");
    }

    // ---------- Itens ----------
    if (!Array.isArray(body.items) || !body.items.length || body.items.length > 20) throw new UserError("Carrinho vazio.");
    const items = body.items.map((i: Record<string, unknown>) => {
      const slug = str(i?.slug, 60);
      const qty = Number(i?.qty);
      if (!SLUG.test(slug) || !Number.isInteger(qty) || qty < 1 || qty > 10) throw new UserError("Confira os itens da sacola.");
      return { slug, qty, variant: i?.variant };
    });

    const { data: products, error: productsError } = await db
      .from("products")
      .select("id, slug, name, price_cents, stock, commission_pct")
      .in("slug", [...new Set(items.map((i) => i.slug))])
      .eq("active", true)
      .not("price_cents", "is", null);
    if (productsError) throw productsError;

    const lines = items.map((i) => {
      const p = products?.find((x) => x.slug === i.slug);
      if (!p) throw new UserError("Um dos produtos da sacola não está mais disponível.");
      const { label, surcharge } = readVariant(p.slug, i.variant);
      return { p, qty: i.qty, variant: label, unit: p.price_cents + surcharge };
    });
    // Estoque conferido pela soma do produto (o mesmo modelo em duas cores conta junto).
    const perProduct = new Map<string, number>();
    for (const l of lines) perProduct.set(l.p.id, (perProduct.get(l.p.id) ?? 0) + l.qty);
    for (const l of lines) {
      if (l.p.stock !== null && l.p.stock < perProduct.get(l.p.id)!) throw new UserError(`Sem estoque suficiente: ${l.p.name}`);
    }
    const subtotal = lines.reduce((sum, l) => sum + l.unit * l.qty, 0);

    // ---------- Afiliado: cupom tem prioridade; senão o ?ref= do navegador. Auto-indicação é ignorada. ----------
    let affiliate: { id: string; email: string; commission_pct: number } | null = null;
    let couponId: string | null = null;
    let discountPct = 0;

    const couponCode = str(body.coupon, 40).toLowerCase();
    if (couponCode) {
      // Tentativas de cupom têm limite próprio: impede testar códigos em sequência.
      if (!(await rateLimit(db, `coupon:${visitor}`, 3600, 15))) throw new UserError("Muitas tentativas de cupom. Tente mais tarde.", 429);
      if (!CODE.test(couponCode)) throw new UserError("Cupom inválido.");
      const { data: cp } = await db.from("coupons").select("id, affiliate_id, discount_pct").ilike("code", exact(couponCode)).eq("active", true).maybeSingle();
      if (!cp) throw new UserError("Cupom inválido.");
      couponId = cp.id;
      discountPct = Math.min(Math.max(Number(cp.discount_pct) || 0, 0), 100);
      if (cp.affiliate_id) {
        const { data } = await db.from("affiliates").select("id, email, commission_pct").eq("id", cp.affiliate_id).eq("status", "active").maybeSingle();
        affiliate = data;
      }
    }
    const ref = str(body.affiliateRef, 30).toLowerCase();
    if (!affiliate && /^[a-z0-9_-]{3,30}$/.test(ref)) {
      const { data } = await db.from("affiliates").select("id, email, commission_pct").eq("code", ref).eq("status", "active").maybeSingle();
      affiliate = data;
    }
    if (affiliate && affiliate.email.toLowerCase() === customer.email) affiliate = null;

    const discount = Math.round((subtotal * discountPct) / 100);
    const total = subtotal - discount + SHIPPING_CENTS;
    if (total <= 0) throw new UserError("Não foi possível calcular o total do pedido.");

    const { data: order, error } = await db.from("orders").insert({
      customer_name: customer.name, customer_email: customer.email, customer_phone: customer.phone, customer_cpf: customer.cpf,
      shipping,
      subtotal_cents: subtotal, discount_cents: discount, shipping_cents: SHIPPING_CENTS, total_cents: total,
      affiliate_id: affiliate?.id ?? null, coupon_id: couponId,
    }).select("id, number").single();
    if (error || !order) throw error ?? new Error("orders insert sem retorno");

    const { error: itemsError } = await db.from("order_items").insert(lines.map((l) => ({
      order_id: order.id, product_id: l.p.id, name: l.variant ? `${l.p.name} · ${l.variant}` : l.p.name, unit_cents: l.unit, quantity: l.qty,
    })));
    if (itemsError) {
      await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      throw itemsError;
    }

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
      if (pay) console.error("Asaas recusou a cobrança", pay.status, JSON.stringify(pay.data?.errors ?? null));
      await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
      throw new UserError("Não foi possível iniciar o pagamento. Confira seus dados ou fale com um consultor.", 502);
    }
    await db.from("orders").update({ payment_id: pay.data.id }).eq("id", order.id);
    return json(req, { url: pay.data.invoiceUrl, orderNumber: order.number });
  } catch (e) {
    if (e instanceof UserError) return json(req, { error: e.message }, e.status);
    // Detalhe técnico só no log da função; o cliente recebe uma mensagem genérica.
    console.error("[create-checkout] erro inesperado:", e instanceof Error ? e.message : e);
    return json(req, { error: "Não foi possível iniciar o pagamento. Tente novamente." }, 500);
  }
});
