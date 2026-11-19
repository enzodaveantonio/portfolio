"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ServiceState = { error?: string };

const NEEDS = ["cafe_demo", "build_or_fix", "dashboard", "other"] as const;

function text(form: FormData, key: string, max = 300) {
    return String(form.get(key) ?? "").trim().slice(0, max);
}

// Blank => null, a valid number => number, junk => NaN (caught below)
function money(form: FormData, key: string) {
    const raw = text(form, key, 20);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : NaN;
}

export async function saveService(_prev: ServiceState, form: FormData): Promise<ServiceState> {
    if (!(await getAdmin())) return { error: "Not authorized." };

    const id = text(form, "id", 60);
    const need = text(form, "need", 20);

    const row = {
        slug: text(form, "slug", 60).toLowerCase(),
        title: text(form, "title", 120),
        summary: text(form, "summary", 300),
        features: text(form, "features", 2000).split("\n").map((f) => f.trim()).filter(Boolean),
        price: money(form, "price"),
        price_prefix: text(form, "price_prefix", 30) || null,
        price_note: text(form, "price_note", 120) || null,
        monthly_price: money(form, "monthly_price"),
        need: NEEDS.includes(need as (typeof NEEDS)[number]) ? need : "other",
        sort_order: Number(text(form, "sort_order", 5)) || 0,
        is_active: form.get("is_active") === "on",
    };

    if (!/^[a-z0-9-]+$/.test(row.slug)) return { error: "Slug: lowercase letters, numbers and dashes only." };
    if (!row.title || !row.summary) return { error: "Title and summary are required." };
    if (Number.isNaN(row.price) || Number.isNaN(row.monthly_price)) return { error: "Prices must be numbers, or blank." };

    const { error } = id
        ? await supabaseAdmin.from("services").update(row).eq("id", id)
        : await supabaseAdmin.from("services").insert(row);

    if (error) {
        console.error("Service save error:", error);
        return { error: error.code === "23505" ? "That slug is already used." : "Couldn't save." };
    }

    updateTag("services");
    redirect("/admin/services");
}

export async function setServiceActive(id: string, active: boolean) {
    if (!(await getAdmin())) return;
    await supabaseAdmin.from("services").update({ is_active: active }).eq("id", id);
    updateTag("services");
}