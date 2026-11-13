create table public.services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  summary text not null,
  features text[] not null default '{}',
  audience text not null check (audience in ('local', 'international')),
  currency text not null check (currency in ('PHP', 'USD')),
  price numeric(10,2),                -- null = "Custom quote"
  price_prefix text,                  -- e.g. 'From', 'Setup'
  price_note text,                    -- e.g. '+ ₱1,500/month'
  need text not null check (need in ('cafe_demo','build_or_fix','dashboard','other')),
  sort_order int not null default 0,
  is_active boolean not null default true
);
alter table public.services enable row level security;
grant select, insert, update, delete on table public.services to service_role;

-- Know which package a lead came from
alter table public.leads add column service text;

insert into public.services
  (slug, title, summary, features, audience, currency, price, price_prefix, price_note, need, sort_order)
values 
  ('cafe-app', 'Ordering & loyalty app for your café',
  'Your own branded app: order-ahead, digital stamp cards and a staff panel.',
  array['Customer app with your logo, colors and menu', 'Order-ahead for pickup, with push notifications', 'Digital stamp cards and vouchers', 'Staff panel: live orders, payment checks, daily cash log','Android, published under your business'],
  'local', 'PHP', 5000, 'Setup', '+ ₱1,500/month for hosting, updates and support', 'cafe_demo', 10),

  ('business-dashboard', 'Dashboard for your business data',
   'Sales, orders and expenses in one live view, instead of five spreadsheets.',
   array['Built around the numbers you actually check','Daily, weekly and monthly views','Charts your team can read at a glance','Access only for the people you choose'],
   'local', 'PHP', null, null, null, 'dashboard', 20),

  ('play-publishing', 'Publish your Expo app on Google Play',
   'From production build to store listing, Data Safety and closed testing.',
   array['EAS production build (.aab)','Play Console setup and store listing','Data Safety and content rating','Google Sign-In fixes for Play signing'],
   'international', 'USD', 60, 'From', null, 'build_or_fix', 30),

  ('supabase-backend', 'Supabase backend for your Expo app',
   'Auth, a well-designed Postgres database and row-level security.',
   array['Email and Google login','Schema designed around your app','Security rules for every user role','Handover doc for your team'],
   'international', 'USD', 150, 'From', null, 'build_or_fix', 40),

  ('expo-fix', 'Fix or upgrade your Expo app',
   'Build errors, crashes and SDK upgrades, fixed and explained.',
   array['Bug found, fixed and tested on a real device','Expo SDK upgrades','A short note on what broke and why'],
   'international', 'USD', 40, 'From', null, 'build_or_fix', 50),

  ('ordering-app', 'Ordering & loyalty app (international)',
   'The same café app, built for your business anywhere.',
   array['Customer app, staff panel and backend','Loyalty stamps and vouchers','Android first'],
   'international', 'USD', 1200, 'From', null, 'build_or_fix', 60);