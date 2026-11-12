-- 1. Craete the table
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null,
  town text,
  facebook_url text,
  contact text not null,
  source text not null default 'website',
  status text not null default 'new'
    check (status in ('new','building_demo','demo_shown','won','lost'))
);

-- 2. Lock it down (automatic RLS probably did this already, but being explicit is harmless)
alter table public.leads enable row level security;

-- 3. Only the server can touch it
grant select, insert, update, delete on table public.leads to service_role;