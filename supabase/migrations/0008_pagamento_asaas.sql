-- Checkout passa do Mercado Pago para o Asaas.
-- payment_id guarda o id da cobrança no Asaas (pay_...). mp_payment_id fica só como histórico
-- dos pedidos antigos pagos pelo Mercado Pago.
alter table public.orders add column if not exists payment_id text unique;
comment on column public.orders.payment_id is 'id da cobrança no Asaas (pay_...)';
comment on column public.orders.mp_payment_id is 'histórico: id do pagamento no Mercado Pago (pedidos antigos)';
