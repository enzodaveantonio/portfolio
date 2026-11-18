-- One row of site-wide pricing settings
create table public.site_settings (
  id int primary key default 1 check (id = 1),           -- only ever one row
  ph_discount numeric(3,2) not null default 0.60 check (ph_discount between 0 and 0.9),
  php_per_usd numeric(6,2) not null,                      -- you set this
  founding_slots_left int not null default 3 check (founding_slots_left >= 0),
  founding_offer text
);
alter table public.site_settings enable row level security;
grant select, insert, update, delete on table public.site_settings to service_role;

insert into public.site_settings (id, php_per_usd, founding_offer)
values (1, 58.00, 'Founding café offer: setup at a special rate for my first 3 cafés.');

-- Everything is USD now: one list, no audience split
alter table public.services drop column audience;
alter table public.services drop column currency;
alter table public.services add column monthly_price numeric(10,2);

update public.services
set price = 1200, price_prefix = 'Setup', price_note = null, monthly_price = 65
where slug = 'cafe-app';

-- The café app now covers this, so hide the duplicate
update public.services set is_active = false where slug = 'ordering-app';