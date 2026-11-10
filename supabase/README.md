# Backend da loja (Supabase)

1. Rode `migrations/0001_loja_afiliados.sql` e `0002_estoque.sql` no SQL Editor.
2. Secrets (Project Settings > Edge Functions, ou `supabase secrets set`):
   - `MP_ACCESS_TOKEN`: token de produção (ou de teste) do Mercado Pago
   - `SITE_URL`: ex. `https://seudominio.com.br` (sem barra final)
   - `SHIPPING_CENTS`: frete fixo em centavos (0 = grátis)
   - `COMMISSION_HOLD_DAYS`: dias até liberar a comissão (padrão 7)
3. Deploy: `supabase functions deploy create-checkout` e `supabase functions deploy mp-webhook`
   (o `config.toml` já desliga o JWT só do webhook).
4. No Mercado Pago, a `notification_url` é enviada a cada pagamento; não precisa configurar no painel.
5. Cadastre preços em `products.price_cents`. Produtos sem preço não vão ao carrinho.

## Afiliados
- Rode também `migrations/0003_afiliados_acesso.sql` e faça o deploy de `affiliate-signup` e `track-click`.
- Em Authentication > URL Configuration, coloque `SITE_URL` e `SITE_URL/afiliados` nas Redirect URLs (o login é por link mágico).
- Aprovar: em Table Editor > `affiliates`, mude `status` de `pending` para `active` (o cupom com o mesmo código é criado sozinho).
  Ajuste `commission_pct` do afiliado e, se quiser desconto no cupom, `coupons.discount_pct`.
- Pagar comissão: some as comissões liberadas (`release_at` vencido, status `pending`/`approved`), pague por Pix e marque `status = 'paid'`.
