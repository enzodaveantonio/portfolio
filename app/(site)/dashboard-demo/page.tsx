import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import RevenueChart from "./RevenueChart";
import PlanChart from "./PlanChart";
import YtdChart from "./YtdChart";
import { CATEGORIES } from "./categories";
import DataTable, { type Leaf } from "./DataTable";

export const metadata: Metadata = {
  title: "Dashboard demo · Enzo Antonio",
  description: "A live sample dashboard: KPIs, trends, targets and year-over-year, aggregated in SQL.",
};

type Overview = {
  anchor: string;
  kpis: {
    revenue: number; prev_revenue: number;
    orders: number; prev_orders: number;
    repeat: number | null; prev_repeat: number | null;
  };
  daily: { day: string; revenue: number; orders: number; prev_revenue: number }[];
  top_items: { item: string; qty: number; revenue: number }[];
  recent: { created_at: string; item: string; qty: number; amount: number; channel: string; payment: string; branch: string }[];
};

type Performance = {
  anchor: string;
  plan_vs_actual: { month: string; actual: number | null; target: number | null; partial: boolean }[];
  ytd: { year: number; category: string; revenue: number }[];
  branches: { branch: string; this_year: number; last_year: number }[];
};

const RANGES = [7, 30, 90] as const;

async function getOverview(days: number) {
  "use cache";
  cacheLife("hours");
  const { data, error } = await supabaseAdmin.rpc("demo_dashboard", { p_days: days });
  if (error) throw error;
  return data as Overview;
}

async function getPerformance() {
  "use cache";
  cacheLife("hours");
  const { data, error } = await supabaseAdmin.rpc("demo_performance");
  if (error) throw error;
  return data as Performance;
}

async function getMatrix(year: number) {
  "use cache";
  cacheLife("hours");
  const { data, error } = await supabaseAdmin.rpc("demo_matrix", { p_year: year });
  if (error) throw error;
  return (data ?? []) as Leaf[];
}

const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");
const fmtDay = (s: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));
const fmtMonth = (s: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));
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

type Params = Promise<{ range?: string; tab?: string; year?: string }>;

export default function DashboardDemoPage({ searchParams }: { searchParams: Params }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-800">Live demo · generated data</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Sample Café dashboard</h1>
      <p className="mt-3 max-w-2xl text-gray-700">
        A fictional café with three branches and about 80,000 generated orders since 2024. Every number here is
        aggregated in Postgres by SQL functions, the same way I&rsquo;d build it on your real data.
      </p>

      <Suspense fallback={<p className="mt-10 text-gray-500">Loading dashboard...</p>}>
        <Content searchParams={searchParams} />
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

async function Content({ searchParams }: { searchParams: Params }) {
  const { range, tab, year } = await searchParams;
  const current = tab === "performance" || tab === "data" ? tab : "overview";
  const days = RANGES.includes(Number(range) as (typeof RANGES)[number]) ? Number(range) : 30;

  return (
    <>
      <nav className="mt-10 flex gap-6 border-b border-gray-200 text-sm">
        <TabLink href="/dashboard-demo" active={current === "overview"}>Overview</TabLink>
        <TabLink href="/dashboard-demo?tab=performance" active={current === "performance"}>Performance</TabLink>
        <TabLink href="/dashboard-demo?tab=data" active={current === "data"}>Data</TabLink>
      </nav>
      {current === "performance" && <PerformanceView />}
      {current === "data" && <DataView year={year} />}
      {current === "overview" && <OverviewView days={days} />}
    </>
  );
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const base = "rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-green-800";
  return (
    <Link href={href} scroll={false}
      className={`${base} ${active
        ? "-mb-px border-b-2 border-green-800 pb-3 font-semibold text-green-800"
        : "pb-3 text-gray-600 hover:text-black"}`}>
      {children}
    </Link>
  );
}

/* ---------------- Overview ---------------- */

async function OverviewView({ days }: { days: number }) {
  const d = await getOverview(days);
  const k = d.kpis;
  const aov = k.orders ? k.revenue / k.orders : 0;
  const prevAov = k.prev_orders ? k.prev_revenue / k.prev_orders : 0;
  const maxItem = Math.max(...d.top_items.map((t) => t.revenue));

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Last {days} days, up to {fmtDay(d.anchor)} · all branches</p>
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

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Revenue" value={peso(k.revenue)} change={pct(k.revenue, k.prev_revenue)} />
        <Kpi label="Orders" value={k.orders.toLocaleString("en-PH")} change={pct(k.orders, k.prev_orders)} />
        <Kpi label="Avg. order value" value={peso(aov)} change={pct(aov, prevAov)} />
        <Kpi label="Repeat customers" value={`${Math.round((k.repeat ?? 0) * 100)}%`} change={pts(k.repeat, k.prev_repeat)} />
      </div>

      <Card title="Revenue per day" className="mt-6">
        <RevenueChart data={d.daily} />
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Top items by revenue">
          <ul className="space-y-3">
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
        </Card>

        <Card title="Recent orders">
          <ol className="space-y-4 border-l border-gray-200 pl-4">
            {d.recent.map((o, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-700 ring-2 ring-white" />
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{o.qty}× {o.item}</span>
                  <span>{peso(o.amount)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {fmtTime(o.created_at)} · {o.branch} · {o.channel === "pickup" ? "Pickup" : "Dine-in"} ·{" "}
                  {o.payment === "gcash" ? "GCash" : "Cash"}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}

/* ---------------- Performance ---------------- */

async function PerformanceView() {
  const p = await getPerformance();
  const year = new Date(p.anchor + "T00:00:00Z").getUTCFullYear();

  // Plan vs actual: closed months only for the variance, so a partial month can't fake a miss
  const closed = p.plan_vs_actual.filter((m) => m.actual != null && m.target != null && !m.partial);
  const closedActual = closed.reduce((s, m) => s + Number(m.actual), 0);
  const closedTarget = closed.reduce((s, m) => s + Number(m.target), 0);
  const fullYearTarget = p.plan_vs_actual.reduce((s, m) => s + Number(m.target ?? 0), 0);
  const lastClosed = closed.at(-1)?.month;

  // YTD by year × category → one row per year for the stacked chart
  const years = [...new Set(p.ytd.map((y) => y.year))].sort();
  const ytdRows = years.map((yr) => {
    const row: Record<string, number | string> = { year: String(yr) };
    let total = 0;
    for (const c of CATEGORIES) {
      const v = Number(p.ytd.find((y) => y.year === yr && y.category === c.key)?.revenue ?? 0);
      row[c.key] = v;
      total += v;
    }
    row.total = total;
    return row as { year: string; total: number } & Record<string, number | string>;
  });

  const maxBranch = Math.max(...p.branches.flatMap((b) => [Number(b.this_year), Number(b.last_year)]));

  return (
    <>
      <p className="mt-6 text-sm text-gray-500">{year} so far, up to {fmtDay(p.anchor)} · all branches</p>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label={`Actual, Jan–${lastClosed ? fmtMonth(lastClosed) : ""}`} value={peso(closedActual)} />
        <Kpi label={`Plan, Jan–${lastClosed ? fmtMonth(lastClosed) : ""}`} value={peso(closedTarget)} />
        <Kpi label="Variance to plan" value={`${closedActual >= closedTarget ? "+" : "−"}${peso(Math.abs(closedActual - closedTarget))}`}
          change={pct(closedActual, closedTarget)} changeLabel="vs plan" />
        <Kpi label={`Full-year plan ${year}`} value={peso(fullYearTarget)} />
      </div>

      <Card title="Monthly revenue vs target" className="mt-6"
        note="The faded bar is the current month to date. Variance counts closed months only.">
        <PlanChart data={p.plan_vs_actual} />
      </Card>

      <Card title="Year to date, same period each year" className="mt-6"
        note={`Each bar covers Jan 1 to ${fmtDay(p.anchor)} of that year, so the years compare fairly.`}>
        <YtdChart data={ytdRows} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="py-1 text-left font-normal">Category</th>
                {ytdRows.map((r) => <th key={r.year} className="py-1 font-normal">{r.year}</th>)}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((c) => (
                <tr key={c.key} className="border-t border-gray-100">
                  <td className="py-1.5 text-left">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                    {c.key}
                  </td>
                  {ytdRows.map((r) => <td key={r.year} className="py-1.5">{peso(Number(r[c.key]))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Branches: this year vs last year" className="mt-6"
        note={`Same period (Jan 1 to ${fmtDay(p.anchor)}). Beachfront opened March ${year - 1}, so its growth is overstated.`}>
        <div className="mb-4 flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-green-700" /> {year}</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-gray-300" /> {year - 1}</span>
        </div>
        <ul className="space-y-5">
          {p.branches.map((b) => {
            const g = Number(b.last_year) ? (Number(b.this_year) - Number(b.last_year)) / Number(b.last_year) : null;
            return (
              <li key={b.branch}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{b.branch}</span>
                  <span className="text-gray-700">
                    {peso(Number(b.this_year))}{" "}
                    {g !== null && (
                      <span className={g >= 0 ? "text-green-700" : "text-red-600"}>
                        {g >= 0 ? "▲" : "▼"} {Math.abs(g * 100).toFixed(0)}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  <div className="h-2.5 rounded-full bg-green-700" title={`${year}: ${peso(Number(b.this_year))}`}
                    style={{ width: `${(Number(b.this_year) / maxBranch) * 100}%` }} />
                  <div className="h-2.5 rounded-full bg-gray-300" title={`${year - 1}: ${peso(Number(b.last_year))}`}
                    style={{ width: `${(Number(b.last_year) / maxBranch) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

/* ---------------- Data ---------------- */

async function DataView({ year }: { year?: string }) {
  const p = await getPerformance();
  const years = [...new Set(p.ytd.map((y) => y.year))].sort();
  const selected = years.includes(Number(year)) ? Number(year) : years[years.length - 1];

  const rows = await getMatrix(selected);

  // Reconcile against the YTD chart: same window, so the totals must match to the peso
  const matrixTotal = rows.reduce((s, r) => s + Number(r.revenue), 0);
  const chartTotal = p.ytd.filter((y) => y.year === selected).reduce((s, y) => s + Number(y.revenue), 0);
  const matches = Math.abs(matrixTotal - chartTotal) < 0.01;

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">Jan 1 to {fmtDay(p.anchor)}, {selected} · all branches</p>
        <div className="flex items-center gap-3">
          <div className="flex rounded-full border border-gray-200 p-1 text-sm">
            {years.map((y) => (
              <Link key={y} href={`/dashboard-demo?tab=data&year=${y}`} scroll={false}
                className={y === selected
                  ? "rounded-full bg-green-800 px-3 py-1 font-semibold text-white"
                  : "rounded-full px-3 py-1 text-gray-600 hover:text-black"}>
                {y}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Card title="Revenue explorer" className="mt-6"
        note="Choose the fields to break the rows down by. Export downloads exactly what's on screen.">
        <DataTable rows={rows} year={selected} />
        <p className={`mt-4 text-sm ${matches ? "text-green-700" : "text-red-600"}`}>
          {matches
            ? `✓ Total ${peso(matrixTotal)} matches the year-to-date chart on the Performance tab.`
            : `⚠ Total ${peso(matrixTotal)} doesn't match the year-to-date chart (${peso(chartTotal)}).`}
        </p>
      </Card>
    </>
  );
}

/* ---------------- Shared ---------------- */

function Card({ title, note, className = "", children }: {
  title: string; note?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-gray-200 p-5 ${className}`}>
      <h2 className="font-bold">{title}</h2>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Kpi({ label, value, change, changeLabel = "vs prev." }: {
  label: string; value: string; change?: Change; changeLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      {change && (
        <p className={`mt-1 text-sm font-semibold ${change.up ? "text-green-700" : "text-red-600"}`}>
          {change.up ? "▲" : "▼"} {change.text} <span className="font-normal text-gray-500">{changeLabel}</span>
        </p>
      )}
    </div>
  );
}