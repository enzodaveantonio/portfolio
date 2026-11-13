Got it. A personal admin panel is a good idea: it’s useful to you every day, and it doubles as a real example of what a client’s admin side looks like. Showing it to the LGU as an example is completely fine. The one rule from before still applies: the introduction and any procurement go through you, not your brother.

The homepage is tonight’s task, and the admin panel is tomorrow’s.

Homepage: app/page.tsx

The video’s rule is who you are, what you do, and why it matters, within 10 seconds. The hero answers all three in two lines.

Save hero-phones.png to public/home/hero-phones.png (it has a transparent background).

import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Apps for cafés & restaurants",
    body: "Order-ahead, loyalty stamps and a staff panel, branded as your own.",
    href: "/cafes",
    cta: "Get a free demo",
  },
  {
    title: "Expo apps, built or fixed",
    body: "New React Native apps, bug fixes, SDK upgrades and Google Play publishing.",
    href: "/services",
    cta: "See packages",
  },
  {
    title: "Dashboards for your data",
    body: "See your sales, orders and operations at a glance, without digging through spreadsheets.",
    href: "/services",
    cta: "See packages",
  },
];

export default function Home() {
  return (
    <main>
      {/* 1. Hero: fills the first screen */}
      <section className="mx-auto grid min-h-[85svh] max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-green-800">
            <span className="h-2 w-2 rounded-full bg-green-700" />
            React Native developer · Siquijor
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            I build apps that bring your customers back.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-gray-700">
            Ordering, loyalty and admin apps for cafés and small businesses, designed, built and shipped by one
            developer you can actually talk to.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cafes" className="rounded-full bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900">
              Get a free demo
            </Link>
            <Link href="/services" className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:border-gray-900">
              See services
            </Link>
          </div>
        </div>
        <Image
          src="/home/hero-phones.png"
          alt="Brew-ha customer app and staff order panel"
          width={1200}
          height={1200}
          priority
          className="mx-auto w-full max-w-md md:max-w-none"
        />
      </section>

      {/* 2. Three columns: what I do */}
      <section className="bg-stone-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight">What I do</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="flex flex-col rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-3 flex-1 text-gray-700">{s.body}</p>
                <Link href={s.href} className="mt-6 font-semibold text-green-800 hover:underline">
                  {s.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main content: proof */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <Image
          src="/cafes/ordering.png"
          alt="Brew-ha ordering screens"
          width={1600}
          height={1200}
          className="rounded-2xl"
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-green-800">Case study</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Brew-ha Cafe &amp; Bar</h2>
          <p className="mt-4 text-gray-700">
            A café in Siquijor needed a better way to take orders and keep regulars coming back. I designed and built
            their app solo: order-ahead, digital stamp cards, and a staff panel for live orders, payments and daily
            cash.
          </p>
          <p className="mt-3 text-sm text-gray-500">React Native · Expo · Supabase</p>
          <Link href="/work/brewha" className="mt-6 inline-block font-semibold text-green-800 hover:underline">
            Read the case study →
          </Link>
        </div>
      </section>
    </main>
  );
}

Check app/layout.tsx first: if it wraps {children} in a narrow container like max-w-3xl, the homepage can’t go wide and every section gets squeezed. The layout should only hold the nav, {children} and the footer. Each page sets its own width (your other pages already use their own <main className="mx-auto max-w-3xl …">).

In the nav, add Services (/services) and For cafés (/cafes). Turn Contact into a button: rounded-full bg-green-800 px-4 py-2 text-white. That’s the top-right call to action in the video’s example.

Check one claim: “I build apps that bring your customers back” is a promise about what the apps do (loyalty), not a result you’ve measured. That’s acceptable, but if it feels like too much, use “I build ordering and loyalty apps for small businesses.”

Tomorrow: the admin panel (/admin)
Login: Supabase Auth, restricted to your email only.
Dashboard: KPI cards (new leads this week, demos shown, won) and charts (leads per week, leads by status) with Recharts.
Leads: a table with a status dropdown.
Services: add, edit and hide your packages and prices. /services reads from this table, so changing a price never needs a code push.

Push the homepage tonight, preview it on your phone tomorrow morning, then post at 8. Get some sleep.