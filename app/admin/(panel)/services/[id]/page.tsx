import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ServiceForm from "../ServiceForm";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
            <Editor params={params} />
        </Suspense>
    );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
    await connection();
    const { id } = await params;

    if (id === "new") {
        return (
            <>
                <h1 className="mb-6 text-2xl font-bold">New service</h1>
                <ServiceForm />
            </>
        );
    }

    const { data } = await supabaseAdmin.from("services").select("*").eq("id", id).single();
    if (!data) notFound();

    return (
        <>
            <h1 className="mb-6 text-2xl font-bold">Edit: {data.title}</h1>
            <ServiceForm service={data} />
        </>
    );
}