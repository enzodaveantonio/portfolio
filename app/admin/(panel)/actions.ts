"use server";
import { revalidatePath } from "next/cache";
import { getAdmin } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const STATUSES = ["new", "building_demo", "demo_shown", "won", "lost"] as const;

export async function updateLeadStatus(id: string, status: string) {
    if (!(await getAdmin())) throw new Error("Not authorized"); // every action checks
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) throw new Error("Invalid status");

    const { error } = await supabaseAdmin.from("leads").update({ status }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin");
}