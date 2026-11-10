-- Loja + afiliados. Rode no SQL Editor do Supabase (ou `supabase db push`).
-- Regra geral: o navegador só LÊ produtos e o próprio perfil de afiliado.
-- Pedidos, comissões e cliques são escritos apenas pelas Edge Functions (service role).

create extension if not exists pgcrypto;

-- ---------- Catálogo ----------
create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  brand        text not null check (brand in ('bionlife', 'waterdiamond')),
  name         text not null,
  headline     text,
  description  text,
  image        text,                      -- caminho base em /images (sem extensão)
  price_cents  integer check (price_cents >= 0),  -- null = sob consulta
  stock        integer,                   -- null = sem controle de estoque
  requires_consultant boolean not null default false,
  commission_pct numeric(5,2),            -- null = usa o padrão do afiliado
  active       boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- Afiliados ----------
create table public.affiliates (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid unique references auth.users(id) on delete set null,
  code         text unique not null check (code ~ '^[a-z0-9_-]{3,30}$'),
  name         text not null,
  email        text not null,
  pix_key      text,
  commission_pct numeric(5,2) not null default 10,
  status       text not null default 'pending' check (status in ('pending', 'active', 'blocked')),
  created_at   timestamptz not null default now()
);

create table public.coupons (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  affiliate_id  uuid references public.affiliates(id) on delete cascade,
  discount_pct  numeric(5,2) not null default 0 check (discount_pct between 0 and 100),
  active        boolean not null default true
);

create table public.affiliate_clicks (
  id            bigint generated always as identity primary key,
  affiliate_id  uuid not null references public.affiliates(id) on delete cascade,
  landing_path  text,
  created_at    timestamptz not null default now()
);

-- ---------- Pedidos ----------
create table public.orders (
  id             uuid primary key default gen_random_uuid(),
  number         bigint generated always as identity unique,
  status         text not null default 'pending'
                   check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  customer_name  text not null,
  customer_email text not null,
  customer_phone text,
  customer_cpf   text,
  shipping       jsonb,                   -- endereço
  subtotal_cents integer not null,
  discount_cents integer not null default 0,
  shipping_cents integer not null default 0,
  total_cents    integer not null,
  affiliate_id   uuid references public.affiliates(id),
  coupon_id      uuid references public.coupons(id),
  mp_payment_id  text unique,             -- id do pagamento no Mercado Pago
  paid_at        timestamptz,
  created_at     timestamptz not null default now()
);

create table public.order_items (
  id          bigint generated always as identity primary key,
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  name        text not null,              -- snapshot do nome/preço na hora da compra
  unit_cents  integer not null,
  quantity    integer not null check (quantity > 0)
);

-- ---------- Comissões ----------
create table public.commissions (
  id            uuid primary key default gen_random_uuid(),
  affiliate_id  uuid not null references public.affiliates(id),
  order_id      uuid not null unique references public.orders(id),
  amount_cents  integer not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'paid', 'cancelled')),
  release_at    timestamptz,              -- libera após o prazo de devolução
  paid_at       timestamptz,
  created_at    timestamptz not null default now()
);

create index on public.orders (affiliate_id);
create index on public.affiliate_clicks (affiliate_id, created_at);
create index on public.commissions (affiliate_id, status);

-- ---------- Segurança (RLS) ----------
alter table public.products          enable row level security;
alter table public.affiliates        enable row level security;
alter table public.coupons           enable row level security;
alter table public.affiliate_clicks  enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.commissions       enable row level security;

create policy "produtos ativos são públicos"
  on public.products for select using (active);

create policy "afiliado vê o próprio perfil"
  on public.affiliates for select using (user_id = auth.uid());

create policy "afiliado vê os próprios cliques"
  on public.affiliate_clicks for select
  using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));

create policy "afiliado vê as próprias comissões"
  on public.commissions for select
  using (affiliate_id in (select id from public.affiliates where user_id = auth.uid()));

-- orders, order_items e coupons: sem policy = inacessíveis ao navegador.
-- Edge Functions usam a service role, que ignora RLS.

-- ---------- Seed inicial (preços ficam nulos: preencha antes de vender) ----------
insert into public.products (slug, brand, name, headline, image, requires_consultant, sort_order) values
  ('ion-center-slim',  'waterdiamond', 'Ion Center Slim',  'Compacto e discreto', 'SLIMIMG',  true, 10),
  ('ion-center-smart', 'waterdiamond', 'Ion Center Smart', 'Tecnologia e praticidade', 'SMARTIMG', true, 20),
  ('ion-center-turbo', 'waterdiamond', 'Ion Center Turbo', 'Máximo desempenho', 'TURBOIMG', true, 30),
  ('colchao-bionlife-especiais', 'bionlife', 'BionLife Especiais', 'Completo e sofisticado', 'bionlife-linha-especiais', false, 40),
  ('colchao-bionlife-relax',     'bionlife', 'BionLife Relax',     'Macio e acolhedor',       'bionlife-linha-relax',     false, 50),
  ('colchao-bionlife-vacuo',     'bionlife', 'BionLife A Vácuo',   'Macio e adaptável',       'bionlife-linha-vacuo',     false, 60),
  ('colchao-bionlife-magnetico', 'bionlife', 'BionLife Magnético', 'Firme e estruturado',     'bionlife-linha-magnetico', false, 70);
