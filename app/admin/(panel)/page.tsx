import { supabaseAdmin } from "@/lib/supabase-admin";
import { StatusSelect } from "./StatusSelect";
import { connection } from "next/server";
import { Suspense } from "react";

type Lead = {
    id: string;
    created_at: string;
    need: string;
    service: string | null;
    name: string;
    business_name: string;
    location: string | null;
    phone: string;
    messenger_url: string | null;
    facebook_url: string | null;
    status: string;
};

const when = (iso: string) =>
    new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(iso));

export default function LeadsPage() {
    return (
        <Suspense fallback={<p className="text-gray-500">Loading leads...</p>}>
            <LeadsTable />
        </Suspense>
    )
}

async function LeadsTable() {
    await connection();
    const { data, error } = await supabaseAdmin
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
    if (error) throw error;
    const leads = (data ?? []) as Lead[];

    return (
        <>
            <h1 className="text-2xl font-bold">Leads ({leads.length})</h1>
            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 text-gray-500">
                        <tr>
                            <th className="py-2 pr-4">Received</th>
                            <th className="py-2 pr-4">Business</th>
                            <th className="py-2 pr-4">Need</th>
                            <th className="py-2 pr-4">Contact</th>
                            <th className="py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((l) => (
                            <tr key={l.id} className="border-b border-gray-100 align-top">
                                <td className="py-3 pr-4 whitespace-nowrap text-gray-600">{when(l.created_at)}</td>
                                <td className="py-3 pr-4">
                                    <p className="font-semibold">{l.business_name}</p>
                                    <p className="text-gray-600">{l.name}{l.location && ` · ${l.location}`}</p>
                                    {l.facebook_url && (
                                        <a href={l.facebook_url.startsWith("http") ? l.facebook_url : `https://${l.facebook_url}`} target="_blank" className="text-green-800 underline" rel="noopener noreferrer">Facebook</a>
                                    )}
                                </td>
                                <td className="py-3 pr-4">
                                    {l.need}{l.service && <span className="block text-gray-500">{l.service}</span>}
                                </td>
                                <td className="py-3 pr-4">
                                    <p>{l.phone}</p>
                                    {l.messenger_url && (
                                        <a href={l.messenger_url.startsWith("http") ? l.messenger_url : `https://${l.messenger_url}`}
                                        target="_blank" className="text-green-800 underline" rel="noopener noreferrer">Messenger</a>
                                    )}
                                </td>
                                <td className="py-3"><StatusSelect id={l.id} status={l.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}