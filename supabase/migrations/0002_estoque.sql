-- Baixa de estoque atômica, chamada pelo webhook. Estoque null = sem controle.
create or replace function public.decrement_stock(p_id uuid, p_qty integer)
returns void language sql security definer set search_path = public as $$
  update products set stock = greatest(stock - p_qty, 0) where id = p_id and stock is not null;
$$;

revoke all on function public.decrement_stock(uuid, integer) from public, anon, authenticated;
