"use server";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.signInWithPassword({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
    });
    if (error) return { error: "Wrong email or password." };
    redirect("/admin");
}

export async function logout() {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
    redirect("/admin/login");
}