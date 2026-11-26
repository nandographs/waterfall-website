-- Endurecimento de segurança.
-- 1) Contador de tentativas (rate limit) usado pelas Edge Functions.
-- 2) Perfil de afiliado antigo só é ligado a uma conta depois que o e-mail é confirmado.
-- 3) Permissões mínimas para o navegador (anon/authenticated), além do RLS.

-- ---------- 1) Rate limit ----------
-- Janela fixa por chave (ex.: "checkout:<hash do IP>"). Só a service role usa.
create table if not exists public.rate_limits (
  key          text not null,
  window_start timestamptz not null,
  hits         integer not null default 0,
  primary key (key, window_start)
);
create index if not exists rate_limits_window_idx on public.rate_limits (window_start);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from public, anon, authenticated;

create or replace function public.rate_limit_hit(p_key text, p_window_seconds integer, p_max integer)
returns boolean
language plpgsql security definer set search_path = public as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / greatest(p_window_seconds, 1)) * greatest(p_window_seconds, 1));
  n integer;
begin
  insert into rate_limits as r (key, window_start, hits) values (left(p_key, 200), w, 1)
  on conflict (key, window_start) do update set hits = r.hits + 1
  returning r.hits into n;
  -- Limpeza ocasional das janelas velhas.
  if random() < 0.02 then
    delete from rate_limits where window_start < now() - interval '2 days';
  end if;
  return n <= p_max;
end $$;

revoke all on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;

-- ---------- 2) Tomada de perfil por e-mail não confirmado ----------
-- Antes, criar uma conta com o e-mail de um afiliado antigo (cadastro sem conta) já ligava o perfil
-- a essa conta, mesmo sem confirmar o e-mail. Agora a ligação só acontece com o e-mail confirmado.
create or replace function public.handle_new_affiliate_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta    jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  vcode   text  := lower(trim(meta ->> 'affiliate_code'));
  vname   text  := left(nullif(trim(meta ->> 'name'), ''), 120);
  vpix    text  := left(nullif(trim(meta ->> 'pix_key'), ''), 140);
  vstatus text  := case when new.email_confirmed_at is not null then 'active' else 'pending' end;
begin
  if exists (select 1 from affiliates where user_id is null and lower(email) = lower(new.email)) then
    -- Cadastro antigo com o mesmo e-mail: liga agora se o e-mail já vier confirmado (ex.: Google);
    -- senão, a ligação fica para a confirmação (activate_affiliate_on_confirm).
    if new.email_confirmed_at is not null then
      update affiliates set user_id = new.id, status = case when status = 'pending' then 'active' else status end
      where user_id is null and lower(email) = lower(new.email);
    end if;
    return new;
  end if;

  if vcode is not null and vcode <> '' then
    if vcode !~ '^[a-z0-9_-]{3,30}$' then
      raise exception 'affiliate_code_invalid';
    end if;
    insert into affiliates (user_id, code, name, email, pix_key, status)
    values (new.id, vcode, coalesce(vname, split_part(new.email, '@', 1)), lower(new.email), vpix, vstatus);
  end if;

  return new;
end $$;

create or replace function public.activate_affiliate_on_confirm() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- E-mail confirmado: agora sim liga o cadastro antigo (se houver) e ativa o perfil.
  if not exists (select 1 from affiliates where user_id = new.id) then
    update affiliates set user_id = new.id where user_id is null and lower(email) = lower(new.email);
  end if;
  update affiliates set status = 'active' where user_id = new.id and status = 'pending';
  return new;
end $$;

-- ---------- 3) Permissões mínimas ----------
-- O RLS já bloqueia, mas o Supabase dá ALL nas tabelas para anon/authenticated por padrão.
-- Tirar o que o navegador nunca usa fecha a porta mesmo se uma policy for criada errada no futuro.

-- Pedidos e itens: só as Edge Functions (service role).
revoke all on public.orders, public.order_items from anon, authenticated;

-- Tabelas que o navegador só lê (cada uma com sua policy de RLS).
revoke insert, update, delete, truncate, references, trigger
  on public.products, public.affiliates, public.coupons, public.affiliate_clicks, public.commissions
  from anon, authenticated;

-- Produtos: o público vê só o que a vitrine usa. Estoque e comissão ficam internos.
revoke select on public.products from anon, authenticated;
grant select (id, slug, brand, name, headline, description, image, price_cents, requires_consultant, active, sort_order)
  on public.products to anon, authenticated;

-- Dados do afiliado, cupons, cliques e comissões: só para quem está logado (o RLS filtra o que é dele).
revoke select on public.affiliates, public.coupons, public.affiliate_clicks, public.commissions from anon;

-- Funções de trigger não devem ser chamadas pela API.
revoke all on function public.handle_new_affiliate_user() from public, anon, authenticated;
revoke all on function public.activate_affiliate_on_confirm() from public, anon, authenticated;
revoke all on function public.sync_affiliate_email() from public, anon, authenticated;
revoke all on function public.on_affiliate_active() from public, anon, authenticated;
