alter table public.leads rename column town to location;
alter table public.leads rename column contact to phone;
alter table public.leads add column messenger_url text;