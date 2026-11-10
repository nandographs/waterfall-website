-- Aprovação automática de afiliados: o perfil fica 'active' assim que o e-mail da conta é
-- confirmado (o link de confirmação do Supabase faz as vezes do e-mail de aprovação).
-- Antes de confirmar, o perfil fica 'pending' e o código do link ainda não gera cupom.
-- 'blocked' continua sendo manual e nunca é revertido por aqui.

-- ---------- Criação da conta: já confirmada (ex.: Google) entra ativa ----------
create or replace function public.handle_new_affiliate_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta  jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  vcode text  := lower(trim(meta ->> 'affiliate_code'));
  vname text  := nullif(trim(meta ->> 'name'), '');
  vpix  text  := nullif(trim(meta ->> 'pix_key'), '');
  vstatus text := case when new.email_confirmed_at is not null then 'active' else 'pending' end;
begin
  -- Cadastro antigo (feito antes do Auth) com o mesmo e-mail: só liga à conta.
  update affiliates set user_id = new.id
  where user_id is null and lower(email) = lower(new.email);
  if found then
    if new.email_confirmed_at is not null then
      update affiliates set status = 'active' where user_id = new.id and status = 'pending';
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

-- ---------- Confirmação do e-mail: ativa o perfil ----------
create or replace function public.activate_affiliate_on_confirm() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update affiliates set status = 'active' where user_id = new.id and status = 'pending';
  return new;
end $$;

drop trigger if exists on_auth_user_confirmed_affiliate on auth.users;
create trigger on_auth_user_confirmed_affiliate
  after update of email_confirmed_at on auth.users
  for each row
  when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.activate_affiliate_on_confirm();

-- ---------- Login com Google: o e-mail já vem confirmado ----------
create or replace function public.affiliate_register(p_code text, p_name text, p_pix text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare
  uid    uuid := auth.uid();
  vemail text;
  vcode  text := lower(trim(p_code));
  vname  text := nullif(trim(p_name), '');
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  if exists (select 1 from affiliates where user_id = uid) then
    raise exception 'already_registered';
  end if;
  if vcode is null or vcode !~ '^[a-z0-9_-]{3,30}$' then
    raise exception 'affiliate_code_invalid';
  end if;

  select lower(email) into vemail from auth.users where id = uid and email_confirmed_at is not null;
  if vemail is null then
    raise exception 'not_authenticated';
  end if;

  update affiliates set user_id = uid, status = case when status = 'pending' then 'active' else status end
  where user_id is null and lower(email) = vemail;
  if found then
    return;
  end if;

  begin
    insert into affiliates (user_id, code, name, email, pix_key, status)
    values (uid, vcode, coalesce(left(vname, 120), split_part(vemail, '@', 1)), vemail, left(nullif(trim(p_pix), ''), 140), 'active');
  exception when unique_violation then
    raise exception 'code_taken';
  end;
end $$;

-- ---------- Quem já confirmou o e-mail e estava esperando aprovação ----------
update public.affiliates a
set status = 'active'
from auth.users u
where a.user_id = u.id and a.status = 'pending' and u.email_confirmed_at is not null;
