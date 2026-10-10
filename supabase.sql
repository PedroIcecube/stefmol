-- Ejecuta este script en Supabase > SQL Editor.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  category text default 'Juguetes',
  price numeric(12,2) not null check (price >= 0),
  image_url text default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Bucket público para mostrar fotos en la tienda.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880;

-- La tienda usa rutas de servidor para consultar y escribir; no expongas la service role key.
alter table public.products enable row level security;
-- No se crean políticas públicas: el backend de Next.js usa la clave service role exclusivamente en servidor.
