import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import RevenueChart from "./RevenueChart";

export const metadata: Metadata = {
  title: "Dashboard demo · Enzo Antonio",
  description: "A live sample dashboard: KPIs, trends and recent activity, aggregated in SQL.",
};

type Dashboard = {
  anchor: string;
  kpis: {
    revenue: number; prev_revenue: number;
    orders: number; prev_orders: number;
    repeat: number | null; prev_repeat: number | null;
  };
  daily: { day: string; revenue: number; orders: number }[];
  top_items: { item: string; qty: number; revenue: number }[];
  recent: { created_at: string; item: string; qty: number; amount: number; channel: string; payment: string }[];
};

const RANGES = [7, 30, 90] as const;

async function getDashboard(days: number) {
    "use cache";
    cacheLife("hours");
    const { data, error } = await supabaseAdmin.rpc("demo_dashboard", { p_days: days });
    if (error) throw error;
    return data as Dashboard;
}

const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");
const fmtDay = (s: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));
const fmtTime = (s: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" }).format(new Date(s));

type Change = { up: boolean; text: string } | undefined;
function pct(cur: number, prev: number): Change {
  if (!prev) return undefined;
  const c = (cur - prev) / prev;
  return { up: c >= 0, text: `${Math.abs(c * 100).toFixed(1)}%` };
}
function pts(cur: number | null, prev: number | null): Change {
  if (cur == null || prev == null) return undefined;
  const c = (cur - prev) * 100;
  return { up: c >= 0, text: `${Math.abs(c).toFixed(1)} pts` };
}

export default function DashboardDemoPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
    return (
        <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-800">Live demo · generated data</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Sample Café dashboard</h1>
            <p className="mt-3 max-w-2xl text-gray-700">
                A fictional café with about 6,000 generated orders. Every number here is aggregated in Postgres by one
                SQL function, the same way I&rsquo;d build it on your real data.
            </p>

            <Suspense fallback={<p className="mt-10 text-gray-500">Loading dashboard...</p>}>
                <DashboardView searchParams={searchParams} />
            </Suspense>

            <p className="mt-16 text-center text-gray-600">
                Want this on your own numbers?{" "}
                <Link href="/contact?need=dashboard&service=business-dashboard" className="font-semibold text-green-800 underline">
                    Tell me what you track
                </Link>
                .
            </p>
        </main>
    );
}

async function DashboardView({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
    const { range } = await searchParams;
  const days = RANGES.includes(Number(range) as (typeof RANGES)[number]) ? Number(range) : 30;
  const d = await getDashboard(days);
  const k = d.kpis;

  const aov = k.orders ? k.revenue / k.orders : 0;
  const prevAov = k.prev_orders ? k.prev_revenue / k.prev_orders : 0;
  const maxItem = Math.max(...d.top_items.map((t) => t.revenue));

  return (
    <>
        {/* Filter row */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Last {days} days, up to {fmtDay(d.anchor)}</p>
        <div className="flex rounded-full border border-gray-200 p-1 text-sm">
          {RANGES.map((r) => (
            <Link key={r} href={`/dashboard-demo?range=${r}`} scroll={false}
              className={r === days
                ? "rounded-full bg-green-800 px-3 py-1 font-semibold text-white"
                : "rounded-full px-3 py-1 text-gray-600 hover:text-black"}>
              {r}d
            </Link>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Revenue" value={peso(k.revenue)} change={pct(k.revenue, k.prev_revenue)} />
        <Kpi label="Orders" value={k.orders.toLocaleString("en-PH")} change={pct(k.orders, k.prev_orders)} />
        <Kpi label="Avg. order value" value={peso(aov)} change={pct(aov, prevAov)} />
        <Kpi label="Repeat customers" value={`${Math.round((k.repeat ?? 0) * 100)}%`} change={pts(k.repeat, k.prev_repeat)} />
      </div>

      {/* Trend */}
      <section className="mt-6 rounded-2xl border border-gray-200 p-5">
        <h2 className="font-bold">Revenue per day</h2>
        <div className="mt-4">
          <RevenueChart data={d.daily} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top items */}
        <section className="rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold">Top items by revenue</h2>
          <ul className="mt-4 space-y-3">
            {d.top_items.map((t) => (
              <li key={t.item} title={`${t.qty} sold · ${peso(t.revenue)}`}>
                <div className="flex justify-between text-sm">
                  <span>{t.item}</span>
                  <span className="text-gray-600">{peso(t.revenue)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-green-700" style={{ width: `${(t.revenue / maxItem) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline */}
        <section className="rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold">Recent orders</h2>
          <ol className="mt-4 space-y-4 border-l border-gray-200 pl-4">
            {d.recent.map((o, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-700 ring-2 ring-white" />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{o.qty}× {o.item}</span>
                  <span>{peso(o.amount)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {fmtTime(o.created_at)} · {o.channel === "pickup" ? "Pickup" : "Dine-in"} · {o.payment === "gcash" ? "GCash" : "Cash"}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}

function Kpi({ label, value, change }: { label: string; value: string; change: Change }) {
    return (
        <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
            {change && (
                <p className={`mt-1 text-sm font-semibold ${change.up ? "text-green-700" : "text-red-600"}`}>
                    {change.up ? "▲" : "▼"} {change.text}{" "}
                    <span className="font-normal text-gray-500">vs prev.</span>
                </p>
            )}
        </div>
    );
}