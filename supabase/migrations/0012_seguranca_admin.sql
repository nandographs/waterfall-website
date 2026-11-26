-- Endurecimento depois do painel administrativo (0011).
-- 1) Funções security definer: pg_temp explícito no fim do search_path (senão ele é consultado primeiro
--    para tabelas, e uma tabela temporária com o mesmo nome poderia ser usada no lugar da verdadeira).
-- 2) Percentual por tipo fica dentro do trigger (sem função auxiliar exposta na API) e com search_path fixo.
-- 3) my_affiliate_id() não precisa ficar disponível para visitantes sem login.
-- 4) Registro das ações dos admins (quem trocou tipo, bloqueou ou marcou comissão como paga, e quando).

-- ---------- 2) Percentual por tipo ----------
create or replace function public.affiliate_tier_pct() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.commission_pct := case new.tier when 'consultant' then 20 else 10 end;
  elsif new.tier is distinct from old.tier then
    new.commission_pct := case new.tier when 'consultant' then 20 else 10 end;
  end if;
  return new;
end $$;

drop function if exists public.tier_commission_pct(text);
revoke all on function public.affiliate_tier_pct() from public, anon, authenticated;

-- ---------- 3) my_affiliate_id: só para quem está logado (as policies rodam como authenticated) ----------
revoke all on function public.my_affiliate_id() from public, anon;
grant execute on function public.my_affiliate_id() to authenticated;

-- ---------- 4) Registro das ações dos admins ----------
create table if not exists public.admin_audit (
  id           bigint generated always as identity primary key,
  admin_id     uuid not null,
  action       text not null,
  affiliate_id uuid references public.affiliates(id) on delete set null,
  details      jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists admin_audit_affiliate_idx on public.admin_audit (affiliate_id, created_at);
alter table public.admin_audit enable row level security;
revoke all on public.admin_audit from public, anon, authenticated;

create or replace function public.admin_set_affiliate_tier(p_affiliate uuid, p_tier text)
returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  prev text;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_tier not in ('affiliate', 'consultant') then raise exception 'invalid_tier'; end if;
  select tier into prev from affiliates where id = p_affiliate for update;
  if not found then raise exception 'not_found'; end if;
  if prev = p_tier then return; end if;
  update affiliates set tier = p_tier where id = p_affiliate;
  insert into admin_audit (admin_id, action, affiliate_id, details)
  values (auth.uid(), 'set_tier', p_affiliate, jsonb_build_object('from', prev, 'to', p_tier));
end $$;

create or replace function public.admin_set_affiliate_status(p_affiliate uuid, p_status text)
returns void
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  prev text;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_status not in ('active', 'blocked') then raise exception 'invalid_status'; end if;
  select status into prev from affiliates where id = p_affiliate for update;
  if not found then raise exception 'not_found'; end if;
  -- Bloquear vale para qualquer perfil. Reativar só desfaz um bloqueio
  -- (perfil 'pending' continua esperando a confirmação do e-mail).
  if prev = p_status or (p_status = 'active' and prev <> 'blocked') then return; end if;
  update affiliates set status = p_status where id = p_affiliate;
  insert into admin_audit (admin_id, action, affiliate_id, details)
  values (auth.uid(), 'set_status', p_affiliate, jsonb_build_object('from', prev, 'to', p_status));
end $$;

create or replace function public.admin_mark_commissions_paid(p_affiliate uuid)
returns bigint
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  total bigint;
  n     integer;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  with done as (
    update commissions set status = 'paid', paid_at = now()
    where affiliate_id = p_affiliate and status in ('pending', 'approved') and release_at <= now()
    returning amount_cents
  )
  select coalesce(sum(amount_cents), 0), count(*) into total, n from done;
  if n > 0 then
    insert into admin_audit (admin_id, action, affiliate_id, details)
    values (auth.uid(), 'mark_paid', p_affiliate, jsonb_build_object('amount_cents', total, 'commissions', n));
  end if;
  return total;
end $$;

-- create or replace mantém os grants da 0011; repete aqui para não depender disso.
revoke all on function public.admin_set_affiliate_tier(uuid, text) from public, anon;
revoke all on function public.admin_set_affiliate_status(uuid, text) from public, anon;
revoke all on function public.admin_mark_commissions_paid(uuid) from public, anon;
grant execute on function public.admin_set_affiliate_tier(uuid, text) to authenticated;
grant execute on function public.admin_set_affiliate_status(uuid, text) to authenticated;
grant execute on function public.admin_mark_commissions_paid(uuid) to authenticated;

-- ---------- 1) search_path com pg_temp no fim em todas as security definer do schema public ----------
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
  loop
    execute format('alter function %s set search_path = public, pg_temp', f.sig);
  end loop;
end $$;
