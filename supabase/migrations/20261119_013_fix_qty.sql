-- Fix: qty was always 1 because its random() ran only once. About 20% of orders now have 2 units.
select setseed(0.13);

update public.demo_orders
set qty = 2, amount = amount * 2
where random() < 0.2;

-- Targets were generated from the old amounts, so rebuild them
truncate public.demo_targets;

insert into public.demo_targets (month, branch, target)
select
  date_trunc('month', created_at at time zone 'Asia/Manila')::date,
  branch,
  round((sum(amount) * (0.92 + random() * 0.16))::numeric, -3)
from public.demo_orders
where created_at < date_trunc('month', now() at time zone 'Asia/Manila') at time zone 'Asia/Manila'
group by 1, 2;

insert into public.demo_targets (month, branch, target)
select (t.month + interval '1 year')::date, t.branch, round(t.target * 1.10, -3)
from public.demo_targets t
where t.month >= (date_trunc('month', now() at time zone 'Asia/Manila') - interval '1 year')::date
  and t.month <  date_trunc('year', now() at time zone 'Asia/Manila')::date
on conflict do nothing;