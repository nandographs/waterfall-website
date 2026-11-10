-- Tabela de preços Ion Center 2026 (modelos base, sem torneira Faucet/Gourmet).
update public.products set price_cents = 249000 where slug = 'ion-center-slim';
update public.products set price_cents = 349000 where slug = 'ion-center-smart';
update public.products set price_cents = 399000 where slug = 'ion-center-turbo';
