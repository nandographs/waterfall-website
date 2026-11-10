-- Afiliados passam a ter conta no Supabase Auth (e-mail + senha).
-- O cadastro é feito pelo próprio site com supabase.auth.signUp(); o perfil em `affiliates`
-- nasce de um trigger em auth.users e fica ligado ao usuário por user_id.
-- O acesso ao painel continua dependendo da aprovação (status = 'active').

-- ---------- Liga afiliados antigos às contas que já existem (mesmo e-mail) ----------
update public.affiliates a
set user_id = u.id
from auth.users u
where a.user_id is null
  and lower(u.email) = lower(a.email)
  and not exists (select 1 from public.affiliates x where x.user_id = u.id);

-- ---------- Código livre? (o formulário consulta antes de criar a conta) ----------
-- Um código que pertence a um cadastro antigo ainda sem conta, com o mesmo e-mail, conta como livre:
-- nesse caso o trigger abaixo só liga o cadastro antigo à conta nova.
create or replace function public.affiliate_code_available(p_code text, p_email text default null)
returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from affiliates
    where code = lower(p_code)
      and not (user_id is null and p_email is not null and lower(email) = lower(p_email))
  );
$$;

revoke all on function public.affiliate_code_available(text, text) from public;
grant execute on function public.affiliate_code_available(text, text) to anon, authenticated;

-- ---------- Cria/vincula o perfil quando a conta é criada ----------
create or replace function public.handle_new_affiliate_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta  jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  vcode text  := lower(trim(meta ->> 'affiliate_code'));
  vname text  := nullif(trim(meta ->> 'name'), '');
  vpix  text  := nullif(trim(meta ->> 'pix_key'), '');
begin
  -- Cadastro antigo (feito antes do Auth) com o mesmo e-mail: só liga à conta.
  update affiliates set user_id = new.id
  where user_id is null and lower(email) = lower(new.email);
  if found then
    return new;
  end if;

  -- Conta criada pelo formulário de afiliado: cria o perfil em análise.
  if vcode is not null and vcode <> '' then
    if vcode !~ '^[a-z0-9_-]{3,30}$' then
      raise exception 'affiliate_code_invalid';
    end if;
    insert into affiliates (user_id, code, name, email, pix_key)
    values (new.id, vcode, coalesce(vname, split_part(new.email, '@', 1)), lower(new.email), vpix);
  end if;

  return new;
end $$;

drop trigger if exists on_auth_user_created_affiliate on auth.users;
create trigger on_auth_user_created_affiliate
  after insert on auth.users
  for each row execute function public.handle_new_affiliate_user();

-- Mantém o e-mail do perfil igual ao da conta se o afiliado trocar o e-mail no Auth.
create or replace function public.sync_affiliate_email() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update affiliates set email = lower(new.email) where user_id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_email_changed_affiliate on auth.users;
create trigger on_auth_user_email_changed_affiliate
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.sync_affiliate_email();

-- ---------- RLS: casa pelo usuário autenticado (auth.uid()), não mais pelo e-mail ----------
create or replace function public.my_affiliate_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from affiliates where user_id = auth.uid() and status = 'active' limit 1;
$$;

drop policy if exists "afiliado vê o próprio perfil" on public.affiliates;
create policy "afiliado vê o próprio perfil" on public.affiliates for select
  to authenticated using (user_id = auth.uid());

-- As policies de cliques, comissões e cupons já usam my_affiliate_id(), que agora usa auth.uid().
