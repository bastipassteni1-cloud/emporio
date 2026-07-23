-- Esquema inicial: catálogo de artesanías (categorías, productos, imágenes,
-- mensajes de contacto) + políticas RLS.

create type product_status as enum ('available', 'sold', 'made_to_order');

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price integer not null check (price >= 0), -- CLP, sin decimales
  dimensions text,
  status product_status not null default 'available',
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  position integer not null default 0
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  name text not null,
  contact_info text not null, -- email o teléfono
  message text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table contact_messages enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for all using (auth.role() = 'authenticated');

create policy "public read products" on products for select using (true);
create policy "admin write products" on products for all using (auth.role() = 'authenticated');

create policy "public read product_images" on product_images for select using (true);
create policy "admin write product_images" on product_images for all using (auth.role() = 'authenticated');

create policy "public insert contact_messages" on contact_messages for insert with check (true);
create policy "admin read contact_messages" on contact_messages for select using (auth.role() = 'authenticated');

-- Storage: bucket público de imágenes de producto

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "admin write product-images" on storage.objects
  for all using (bucket_id = 'product-images' and auth.role() = 'authenticated');
