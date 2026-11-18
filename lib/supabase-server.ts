import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr"; 

export async function createSupabaseServer() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: (toSet) => {
                    try {
                        toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                    } catch {
                        // Called from a Server Component
                    }
                },
            },
        }
    );
}

// Returns the user only if they're logged in AND are you
export async function getAdmin() {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== process.env.ADMIN_EMAIL) return null;
    return user;
}