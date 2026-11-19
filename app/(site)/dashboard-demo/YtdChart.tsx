"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { CATEGORIES } from "./categories";

type Row = { year: string; total: number } & Record<string, number | string>;

const millions = (v: number) => (v === 0 ? "₱0" : `₱${(v / 1_000_000).toFixed(1)}M`);
const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");

export default function YtdChart({ data }: { data: Row[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={millions} width={52}
            tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "#f3f4f6" }} content={<Tip />} />
          {CATEGORIES.map((c, i) => (
            <Bar key={c.key} dataKey={c.key} stackId="ytd" fill={c.color} stroke="#ffffff" strokeWidth={2}
              maxBarSize={80} radius={i === CATEGORIES.length - 1 ? [4, 4, 0, 0] : undefined}>
              {i === CATEGORIES.length - 1 && (
                <LabelList dataKey="total" position="top" formatter={(v) => millions(Number(v))}
                  style={{ fontSize: 12, fill: "#111827", fontWeight: 600 }} />
              )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Tip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-semibold">{r.year}</p>
      {[...CATEGORIES].reverse().map((c) => (
        <p key={c.key} className="flex items-center gap-2 text-gray-700">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
          {c.key}: {peso(Number(r[c.key]))}
        </p>
      ))}
      <p className="mt-1 font-semibold">Total: {peso(r.total)}</p>
    </div>
  );
}