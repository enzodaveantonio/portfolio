alter table public.leads add column need text not null default 'cafe_demo'
  check (need in ('cafe_demo','build_or_fix','dashboard','other'));