// Webhook do Asaas. Só aceita chamadas com o token configurado no painel (header asaas-access-token).
// Mesmo assim não confiamos no corpo: só o id da cobrança é usado e o status real é buscado na API.
// Idempotente (o Asaas reenvia eventos). Sempre responde 200 para coisas que não vamos processar,
// porque erros seguidos pausam a fila de webhooks no Asaas.
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ASAAS_KEY = Deno.env.get("ASAAS_API_KEY")!;
const ASAAS_URL = (Deno.env.get("ASAAS_API_URL") ?? "https://api.asaas.com/v3").replace(/\/$/, "");
const WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN")!;
// Dias entre o pagamento e a liberação da comissão (prazo de devolução).
const HOLD_DAYS = Number(Deno.env.get("COMMISSION_HOLD_DAYS") ?? 7);

// Pago: CONFIRMED (cartão aprovado) ou RECEIVED (Pix/boleto compensado, ou cartão liquidado).
const PAID = new Set(["CONFIRMED", "RECEIVED"]);
const REVERSED = new Set(["REFUNDED", "CHARGEBACK_REQUESTED", "CHARGEBACK_DISPUTE", "AWAITING_CHARGEBACK_REVERSAL"]);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ignored", { status: 200 });
  if (!WEBHOOK_TOKEN || req.headers.get("asaas-access-token") !== WEBHOOK_TOKEN) {
    return new Response("unauthorized", { status: 401 });
  }

  const b = await req.json().catch(() => null);
  const paymentId = String(b?.payment?.id ?? "");
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) return new Response("ignored", { status: 200 });

  // Cobrança removida no Asaas: cancela o pedido pendente ligado a ela. Vencida (OVERDUE) não
  // cancela, porque Pix e boleto ainda podem ser pagos depois do vencimento.
  if (b?.event === "PAYMENT_DELETED") {
    await db.from("orders").update({ status: "cancelled" }).eq("payment_id", paymentId).eq("status", "pending");
    return new Response("ok", { status: 200 });
  }

  const res = await fetch(`${ASAAS_URL}/payments/${paymentId}`, {
    headers: { access_token: ASAAS_KEY, "User-Agent": "waterdiamond-loja" },
  });
  if (!res.ok) return new Response("asaas error", { status: 502 }); // o Asaas tenta de novo
  const pay = await res.json();

  if (!pay.externalReference) return new Response("ignored", { status: 200 });
  const { data: order } = await db.from("orders").select("*").eq("id", pay.externalReference).maybeSingle();
  if (!order) return new Response("unknown order", { status: 200 });
  // O valor da cobrança precisa bater com o pedido.
  if (Math.round(Number(pay.value) * 100) !== order.total_cents) return new Response("amount mismatch", { status: 200 });

  if (PAID.has(pay.status) && order.status === "pending") {
    // Cartão costuma gerar CONFIRMED e depois RECEIVED. A troca de status só vale se o pedido
    // ainda estiver pendente; quem não conseguir trocar para aqui e não mexe em estoque nem comissão.
    const { data: claimed } = await db.from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString(), payment_id: String(pay.id) })
      .eq("id", order.id).eq("status", "pending").select("id");
    if (!claimed?.length) return new Response("ok", { status: 200 });

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
  } else if (REVERSED.has(pay.status) && order.status === "paid") {
    const { data: claimed } = await db.from("orders").update({ status: "refunded" }).eq("id", order.id).eq("status", "paid").select("id");
    if (!claimed?.length) return new Response("ok", { status: 200 });
    await db.from("commissions").update({ status: "cancelled" }).eq("order_id", order.id).neq("status", "paid");
  }
  return new Response("ok", { status: 200 });
});
