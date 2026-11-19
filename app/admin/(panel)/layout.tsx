import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase-server";
import { logout } from "../login/actions";
import { connection } from "next/server";
import AdminNavLinks from "./AdminNavLinks";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children}: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<p className="p-8 text-gray-500">Loading...</p>}>
            <Gate>{children}</Gate>
        </Suspense>
    );
}

async function Gate({ children }: { children: React.ReactNode }) {
    await connection();
    const admin = await getAdmin();
    if (!admin) redirect("/admin/login");

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <nav className="flex items-center gap-6 border-b border-gray-200 pb-4 text-sm">
                <AdminNavLinks />
                <form action={logout} className="ml-auto">
                    <button className="text-gray-600 hover:text-black">Log out</button>
                </form>
            </nav>
            <div className="mt-8">{children}</div>
        </div>
    );
}