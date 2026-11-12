import "server-only"; // import "server-only" makes the build fail if this file is ever imported into a client component. It's a safety net for the secret key.
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

