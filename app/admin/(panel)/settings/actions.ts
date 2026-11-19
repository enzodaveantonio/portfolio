"use server";

import { updateTag } from "next/cache";
import { getAdmin } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type SettingsState = { ok?: boolean; error?: string };

function num(form: FormData, key: string) {
    return Number(String(form.get(key) ?? "").trim());
}

export async function updateSettings(_prev: SettingsState, form: FormData): Promise<SettingsState> {
    if (!(await getAdmin())) return { error: "Not authorized." };

    const discountPct = num(form, "ph_discount_pct");
    const rate = num(form, "php_per_usd");
    const slots = num(form, "founding_slots_left");
    const offer = String(form.get("founding_offer") ?? "").trim().slice(0, 200);

    if (!Number.isFinite(discountPct) || discountPct < 0 || discountPct > 90)
        return { error: "Discount must be between 0 and 90%." };
    if (!Number.isFinite(rate) || rate < 30 || rate > 100)
        return { error: "Peso rate looks wrong (expected 30-100)." };
    if(!Number.isInteger(slots) || slots < 0 || slots > 20)
        return { error: "Slots must be a whole number from 0 to 20." };

    const { error } = await supabaseAdmin
        .from("site_settings")
        .update({
            ph_discount: discountPct / 100,
            php_per_usd: rate,
            founding_slots_left: slots,
            founding_offer: offer || null,
        })
        .eq("id", 1);

    if (error) {
        console.error("Settings update error:", error);
        return { error: "Couldn't save. Check the server logs." };
    }

    updateTag("services");
    return { ok: true};
}