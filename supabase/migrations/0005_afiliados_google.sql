-- Login com Google: a conta nasce sem o código do link (o Google não manda esses dados),
-- então o trigger de 0004 não cria o perfil. O painel pede código e Pix e chama esta função,
-- que cria o perfil "pending" para o usuário logado.

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

  select lower(email) into vemail from auth.users where id = uid;
  if vemail is null then
    raise exception 'not_authenticated';
  end if;

  -- Cadastro antigo com o mesmo e-mail e ainda sem conta: só liga.
  update affiliates set user_id = uid where user_id is null and lower(email) = vemail;
  if found then
    return;
  end if;

  begin
    insert into affiliates (user_id, code, name, email, pix_key)
    values (uid, vcode, coalesce(left(vname, 120), split_part(vemail, '@', 1)), vemail, left(nullif(trim(p_pix), ''), 140));
  exception when unique_violation then
    raise exception 'code_taken';
  end;
end $$;

revoke all on function public.affiliate_register(text, text, text) from public, anon;
grant execute on function public.affiliate_register(text, text, text) to authenticated;
