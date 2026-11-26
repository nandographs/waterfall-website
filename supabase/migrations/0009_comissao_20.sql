-- Comissão padrão do afiliado passa de 10% para 20%.
-- Vale para quem se cadastrar daqui em diante (default da coluna) e para os afiliados que
-- estavam no padrão antigo. Quem tiver um percentual combinado à parte (diferente de 10) fica como está.
-- A comissão é calculada quando o pagamento é confirmado, então pedidos ainda pendentes também
-- passam a gerar 20%. Comissões já registradas não mudam.
alter table public.affiliates alter column commission_pct set default 20;

update public.affiliates set commission_pct = 20 where commission_pct = 10;
