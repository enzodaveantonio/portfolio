"use client";

import { useMemo, useState } from "react";

export type Leaf = {
  branch: string; category: string; item: string;
  revenue: number; orders: number; units: number;
};

const DIMS = [
  { key: "branch", label: "Branch" },
  { key: "category", label: "Category" },
  { key: "item", label: "Item" },
] as const;
type DimKey = (typeof DIMS)[number]["key"];

const MEASURES = [
  { key: "revenue", label: "Revenue" },
  { key: "orders", label: "Orders" },
  { key: "units", label: "Units" },
  { key: "avg", label: "Avg price" },
  { key: "share", label: "% of total" },
] as const;
type MeasureKey = (typeof MEASURES)[number]["key"];
type SortKey = DimKey | MeasureKey;

type Row = Record<DimKey, string> & Record<MeasureKey, number>;

const peso = (n: number) => "₱" + Math.round(n).toLocaleString("en-PH");
const num = (n: number) => Math.round(n).toLocaleString("en-PH");
const esc = (v: unknown) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function fmt(key: MeasureKey, v: number) {
  if (key === "revenue" || key === "avg") return peso(v);
  if (key === "share") return (v * 100).toFixed(1) + "%";
  return num(v);
}

export default function DataTable({ rows, year }: { rows: Leaf[]; year: number }) {
  const [dims, setDims] = useState<DimKey[]>(["branch"]);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "revenue", desc: true });

  // Selected fields, always in hierarchy order no matter which was ticked first
  const active = DIMS.filter((d) => dims.includes(d.key));

  const { table, total } = useMemo(() => {
    const groups = new Map<string, Row>();
    const total = { revenue: 0, orders: 0, units: 0 };

    for (const r of rows) {
      const revenue = Number(r.revenue), orders = Number(r.orders), units = Number(r.units);
      total.revenue += revenue;
      total.orders += orders;
      total.units += units;

      const key = active.map((d) => r[d.key]).join("|");
      let g = groups.get(key);
      if (!g) {
        g = { branch: r.branch, category: r.category, item: r.item, revenue: 0, orders: 0, units: 0, avg: 0, share: 0 };
        groups.set(key, g);
      }
      g.revenue += revenue;
      g.orders += orders;
      g.units += units;
    }

    const table = [...groups.values()].map((g) => ({
      ...g,
      avg: g.units ? g.revenue / g.units : 0,
      share: total.revenue ? g.revenue / total.revenue : 0,
    }));

    table.sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const c = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sort.desc ? -c : c;
    });

    return { table, total };
  }, [rows, dims, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleDim(key: DimKey) {
    setDims((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
    if (sort.key === key) setSort({ key: "revenue", desc: true });
  }

  function sortBy(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, desc: !s.desc } : { key, desc: MEASURES.some((m) => m.key === key) }
    );
  }

  function exportCsv() {
    const header = ["Year", ...active.map((d) => d.label), ...MEASURES.map((m) => m.label)];
    const lines = table.map((r) =>
      [
        year,
        ...active.map((d) => r[d.key]),
        r.revenue.toFixed(2), r.orders, r.units, r.avg.toFixed(2), (r.share * 100).toFixed(2),
      ].map(esc).join(",")
    );
    const csv = "\uFEFF" + [header.map(esc).join(","), ...lines].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `sample-cafe-${year}-by-${active.map((d) => d.key).join("-") || "total"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const arrow = (key: SortKey) => (sort.key === key ? (sort.desc ? " ↓" : " ↑") : "");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-gray-500">Rows by:</span>
        {DIMS.map((d) => {
          const on = dims.includes(d.key);
          return (
            <button key={d.key} onClick={() => toggleDim(d.key)} aria-pressed={on}
              className={on
                ? "rounded-full border border-green-800 bg-green-50 px-3 py-1 font-semibold text-green-900"
                : "rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50"}>
              {on ? "✓" : "+"} {d.label}
            </button>
          );
        })}
        <button onClick={exportCsv}
          className="ml-auto rounded-full border border-green-800 px-4 py-1.5 font-semibold text-green-800 hover:bg-green-50">
          Export this view (CSV)
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">{table.length} {table.length === 1 ? "row" : "rows"}</p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              {active.map((d) => (
                <th key={d.key} className="py-2 pr-4 text-left font-normal">
                  <button onClick={() => sortBy(d.key)} className="hover:text-black">{d.label}{arrow(d.key)}</button>
                </th>
              ))}
              {MEASURES.map((m) => (
                <th key={m.key} className="py-2 text-right font-normal">
                  <button onClick={() => sortBy(m.key)} className="hover:text-black">{m.label}{arrow(m.key)}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((r) => (
              <tr key={active.map((d) => r[d.key]).join("|") || "all"} className="border-b border-gray-100">
                {active.map((d) => <td key={d.key} className="py-2 pr-4">{r[d.key]}</td>)}
                {MEASURES.map((m) => (
                  <td key={m.key} className="py-2 text-right tabular-nums">{fmt(m.key, r[m.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 font-bold">
              <td colSpan={Math.max(active.length, 1)} className="py-2">Total</td>
              <td className="py-2 text-right tabular-nums">{peso(total.revenue)}</td>
              <td className="py-2 text-right tabular-nums">{num(total.orders)}</td>
              <td className="py-2 text-right tabular-nums">{num(total.units)}</td>
              <td className="py-2 text-right tabular-nums">{total.units ? peso(total.revenue / total.units) : "—"}</td>
              <td className="py-2 text-right tabular-nums">100.0%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}