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

## Afiliados (Supabase Auth)
- Rode também `migrations/0003_afiliados_acesso.sql` e `0004_afiliados_supabase_auth.sql`, e faça o deploy de `track-click`.
- Cada afiliado tem uma conta no Supabase Auth (e-mail + senha). O cadastro do site chama `auth.signUp()` e o trigger
  `on_auth_user_created_affiliate` cria a linha em `affiliates` (status `pending`, ligada por `user_id`).
  Cadastros antigos com o mesmo e-mail são apenas ligados à conta nova.
- Em Authentication > Sign In / Providers: deixe **Email** ligado, com **Confirm email** ativo (ninguém entra sem confirmar).
  Em Authentication > Policies (ou Providers > Email), defina a senha mínima em 8 caracteres.
- Em Authentication > URL Configuration, coloque `SITE_URL` como Site URL e `SITE_URL/afiliados` nas Redirect URLs
  (usado pela confirmação de e-mail e pelo "Esqueci minha senha").
- Aprovar: em Table Editor > `affiliates`, mude `status` de `pending` para `active` (o cupom com o mesmo código é criado sozinho).
  Ajuste `commission_pct` do afiliado e, se quiser desconto no cupom, `coupons.discount_pct`.
- Bloquear: `status = blocked` (o login continua funcionando, mas o painel não mostra nada).
- Pagar comissão: some as comissões liberadas (`release_at` vencido, status `pending`/`approved`), pague por Pix e marque `status = paid`.
- Login com Google: rode `0005_afiliados_google.sql`. O cliente OAuth fica no projeto "Waterfall Website" do Google Cloud
  (Google Auth Platform > Clientes), com o redirect `https://ovhdaadmhlbgvquowdtr.supabase.co/auth/v1/callback`.
  Quem entra pelo Google sem perfil vê "Complete seu cadastro" no painel (código + Pix), que chama `affiliate_register()`.
  Para qualquer conta Google conseguir entrar, o app precisa estar "Em produção" em Google Auth Platform > Público-alvo.
- A Edge Function `affiliate-signup` não é mais usada: apague do projeto com `supabase functions delete affiliate-signup`.
