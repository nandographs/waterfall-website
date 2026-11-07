-- Afiliado acessa o painel por link mágico no e-mail cadastrado (o Supabase confirma o e-mail),
-- então as policies casam pelo e-mail do JWT em vez de exigir user_id.

drop policy "afiliado vê o próprio perfil" on public.affiliates;
drop policy "afiliado vê os próprios cliques" on public.affiliate_clicks;
drop policy "afiliado vê as próprias comissões" on public.commissions;

create or replace function public.my_affiliate_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from affiliates
  where lower(email) = lower(auth.jwt() ->> 'email') and status = 'active' limit 1;
$$;

create policy "afiliado vê o próprio perfil" on public.affiliates for select
  using (lower(email) = lower(auth.jwt() ->> 'email'));

create policy "afiliado vê os próprios cliques" on public.affiliate_clicks for select
  using (affiliate_id = public.my_affiliate_id());

create policy "afiliado vê as próprias comissões" on public.commissions for select
  using (affiliate_id = public.my_affiliate_id());

create policy "afiliado vê os próprios cupons" on public.coupons for select
  using (affiliate_id = public.my_affiliate_id());

-- Ao aprovar (status -> active), cria o cupom do afiliado com o mesmo código do link.
-- discount_pct começa em 0 (só rastreia); edite na tabela coupons para dar desconto.
create or replace function public.on_affiliate_active() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'active' and (tg_op = 'INSERT' or old.status <> 'active') then
    insert into coupons (code, affiliate_id, discount_pct) values (new.code, new.id, 0)
    on conflict (code) do nothing;
  end if;
  return new;
end $$;

create trigger affiliate_active after insert or update of status on public.affiliates
  for each row execute function public.on_affiliate_active();
