-- Rebuild demo data: 3 branches, Jan 2024 to today, with growth and seasonality
truncate public.demo_orders;

alter table public.demo_orders
  add column branch text not null default 'Poblacion'
  check (branch in ('Poblacion', 'Port', 'Beachfront'));
alter table public.demo_orders alter column branch drop default;

select setseed(0.42);

insert into public.demo_orders (created_at, customer_id, item, category, qty, amount, channel, payment, branch)
select
  (day::date + time '07:00' + random() * interval '13 hours') at time zone 'Asia/Manila',
  case when random() < 0.3 then 1 + floor(random() * 150)::int
       else 151 + floor(random() * 5000)::int end,
  m.item, m.category, q.qty, m.price * q.qty,
  case when random() < 0.6 then 'pickup' else 'dine_in' end,
  case when random() < 0.55 then 'gcash' else 'cash' end,
  b.branch
from generate_series(date '2024-01-01', current_date, interval '1 day') as day
cross join (values
  ('Poblacion',  date '2024-01-01', 1.0),
  ('Port',       date '2024-07-01', 0.8),
  ('Beachfront', date '2025-03-01', 0.6)
) as b(branch, opened, size)
cross join lateral generate_series(1, (
    (25 + floor(random() * 20) + case when extract(dow from day) in (0, 6) then 15 else 0 end)
    * b.size
    * case extract(year from day) when 2024 then 0.8 when 2025 then 0.9 else 1.0 end
    * case extract(month from day) when 12 then 1.25 when 4 then 1.15 when 5 then 1.15 when 9 then 0.85 else 1.0 end
  )::int
) as n(i)
cross join lateral (
  select * from (values
    ('Spanish Latte', 'Coffee', 150), ('Americano', 'Coffee', 110),
    ('Caramel Macchiato', 'Coffee', 165), ('Matcha Latte', 'Non-coffee', 160),
    ('Iced Chocolate', 'Non-coffee', 140), ('Classic Burger', 'Food', 220),
    ('Clubhouse', 'Food', 195), ('Cheesecake Slice', 'Pastry', 130)
  ) as v(item, category, price)
  where n.i is not null          -- forces a fresh random pick per row
  order by random() limit 1
) as m
cross join lateral (select 1 + (random() < 0.2)::int as qty) as q
where day >= b.opened;

-- Monthly plan per branch, closed months only. Some months beat the plan, some miss it.
create table public.demo_targets (
  month date not null,
  branch text not null,
  target numeric(12, 2) not null,
  primary key (month, branch)
);

alter table public.demo_targets enable row level security;
grant select on public.demo_targets to service_role;

insert into public.demo_targets (month, branch, target)
select
  date_trunc('month', created_at at time zone 'Asia/Manila')::date,
  branch,
  round(sum(amount) * (0.92 + random() * 0.16), -3)
from public.demo_orders
where created_at < date_trunc('month', now() at time zone 'Asia/Manila') at time zone 'Asia/Manila'
group by 1, 2;