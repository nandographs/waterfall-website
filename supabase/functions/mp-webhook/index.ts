// Webhook do Mercado Pago. Não confiamos no corpo recebido: só o id do pagamento é usado e o
// status real é buscado na API do MP com o nosso token. Idempotente (o MP reenvia notificações).
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN")!;
// Dias entre o pagamento e a liberação da comissão (prazo de devolução).
const HOLD_DAYS = Number(Deno.env.get("COMMISSION_HOLD_DAYS") ?? 7);

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  if (!paymentId && req.method === "POST") {
    const b = await req.json().catch(() => null);
    if (b?.type === "payment") paymentId = String(b?.data?.id ?? "");
  }
  if (!paymentId || !/^\d+$/.test(paymentId)) return new Response("ignored", { status: 200 });

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${MP_TOKEN}` } });
  if (!res.ok) return new Response("mp error", { status: 502 }); // MP tenta de novo
  const pay = await res.json();

  const { data: order } = await db.from("orders").select("*").eq("id", pay.external_reference).maybeSingle();
  if (!order) return new Response("unknown order", { status: 200 });
  // O valor pago precisa bater com o pedido.
  if (Math.round(pay.transaction_amount * 100) !== order.total_cents) return new Response("amount mismatch", { status: 200 });

  if (pay.status === "approved" && order.status === "pending") {
    await db.from("orders").update({ status: "paid", paid_at: new Date().toISOString(), mp_payment_id: String(pay.id) }).eq("id", order.id);

    const { data: items } = await db.from("order_items").select("product_id, unit_cents, quantity").eq("order_id", order.id);
    for (const it of items ?? []) {
      await db.rpc("decrement_stock", { p_id: it.product_id, p_qty: it.quantity });
    }

    if (order.affiliate_id) {
      const { data: aff } = await db.from("affiliates").select("commission_pct").eq("id", order.affiliate_id).single();
      const { data: prods } = await db.from("products").select("id, commission_pct").in("id", (items ?? []).map((i) => i.product_id));
      // Comissão sobre o valor dos produtos já com desconto (frete não comissiona).
      const ratio = order.subtotal_cents ? (order.subtotal_cents - order.discount_cents) / order.subtotal_cents : 1;
      const amount = Math.round(
        (items ?? []).reduce((s, i) => {
          const pct = prods?.find((p) => p.id === i.product_id)?.commission_pct ?? aff?.commission_pct ?? 0;
          return s + (i.unit_cents * i.quantity * ratio * Number(pct)) / 100;
        }, 0),
      );
      if (amount > 0) {
        await db.from("commissions").upsert(
          { affiliate_id: order.affiliate_id, order_id: order.id, amount_cents: amount, release_at: new Date(Date.now() + HOLD_DAYS * 864e5).toISOString() },
          { onConflict: "order_id", ignoreDuplicates: true },
        );
      }
    }
  } else if ((pay.status === "refunded" || pay.status === "charged_back") && order.status === "paid") {
    await db.from("orders").update({ status: "refunded" }).eq("id", order.id);
    await db.from("commissions").update({ status: "cancelled" }).eq("order_id", order.id).neq("status", "paid");
  } else if ((pay.status === "cancelled" || pay.status === "rejected") && order.status === "pending") {
    await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
  }
  return new Response("ok", { status: 200 });
});
