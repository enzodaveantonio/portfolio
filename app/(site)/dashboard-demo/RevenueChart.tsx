"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

type Point = { day: string; revenue: number; orders: number; prev_revenue: number };

const fmtDay = (s: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(s + "T00:00:00Z"));
const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");

export default function RevenueChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="day" tickFormatter={fmtDay} minTickGap={24}
            tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v) => (v === 0 ? "₱0" : `₱${Math.round(v / 1000)}k`)} width={44}
            tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ stroke: "#9ca3af", strokeDasharray: "3 3" }} content={<ChartTip />} />
          <Legend verticalAlign="top" align="right" height={28} iconSize={10} wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>} />
          <Line dataKey="prev_revenue" name="Previous period" type="monotone"
            stroke="#9ca3af" strokeWidth={2} strokeDasharray="4 4" dot={false} activeDot={false} />
          <Line dataKey="revenue" name="This period" type="monotone"
            stroke="#15803d" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartTip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const change = p.prev_revenue ? (p.revenue - p.prev_revenue) / p.prev_revenue : null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm">
      <p className="font-semibold">{fmtDay(p.day)}</p>
      <p className="text-gray-700">This period: {peso(p.revenue)} · {p.orders} orders</p>
      <p className="text-gray-500">Previous: {peso(p.prev_revenue)}</p>
      {change !== null && (
        <p className={change >= 0 ? "text-green-700" : "text-red-600"}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}