import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { setServiceActive } from "./actions";

const usd = (n: number | null) => (n == null ? "—" : `$${n.toLocaleString("en-US")}`);

export default function ServicesAdminPage() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Services</h1>
                  <Link href="/admin/services/new" className="rounded-full bg-green-800 px-5 py-2 text-sm font-semibold text-white hover:bg-green-900">
                    New service
                  </Link>
            </div>
            <Suspense fallback={<p className="text-gray-500">Loading services...</p>}>
                <ServicesTable />
            </Suspense>
        </div>
    );
}

async function ServicesTable() {
    await connection();
    const { data: services, error } = await supabaseAdmin
        .from("services")
        .select("id, slug, title, price, price_prefix, monthly_price, sort_order, is_active")
        .order("sort_order");

    if (error || !services) return <p className="text-red-600">Couldn't load services.</p>

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-gray-500">
                    <tr>
                        <th className="py-2 pr-4">#</th>
                        <th className="py-2 pr-4">Service</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Monthly</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s.id} className="border-b border-gray-100">
                           <td className="py-3 pr-4 text-gray-500">{s.sort_order}</td>
                            <td className="py-3 pr-4">
                                <p className="font-medium">{s.title}</p>
                                <p className="text-xs text-gray-500">{s.slug}</p>
                            </td>
                            <td className="py-3 pr-4">{s.price_prefix} {usd(s.price)}</td>
                            <td className="py-3 pr-4">{usd(s.monthly_price)}</td>
                            <td className="py-3 pr-4">
                                <form action={setServiceActive.bind(null, String(s.id), !s.is_active)}>
                                    <button className={s.is_active ? "text-green-700" : "text-gray-400"}>
                                        {s.is_active ? "Active" : "Hidden"}
                                    </button>
                                </form>
                            </td>
                            <td className="py-3 text-right">
                                <Link href={`/admin/services/${s.id}`} className="text-green-800 hover:underline">Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}