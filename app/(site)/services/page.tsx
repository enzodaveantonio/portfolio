import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { cacheLife, cacheTag } from "next/cache";

export const metadata: Metadata = {
  title: "Services · Enzo Antonio",
  description: "Apps, backends and dashboards for cafés, small businesses and founders.",
};

type Service = {
    slug: string;
    title: string;
    summary: string;
    features: string[];
    price: number | null;
    price_prefix: string | null;
    monthly_price: number | null;
    need: string;
};

type Settings = {
    ph_discount: number;
    php_per_usd: number;
    founding_slots_left: number;
    founding_offer: string | null;
};


async function getServices() {
    "use cache";
    cacheLife("minutes");
    cacheTag("services");

    const { data, error } = await supabaseAdmin
        .from("services")
        .select("slug, title, summary, features, price, price_prefix, monthly_price, need")
        .eq("is_active", true)
        .order("sort_order");

    if (error) throw error;
    return(data ?? []) as Service[];
}

async function getSettings() {
    "use cache";
    cacheLife("minutes")
    cacheTag("services");
    const { data, error } = await supabaseAdmin.from("site_settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return data as Settings;
}

const usd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0}).format(n);

// Round pesos to the nearest P100 so prices look intentional
const php = (n: number) => "₱" + (Math.round(n / 100) * 100).toLocaleString("en-PH");

export default async function ServicesPage() {
    
    const [services, settings] = await Promise.all([getServices(), getSettings()]);
    const off = Math.round(settings.ph_discount * 100);

    return(
        <main className="mx-auto max-w-6xl px-6 py-20">
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight">
                Clear packages. Honest prices.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-gray-700">
                Prices in US dollars. <strong>Philippine businesses get {off}% off every package.</strong>
            </p>

            {settings.founding_slots_left > 0 && settings.founding_offer && (
                <p className="mt-6 inline-block rounded-full bg-green-50 px-5 py-2 text-sm font-semibold text-green-900">
                    {settings.founding_offer} {settings.founding_slots_left} left.
                </p>
            )}

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                    <ServiceCard key={s.slug} s={s} settings={settings} />
                ))}
            </div>

            <p className="mt-16 text-center text-gray-600">
                Not sure what you need?{" "}
                <Link href="/contact" className="font-semibold text-green-800 underline">
                Tell me about your business
                </Link>
                , and I’ll recommend a package.
            </p>
        </main>
    );
}

function ServiceCard({ s, settings }: { s: Service; settings: Settings }) {
    const factor = 1 - settings.ph_discount;
    const rate = settings.php_per_usd;

    return (
        <div className="flex flex-col rounded-2xl border border-gray-200 p-8">
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-gray-700">{s.summary}</p>

            {s.price === null ? (
                <p className="mt-6 text-2xl font-extrabold">Custom quote</p>
            ) : (
                <>
                    <p className="mt-6 text-2xl font-extrabold">
                        {s.price_prefix && <span className="text-base font-semibold text-gray-500">{s.price_prefix} </span>}
                        {usd(Number(s.price))}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-green-800">
                        PH businesses: {usd(Number(s.price) * factor)} (≈ {php(Number(s.price) * factor * rate)})
                    </p>
                </>
            )}

            {s.monthly_price !== null && (
                <p className="mt-2 text-sm text-gray-600">
                    + {usd(Number(s.monthly_price))}/mo care · PH: {php(Number(s.monthly_price) * factor * rate)}/mo
                </p>
            )}

            <ul className="mt-6 flex-1 space-y-2 text-sm text-gray-700">
                {s.features.map((f) => (
                    <li key={f} className="flex gap-2">
                        <span className="text-green-700">✓</span>
                        {f}
                    </li>
                ))}
            </ul>

            <Link
                href={`/contact?need=${s.need}&service=${s.slug}`}
                className="mt-8 rounded-full bg-green-800 px-6 py-3 text-center font-semibold text-white hover:bg-green-900"
            >
                Request this
            </Link>
        </div>
    );
}