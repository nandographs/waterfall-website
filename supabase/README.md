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
3. Deploy: `supabase functions deploy create-checkout` e `supabase functions deploy asaas-webhook`
   (o `config.toml` já desliga o JWT só do webhook).
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
  Cadastros antigos com o mesmo e-mail são apenas ligados à conta nova.
- Em Authentication > Sign In / Providers: deixe **Email** ligado, com **Confirm email** ativo (ninguém entra sem confirmar).
  Em Authentication > Policies (ou Providers > Email), defina a senha mínima em 8 caracteres.
- Em Authentication > URL Configuration, coloque `SITE_URL` como Site URL e `SITE_URL/afiliados` nas Redirect URLs
  (usado pela confirmação de e-mail e pelo "Esqueci minha senha").
- Aprovação automática (`0007`): o afiliado vira `active` quando confirma o e-mail, e o cupom com o mesmo código é criado sozinho.
  O e-mail de confirmação sai pelo SMTP da Hostinger (no-reply@waterfall.ind.br) com o modelo em Authentication > Emails.
  Ajuste `commission_pct` do afiliado e, se quiser desconto no cupom, `coupons.discount_pct`.
- Bloquear: `status = blocked` (o login continua funcionando, mas o painel não mostra nada).
- Pagar comissão: some as comissões liberadas (`release_at` vencido, status `pending`/`approved`), pague por Pix e marque `status = paid`.
- Login com Google: rode `0005_afiliados_google.sql`. O cliente OAuth fica no projeto "Waterfall Website" do Google Cloud
  (Google Auth Platform > Clientes), com o redirect `https://ovhdaadmhlbgvquowdtr.supabase.co/auth/v1/callback`.
  Quem entra pelo Google sem perfil vê "Complete seu cadastro" no painel (código + Pix), que chama `affiliate_register()`.
  Para qualquer conta Google conseguir entrar, o app precisa estar "Em produção" em Google Auth Platform > Público-alvo.
- A Edge Function `affiliate-signup` não é mais usada: apague do projeto com `supabase functions delete affiliate-signup`.

## Mercado Pago (desativado)
- O checkout usa só o Asaas. O `mp-webhook` continua publicado só para fechar pedidos antigos ainda pendentes no Mercado Pago.
  Depois disso, apague com `supabase functions delete mp-webhook`, remova a pasta `functions/mp-webhook` e o secret `MP_ACCESS_TOKEN`.
