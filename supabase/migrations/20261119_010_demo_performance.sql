-- Performance tab: plan vs actual, YTD by year and category, branches this year vs last
create or replace function public.demo_performance()
returns json
language sql
stable
set timezone = 'Asia/Manila'
as $$
with a as (
  select
    max(created_at)::date as d,
    date_trunc('year', max(created_at))::date as y0,
    max(created_at)::date - date_trunc('year', max(created_at))::date as doy
  from public.demo_orders
),
monthly as (
  select date_trunc('month', o.created_at)::date as month, sum(o.amount) as actual
  from public.demo_orders o, a
  where o.created_at >= a.y0 and o.created_at < date_trunc('month', a.d)
  group by 1
),
targets as (
  select t.month, sum(t.target) as target
  from public.demo_targets t, a
  where t.month >= a.y0
  group by 1
),
ytd as (
  select extract(year from o.created_at)::int as year, o.category, sum(o.amount) as revenue
  from public.demo_orders o, a
  where o.created_at::date - date_trunc('year', o.created_at)::date <= a.doy
  group by 1, 2
),
branches as (
  select
    o.branch,
    coalesce(sum(o.amount) filter (where o.created_at >= a.y0), 0) as this_year,
    coalesce(sum(o.amount) filter (
      where o.created_at >= a.y0 - interval '1 year'
        and o.created_at::date <= (a.y0 - interval '1 year')::date + a.doy
    ), 0) as last_year
  from public.demo_orders o, a
  group by 1
)
select json_build_object(
  'anchor', (select d from a),
  'plan_vs_actual', (
    select json_agg(json_build_object('month', m.month, 'actual', m.actual, 'target', t.target) order by m.month)
    from monthly m join targets t using (month)
  ),
  'ytd', (select json_agg(y order by y.year, y.category) from ytd y),
  'branches', (select json_agg(b order by b.this_year desc) from branches b)
);
$$;

revoke execute on function public.demo_performance() from public, anon, authenticated;
grant execute on function public.demo_performance() to service_role;

-- Overview: same as before, but each day now carries the matching day from the previous period
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
      select
        g.day::date as day,
        coalesce(c.revenue, 0) as revenue,
        coalesce(c.orders, 0) as orders,
        coalesce(p.revenue, 0) as prev_revenue
      from anchor a
      cross join generate_series(a.d - (p_days - 1), a.d, interval '1 day') as g(day)
      left join (select created_at::date as d, sum(amount) as revenue, count(*) as orders from cur group by 1) c
        on c.d = g.day::date
      left join (select created_at::date as d, sum(amount) as revenue from prev group by 1) p
        on p.d = g.day::date - p_days
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
      select created_at, item, qty, amount, channel, payment, branch
      from cur order by created_at desc limit 8
    ) r
  )
);
$$;