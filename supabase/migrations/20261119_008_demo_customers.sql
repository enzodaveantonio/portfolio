-- Realistic mix: ~30% of orders from 150 regulars, the rest from a large pool of mostly one-time visitors
select setseed(0.7);

update public.demo_orders
set customer_id = case
  when random() < 0.3 then 1 + floor(random() * 150)::int
  else 151 + floor(random() * 5000)::int
end;