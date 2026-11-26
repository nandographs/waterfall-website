-- Dois tipos de parceiro e painel administrativo.
-- 1) affiliates.tier: 'affiliate' (10%) ou 'consultant' (20%). Quem define o tipo é o admin.
--    O percentual (commission_pct) passa a seguir o tipo, então os webhooks continuam lendo o mesmo campo.
-- 2) Comissão de afiliado volta para 10%. Comissões já registradas não mudam.
-- 3) Tabela admins + funções que só um admin consegue chamar (o navegador nunca lê orders/commissions direto).

-- ---------- 1) Tipo do parceiro ----------
alter table public.affiliates
  add column if not exists tier text not null default 'affiliate'
  check (tier in ('affiliate', 'consultant'));

create or replace function public.tier_commission_pct(p_tier text) returns numeric
language sql immutable as $$
  select case p_tier when 'consultant' then 20 else 10 end::numeric;
$$;

-- Ao criar o perfil ou trocar o tipo, o percentual acompanha o tipo.
-- Um percentual combinado à parte ainda pode ser gravado direto em commission_pct (sem mexer no tipo).
create or replace function public.affiliate_tier_pct() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    new.commission_pct := public.tier_commission_pct(new.tier);
  elsif new.tier is distinct from old.tier then
    new.commission_pct := public.tier_commission_pct(new.tier);
  end if;
  return new;
end $$;

drop trigger if exists affiliate_tier_pct on public.affiliates;
create trigger affiliate_tier_pct before insert or update of tier on public.affiliates
  for each row execute function public.affiliate_tier_pct();

revoke all on function public.affiliate_tier_pct() from public, anon, authenticated;

-- ---------- 2) Afiliado volta para 10% ----------
alter table public.affiliates alter column commission_pct set default 10;
-- Quem estava no padrão de 20% (0009) volta para 10%. Percentuais combinados à parte ficam como estão.
update public.affiliates set commission_pct = 10 where tier = 'affiliate' and commission_pct = 20;

-- ---------- 3) Admins ----------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
revoke all on public.admins from public, anon, authenticated;

-- Para cadastrar um admin (uma vez, no SQL Editor), troque o e-mail:
--   insert into public.admins (user_id)
--   select id from auth.users where lower(email) = lower('email-do-admin@exemplo.com')
--   on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------- Funções do painel admin ----------
-- Lista de parceiros com cliques, vendas pagas e comissões.
-- "Liberada" = prazo de devolução vencido e ainda não paga. "Em espera" = ainda dentro do prazo.
create or replace function public.admin_list_affiliates()
returns table (
  id uuid, name text, email text, code text, pix_key text, status text, tier text,
  commission_pct numeric, created_at timestamptz,
  clicks bigint, orders_paid bigint, sales_cents bigint,
  commission_waiting_cents bigint, commission_available_cents bigint, commission_paid_cents bigint
)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  return query
  select a.id, a.name, a.email, a.code, a.pix_key, a.status, a.tier, a.commission_pct, a.created_at,
    coalesce(k.n, 0)::bigint,
    coalesce(o.n, 0)::bigint,
    coalesce(o.total, 0)::bigint,
    coalesce(c.waiting, 0)::bigint,
    coalesce(c.available, 0)::bigint,
    coalesce(c.paid, 0)::bigint
  from affiliates a
  left join (select affiliate_id, count(*) n from affiliate_clicks group by 1) k on k.affiliate_id = a.id
  left join (
    select affiliate_id, count(*) n, sum(total_cents) total from orders where status = 'paid' group by 1
  ) o on o.affiliate_id = a.id
  left join (
    select affiliate_id,
      sum(amount_cents) filter (where status in ('pending', 'approved') and (release_at is null or release_at > now())) waiting,
      sum(amount_cents) filter (where status in ('pending', 'approved') and release_at <= now()) available,
      sum(amount_cents) filter (where status = 'paid') paid
    from commissions group by 1
  ) c on c.affiliate_id = a.id
  order by a.created_at desc;
end $$;

-- Vendas de um parceiro (pedidos cancelados antes do pagamento ficam de fora).
create or replace function public.admin_affiliate_orders(p_affiliate uuid)
returns table (
  order_id uuid, number bigint, status text, customer_name text, total_cents integer,
  created_at timestamptz, paid_at timestamptz,
  commission_cents integer, commission_status text, release_at timestamptz
)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  return query
  select o.id, o.number, o.status, o.customer_name, o.total_cents, o.created_at, o.paid_at,
    c.amount_cents, c.status, c.release_at
  from orders o
  left join commissions c on c.order_id = o.id
  where o.affiliate_id = p_affiliate and o.status <> 'cancelled'
  order by o.created_at desc
  limit 500;
end $$;

-- Troca entre afiliado (10%) e consultor (20%). O trigger ajusta o percentual.
create or replace function public.admin_set_affiliate_tier(p_affiliate uuid, p_tier text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_tier not in ('affiliate', 'consultant') then raise exception 'invalid_tier'; end if;
  update affiliates set tier = p_tier where id = p_affiliate;
  if not found then raise exception 'not_found'; end if;
end $$;

-- Bloquear vale para qualquer perfil. Reativar só desfaz um bloqueio
-- (perfil 'pending' continua esperando a confirmação do e-mail).
create or replace function public.admin_set_affiliate_status(p_affiliate uuid, p_status text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_status = 'blocked' then
    update affiliates set status = 'blocked' where id = p_affiliate;
  elsif p_status = 'active' then
    update affiliates set status = 'active' where id = p_affiliate and status = 'blocked';
  else
    raise exception 'invalid_status';
  end if;
  if not found then raise exception 'not_found'; end if;
end $$;

-- Depois de pagar o Pix: marca como pagas as comissões liberadas do parceiro. Devolve o total marcado.
create or replace function public.admin_mark_commissions_paid(p_affiliate uuid)
returns bigint
language plpgsql security definer set search_path = public as $$
declare
  total bigint;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  with done as (
    update commissions set status = 'paid', paid_at = now()
    where affiliate_id = p_affiliate and status in ('pending', 'approved') and release_at <= now()
    returning amount_cents
  )
  select coalesce(sum(amount_cents), 0) into total from done;
  return total;
end $$;

revoke all on function public.admin_list_affiliates() from public, anon;
revoke all on function public.admin_affiliate_orders(uuid) from public, anon;
revoke all on function public.admin_set_affiliate_tier(uuid, text) from public, anon;
revoke all on function public.admin_set_affiliate_status(uuid, text) from public, anon;
revoke all on function public.admin_mark_commissions_paid(uuid) from public, anon;
grant execute on function public.admin_list_affiliates() to authenticated;
grant execute on function public.admin_affiliate_orders(uuid) to authenticated;
grant execute on function public.admin_set_affiliate_tier(uuid, text) to authenticated;
grant execute on function public.admin_set_affiliate_status(uuid, text) to authenticated;
grant execute on function public.admin_mark_commissions_paid(uuid) to authenticated;
