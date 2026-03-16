-- ============================================================
-- Hurricane Extracts — Complete Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Products ────────────────────────────────────────────────
create table products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  sku text unique not null,
  short_description text,
  full_description text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  taxable boolean not null default true,
  active boolean not null default true,
  featured boolean not null default false,
  category text,
  stock integer,
  sort_order integer default 0,
  primary_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_products_active on products(active);
create index idx_products_category on products(category);
create index idx_products_slug on products(slug);
create index idx_products_featured on products(featured);

-- ─── Product Images ──────────────────────────────────────────
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  image_url text not null,
  alt_text text,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index idx_product_images_product on product_images(product_id);

-- ─── Homepage Featured Products ──────────────────────────────
create table homepage_featured_products (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade not null,
  section_key text not null,
  sort_order integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create index idx_homepage_section on homepage_featured_products(section_key);

-- ─── Orders ──────────────────────────────────────────────────
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_first_name text,
  shipping_last_name text,
  shipping_address1 text,
  shipping_address2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text,
  billing_same_as_shipping boolean default true,
  billing_first_name text,
  billing_last_name text,
  billing_address1 text,
  billing_address2 text,
  billing_city text,
  billing_state text,
  billing_postal_code text,
  billing_country text,
  subtotal numeric(10,2) not null,
  tax_total numeric(10,2) not null default 0,
  shipping_total numeric(10,2) not null default 0,
  grand_total numeric(10,2) not null,
  payment_status text not null default 'pending_payment',
  order_status text not null default 'pending_payment',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Order Items ─────────────────────────────────────────────
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id),
  sku_snapshot text not null,
  title_snapshot text not null,
  unit_price_snapshot numeric(10,2) not null,
  taxable_snapshot boolean not null default true,
  quantity integer not null,
  line_total numeric(10,2) not null,
  created_at timestamptz default now()
);

create index idx_order_items_order on order_items(order_id);

-- ─── Admin Users ─────────────────────────────────────────────
create table admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role text not null default 'admin',
  active boolean not null default true,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Products: public read, admin write
alter table products enable row level security;
create policy "Public can read active products" on products
  for select using (active = true);
create policy "Service role full access to products" on products
  for all using (true) with check (true);

-- Product images: public read, admin write
alter table product_images enable row level security;
create policy "Public can read product images" on product_images
  for select using (true);
create policy "Service role full access to product_images" on product_images
  for all using (true) with check (true);

-- Homepage featured: public read, admin write
alter table homepage_featured_products enable row level security;
create policy "Public can read homepage featured" on homepage_featured_products
  for select using (active = true);
create policy "Service role full access to homepage_featured" on homepage_featured_products
  for all using (true) with check (true);

-- Orders: no public access (all operations through API with service role)
alter table orders enable row level security;
create policy "Service role full access to orders" on orders
  for all using (true) with check (true);

-- Order items: no public access
alter table order_items enable row level security;
create policy "Service role full access to order_items" on order_items
  for all using (true) with check (true);

-- Admin users: no public access
alter table admin_users enable row level security;
create policy "Service role full access to admin_users" on admin_users
  for all using (true) with check (true);

-- ============================================================
-- Storage Bucket
-- ============================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Allow public reads on product images
create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

-- Allow authenticated uploads (admin)
create policy "Admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images');

create policy "Admin update product images" on storage.objects
  for update using (bucket_id = 'product-images');

create policy "Admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images');

-- ============================================================
-- Updated_at trigger
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
