"use server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type LeadState = { ok: boolean; error?: string };

const resend = new Resend(process.env.RESEND_API_KEY);

const NEEDS = ["cafe_demo", "build_or_fix", "dashboard", "other"] as const;

function field(form: FormData, key: string, max = 200) {
    return String(form.get(key) ?? "").trim().slice(0, max);
}

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
    // Honeypot: real people never see this field; bots fill it in.
    if (field(form, "website")) return { ok: true };

    const need = field(form, "need", 20);

    const lead = {
        need: NEEDS.includes(need as (typeof NEEDS)[number]) ? need : "other",
        name: field(form, "name", 100),
        business_name: field(form, "business_name", 120),
        location: field(form, "location", 80) || null,
        facebook_url: field(form, "facebook_url", 300) || null,
        phone: field(form, "phone", 40),
        messenger_url: field(form, "messenger_url", 300) || null,
        service: field(form, "service", 60) || null,
    };

    if (!lead.name || !lead.business_name || !lead.phone) {
        return { ok: false, error: "Please fill in your name, business name and mobile number." };
    }

    const { error } = await supabaseAdmin.from("leads").insert(lead);
    if (error) {
        console.error("Lead insert failed:", error);
        return { ok: false, error: "Something went wrong. Please email hello@enzoantonio.com instead." };
    }
    

    try {
        await resend.emails.send({
            from: "Leads <onboarding@resend.dev>",
            to: process.env.LEAD_ALERT_EMAIL!,
            subject: `New lead: ${lead.need}`,
            text: Object.entries(lead).map(([k, v]) => `${k}: ${v ?? "-"}`).join("\n"),
        });
    } catch (e) {
        // The lead is already saved, so a failed email shouldn't fail the form.
        console.error("Lead email failed:", e);
    }

    return { ok: true };
}