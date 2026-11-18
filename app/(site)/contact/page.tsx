import type { Metadata } from "next";
import { Suspense } from "react";
import LeadForm from "../cafes/LeadForm";

export const metadata: Metadata = {
    title: "Contact · Enzo Antonio",
    description: "Tell me what you need. I reply within 24 hours.",
};

type Params = Promise<{ need?: string; service?: string }>;

// Not async: this part renders instantly, at build time

export default function ContactPage({ searchParams }: { searchParams: Params }) {
    return (
        <main className="mx-auto max-w-xl px-6 py-20">
            <h1 className="text-4xl font-extrabold tracking-tight">Let’s talk.</h1>
            <p className="mt-4 text-gray-700">
                Tell me what you need. I reply within 24 hours. Or email{" "}
                <a href="mailto:hello@enzoantonio.com" className="font-semibold text-green-800 underline">
                    hello@enzoantonio.com
                </a>
                .
            </p>
            <div className="mt-10">
                <Suspense fallback={<LeadForm defaultNeed="other" />}>
                    <ContactForm searchParams={searchParams} />
                </Suspense>
            </div>
        </main>
    );
}

// Only this part waits for that URL, inside the Suspense boundary
async function ContactForm({ searchParams }: { searchParams: Params }) {
    const { need, service } = await searchParams;
    return <LeadForm defaultNeed={need ?? "other"} service={service} />;
}

