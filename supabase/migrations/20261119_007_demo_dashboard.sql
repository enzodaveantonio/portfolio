-- Fictional café orders for the public dashboard demo
create table public.demo_orders (
  id bigint generated always as identity primary key,
  created_at timestamptz not null,
  customer_id int not null,
  item text not null,
  category text not null,
  qty int not null,
  amount numeric(10,2) not null,
  channel text not null check (channel in ('pickup', 'dine_in')),
  payment text not null check (payment in ('cash', 'gcash'))
);

alter table public.demo_orders enable row level security;
grant select on public.demo_orders to service_role;

-- 120 days of orders, busier on weekends, between 7am and 8pm Manila time
select setseed(0.42);

insert into public.demo_orders (created_at, customer_id, item, category, qty, amount, channel, payment)
select
  (day::date + time '07:00' + random() * interval '13 hours') at time zone 'Asia/Manila',
  1 + floor(random() * 400)::int,
  m.item, m.category, q.qty, m.price * q.qty,
  case when random() < 0.6 then 'pickup' else 'dine_in' end,
  case when random() < 0.55 then 'gcash' else 'cash' end
from generate_series(current_date - 119, current_date, interval '1 day') as day
cross join lateral generate_series(
  1, (35 + floor(random() * 25) + case when extract(dow from day) in (0, 6) then 20 else 0 end)::int
) as n(i)
cross join lateral (
  select * from (values
    ('Spanish Latte', 'Coffee', 150), ('Americano', 'Coffee', 110),
    ('Caramel Macchiato', 'Coffee', 165), ('Matcha Latte', 'Non-coffee', 160),
    ('Iced Chocolate', 'Non-coffee', 140), ('Classic Burger', 'Food', 220),
    ('Clubhouse', 'Food', 195), ('Cheesecake Slice', 'Pastry', 130)
  ) as v(item, category, price)
  where n.i is not null     -- forces a fresh random pick per row
  order by random() limit 1
) as m
cross join lateral (select 1 + (random() < 0.2)::int as qty) as q;

-- Everything the dashboard needs, aggregated in one call.
-- The window is anchored to the latest order, so the demo never goes stale.
create or replace function public.demo_dashboard(p_days int)
returns json
language sql
stable
set timezone = 'Asia/Manila'
as $$
with anchor as (
  select max(created_at)::date as d from public.demo_orders
),
cur as (
  select o.* from public.demo_orders o, anchor a
  where o.created_at >= a.d - (p_days - 1) and o.created_at < a.d + 1
),
prev as (
  select o.* from public.demo_orders o, anchor a
  where o.created_at >= a.d - (2 * p_days - 1) and o.created_at < a.d - (p_days - 1)
),
repeat_cur as (
  select count(*) filter (where n > 1)::numeric / nullif(count(*), 0) as r
  from (select customer_id, count(*) n from cur group by 1) c
),
repeat_prev as (
  select count(*) filter (where n > 1)::numeric / nullif(count(*), 0) as r
  from (select customer_id, count(*) n from prev group by 1) c
)
select json_build_object(
  'anchor', (select d from anchor),
  'kpis', json_build_object(
    'revenue',      (select coalesce(sum(amount), 0) from cur),
    'prev_revenue', (select coalesce(sum(amount), 0) from prev),
    'orders',       (select count(*) from cur),
    'prev_orders',  (select count(*) from prev),
    'repeat',       (select r from repeat_cur),
    'prev_repeat',  (select r from repeat_prev)
  ),
  'daily', (
    select json_agg(x order by x.day) from (
      select created_at::date as day, sum(amount) as revenue, count(*) as orders
      from cur group by 1
    ) x
  ),
  'top_items', (
    select json_agg(t) from (
      select item, sum(qty) as qty, sum(amount) as revenue
      from cur group by item order by revenue desc limit 6
    ) t
  ),
  'recent', (
    select json_agg(r) from (
      select created_at, item, qty, amount, channel, payment
      from cur order by created_at desc limit 8
    ) r
  )
);
$$;

revoke execute on function public.demo_dashboard(int) from public, anon, authenticated;
grant execute on function public.demo_dashboard(int) to service_role;

select public.demo_dashboard(30);