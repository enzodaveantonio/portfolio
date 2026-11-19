import { Suspense } from "react";
import { connection } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import SettingsForm from "./SettingsForm";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="mb-6 text-2xl font-bold">Settings</h1>
            <Suspense fallback={<p className="text-gray-500">Loading settings...</p>}>
                <SettingsLoader />
            </Suspense>
        </div>
    );
}

async function SettingsLoader() {
    await connection();
    const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("ph_discount, php_per_usd, founding_slots_left, founding_offer")
        .eq("id", 1)
        .single();

    if (error || !data) return <p className="text-red-600">Couldn't load settings.</p>;
    return <SettingsForm settings={data} />;
}