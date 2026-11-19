"use client";

import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from "recharts";

type Row = { month: string; actual: number | null; target: number | null; partial: boolean };

const fmtMonth = (s: string, long = false) =>
  new Intl.DateTimeFormat("en-US", { month: long ? "long" : "short", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));
const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");

export default function PlanChart({ data }: { data: Row[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="month" tickFormatter={(s) => fmtMonth(s)}
            tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v) => (v === 0 ? "₱0" : `₱${Math.round(v / 1000)}k`)} width={52}
            tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: "#f3f4f6" }} content={<Tip />} />
          <Legend verticalAlign="top" align="right" height={28} iconSize={10} wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>} />
          <Bar dataKey="actual" name="Actual" fill="#15803d" radius={[4, 4, 0, 0]} maxBarSize={36}>
            {data.map((d) => (
              <Cell key={d.month} fill="#15803d" fillOpacity={d.partial ? 0.4 : 1} />
            ))}
          </Bar>
          <Line dataKey="target" name="Target" type="linear" stroke="#52514e" strokeWidth={2}
            strokeDasharray="4 4" dot={{ r: 3, fill: "#52514e", strokeWidth: 0 }} activeDot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function Tip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  const variance = r.actual != null && r.target && !r.partial ? (r.actual - r.target) / r.target : null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-semibold">
        {fmtMonth(r.month, true)}
        {r.partial && <span className="font-normal text-gray-500"> · month to date</span>}
      </p>
      <p className="text-gray-700">Actual: {r.actual != null ? peso(r.actual) : "not yet"}</p>
      <p className="text-gray-500">Target: {r.target != null ? peso(r.target) : "—"}</p>
      {variance !== null && (
        <p className={variance >= 0 ? "text-green-700" : "text-red-600"}>
          {variance >= 0 ? "▲" : "▼"} {Math.abs(variance * 100).toFixed(1)}% vs target
        </p>
      )}
    </div>
  );
}