# Backend da loja (Supabase)

1. Rode `migrations/0001_loja_afiliados.sql`, `0002_estoque.sql` e `0008_pagamento_asaas.sql` no SQL Editor.
2. Secrets (Project Settings > Edge Functions, ou `supabase secrets set`):
   - `ASAAS_API_KEY`: chave de API do Asaas (Integrações > Chaves de API)
   - `ASAAS_API_URL`: `https://api.asaas.com/v3` em produção (padrão) ou `https://api-sandbox.asaas.com/v3` para testes
   - `ASAAS_WEBHOOK_TOKEN`: um texto aleatório longo, o mesmo cadastrado no webhook do Asaas (passo 4)
   - `SITE_URL`: ex. `https://seudominio.com.br` (sem barra final)
   - `SHIPPING_CENTS`: frete fixo em centavos (0 = grátis)
   - `COMMISSION_HOLD_DAYS`: dias até liberar a comissão (padrão 7)
   - `STORE_OPEN`: `true` libera o checkout. Sem ele a função responde "loja em manutenção".
     No site, a trava é `STORE_OPEN` em `src/lib/catalog.ts`.
   - `ALLOWED_ORIGINS`: domínios que podem chamar `create-checkout` e `track-click`, separados por vírgula
     (ex.: `https://waterfall.ind.br,https://www.waterfall.ind.br,https://bionlife.waterfall.ind.br`). Sem ele vale só o `SITE_URL`.
     Chamada de outra origem (ou sem origem) recebe 403.
   - `RATE_LIMIT_SALT`: texto aleatório longo. O IP do visitante vira hash com ele antes de ir para `rate_limits`.
3. Deploy: `supabase functions deploy create-checkout`, `asaas-webhook` e `track-click`
   (o `config.toml` já desliga o JWT só do webhook). Rode antes a `0010_seguranca.sql`: ela cria o
   `rate_limit_hit()` que as funções usam (sem ela os limites ficam desligados e o log mostra "[rate-limit] indisponível").
4. No Asaas, em Integrações > Webhooks, crie um webhook de **Cobranças**:
   - URL: `https://ovhdaadmhlbgvquowdtr.supabase.co/functions/v1/asaas-webhook`
   - Token de autenticação: o mesmo valor de `ASAAS_WEBHOOK_TOKEN`
   - Eventos: pagamento confirmado, pagamento recebido, estornado, chargeback e cobrança removida
   - Envio sequencial, versão da API v3
   O checkout gera uma fatura do Asaas em que o cliente escolhe Pix, cartão ou boleto (vencimento em 3 dias).
   O retorno automático para `/pedido` só funciona se o domínio de `SITE_URL` estiver cadastrado em
   Minha Conta > Informações comerciais (site) no Asaas.
5. Cadastre preços em `products.price_cents`. Produtos sem preço não vão ao carrinho.

## Afiliados (Supabase Auth)
- Rode também `migrations/0003_afiliados_acesso.sql` e `0004_afiliados_supabase_auth.sql`, e faça o deploy de `track-click`.
- Cada afiliado tem uma conta no Supabase Auth (e-mail + senha). O cadastro do site chama `auth.signUp()` e o trigger
  `on_auth_user_created_affiliate` cria a linha em `affiliates` (status `pending`, ligada por `user_id`).
  Cadastros antigos com o mesmo e-mail são ligados à conta nova só depois que o e-mail é confirmado (`0010`).
- Em Authentication > Sign In / Providers: deixe **Email** ligado, com **Confirm email** ativo (ninguém entra sem confirmar).
  Em Authentication > Policies (ou Providers > Email), defina a senha mínima em **10** caracteres com letras e números
  (o site já exige isso) e ligue **Leaked password protection**. Em Authentication > Rate Limits, mantenha os limites de
  login e de envio de e-mail baixos; para travar robôs de vez, ligue o CAPTCHA (Turnstile) em Authentication > Attack Protection.
- Em Authentication > URL Configuration, coloque `SITE_URL` como Site URL e `SITE_URL/afiliados` nas Redirect URLs
  (usado pela confirmação de e-mail e pelo "Esqueci minha senha").
- Aprovação automática (`0007`): o afiliado vira `active` quando confirma o e-mail, e o cupom com o mesmo código é criado sozinho.
  O e-mail de confirmação sai pelo SMTP da Hostinger (no-reply@waterfall.ind.br) com o modelo em Authentication > Emails.
- Tipos de parceiro (`0011`): `affiliates.tier` é `affiliate` (10%) ou `consultant` (20%). Todo cadastro nasce afiliado;
  quem vira consultor é o admin, no painel. Ao trocar o tipo, um trigger ajusta `commission_pct`, e é esse campo que os
  webhooks usam. A comissão é sobre o valor dos produtos já com desconto (frete não entra). Comissões já registradas não mudam.
  `products.commission_pct` não é mais usado no cálculo. Desconto no cupom: `coupons.discount_pct`.
- Painel administrativo (`/admin`, `0011`): o admin entra pelo mesmo login do `/afiliados` e é mandado para o `/admin`.
  Lá vê afiliados e consultores, cliques, vendas e comissões, troca o tipo, bloqueia/reativa e marca as comissões liberadas
  como pagas (depois de pagar o Pix). Tudo passa por funções `admin_*` que recusam quem não está em `public.admins`.
  Cada troca de tipo, bloqueio/reativação e pagamento marcado fica em `public.admin_audit` (qual admin, o quê, quando; `0012`).
  Para cadastrar um admin, crie a conta (pelo próprio site ou em Authentication > Users) e rode no SQL Editor:
  `insert into public.admins (user_id) select id from auth.users where lower(email) = lower('email@do-admin') on conflict do nothing;`
- Login com Google: rode `0005_afiliados_google.sql`. O cliente OAuth fica no projeto "Waterfall Website" do Google Cloud
  (Google Auth Platform > Clientes), com o redirect `https://ovhdaadmhlbgvquowdtr.supabase.co/auth/v1/callback`.
  Quem entra pelo Google sem perfil vê "Complete seu cadastro" no painel (código + Pix), que chama `affiliate_register()`.
  Para qualquer conta Google conseguir entrar, o app precisa estar "Em produção" em Google Auth Platform > Público-alvo.
- A Edge Function `affiliate-signup` não é mais usada: apague do projeto com `supabase functions delete affiliate-signup`.

## Mercado Pago (desativado)
- O checkout usa só o Asaas. O `mp-webhook` continua publicado só para fechar pedidos antigos ainda pendentes no Mercado Pago.
  Depois disso, apague com `supabase functions delete mp-webhook`, remova a pasta `functions/mp-webhook` e o secret `MP_ACCESS_TOKEN`.
