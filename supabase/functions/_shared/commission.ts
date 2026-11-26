// Comissão de um pedido pago. Usa só o percentual do parceiro (afiliado 10%, consultor 20%):
// products.commission_pct não entra mais, para um produto não anular a diferença entre os tipos.
// Base: valor dos produtos já com desconto (frete não comissiona).
type Order = { subtotal_cents: number; discount_cents: number };
type Item = { unit_cents: number; quantity: number };

export function commissionCents(order: Order, items: Item[], pct: number): number {
  const ratio = order.subtotal_cents ? (order.subtotal_cents - order.discount_cents) / order.subtotal_cents : 1;
  const base = items.reduce((s, i) => s + i.unit_cents * i.quantity * ratio, 0);
  return Math.round((base * (Number(pct) || 0)) / 100);
}
