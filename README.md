# enzoantonio.com

My freelance site: services, café demo funnel, and a small admin panel.

**Stack:** Next.js 16 (App Router, Cache Components), React, Tailwind v4, Supabase (Postgres + Auth), Resend, Vercel.

- `/cafes`, `/contact`: lead forms via Server Actions → Supabase + email alert
- `/services`: prices from Supabase, cached with `cacheTag`, refreshed from admin
- `/admin`: Supabase Auth, leads pipeline, site settings
