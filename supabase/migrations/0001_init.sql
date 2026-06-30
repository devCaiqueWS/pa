-- =============================================================================
-- Pierre Alexander — Schema do CMS do site (Fase 2, escopo revisado)
-- Rode no Supabase: SQL Editor → cole tudo → Run.
-- Escopo: CONTEÚDO DO SITE (catálogo/vitrine + banners) + login de admin.
-- NÃO é um CRM — pedidos/clientes/consultoras vivem no ERP (ofc_/Bling).
-- =============================================================================

-- ---------- Papéis (quem acessa o CMS) ---------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'editor', 'viewer');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        public.user_role not null default 'viewer',
  created_at  timestamptz not null default now()
);

-- Função SECURITY DEFINER: checa admin sem disparar RLS (evita recursão).
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','editor')
  );
$$;

-- Cria perfil automaticamente quando um usuário se cadastra.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Catálogo (vitrine do site) ---------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  tagline     text,
  image       text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.subcategories (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.categories(id) on delete cascade,
  slug         text not null,
  name         text not null,
  position     int not null default 0,
  unique (category_id, slug)
);

create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  category_id      uuid references public.categories(id) on delete set null,
  subcategory_id   uuid references public.subcategories(id) on delete set null,
  line             text,
  gender           text,
  family           text,
  short_desc       text,
  image            text,
  badges           text[] not null default '{}',
  featured         boolean not null default false,
  is_new           boolean not null default false,
  active           boolean not null default true,
  position         int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ---------- Banners (carrossel/hero do site) ---------------------------------
create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  subtitle    text,
  eyebrow     text,
  image       text,
  cta_label   text,
  cta_href    text,
  position    int not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- =============================================================================
-- RLS — catálogo/banners têm leitura pública (site); escrita só admin/editor.
-- =============================================================================
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.subcategories enable row level security;
alter table public.products      enable row level security;
alter table public.banners       enable row level security;

create policy "profiles_self_read"   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid() or public.is_admin());

create policy "categories_public_read"   on public.categories    for select using (true);
create policy "categories_admin_write"    on public.categories    for all using (public.is_admin()) with check (public.is_admin());
create policy "subcategories_public_read" on public.subcategories for select using (true);
create policy "subcategories_admin_write" on public.subcategories for all using (public.is_admin()) with check (public.is_admin());
create policy "products_public_read"      on public.products      for select using (true);
create policy "products_admin_write"      on public.products      for all using (public.is_admin()) with check (public.is_admin());
create policy "banners_public_read"       on public.banners       for select using (active or public.is_admin());
create policy "banners_admin_write"       on public.banners       for all using (public.is_admin()) with check (public.is_admin());
