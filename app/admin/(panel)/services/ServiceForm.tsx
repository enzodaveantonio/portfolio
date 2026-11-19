"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveService, type ServiceState } from "./actions";

export type Service = {
  id: string | number;
  slug: string;
  title: string;
  summary: string;
  features: string[] | null;
  price: number | null;
  price_prefix: string | null;
  price_note: string | null;
  monthly_price: number | null;
  need: string;
  sort_order: number;
  is_active: boolean;
};

const initial: ServiceState = {};

export default function ServiceForm({ service }: { service?: Service }) {
    const [state, action, pending] = useActionState(saveService, initial);
    const s = service;

    return (
        <form action={action} className="max-w-2xl space-y-5">
            <input type="hidden" name="id" value={s?.id ?? ""} />
            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Title *">
                <input name="title" required defaultValue={s?.title} className={input} />
                </Field>
                <Field label="Slug *" hint="Used in links: /contact?service=slug">
                <input name="slug" required defaultValue={s?.slug} className={input} />
                </Field>
            </div>

            <Field label="Summary *">
                <textarea name="summary" required rows={2} defaultValue={s?.summary} className={input} />
            </Field>

            <Field label="Features" hint="One per line.">
                <textarea name="features" rows={6} defaultValue={s?.features?.join("\n")} className={input} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Price prefix" hint="e.g. Setup, From">
                <input name="price_prefix" defaultValue={s?.price_prefix ?? ""} className={input} />
                </Field>
                <Field label="Price (USD)">
                <input name="price" type="number" min={0} step="any" defaultValue={s?.price ?? ""} className={input} />
                </Field>
                <Field label="Monthly (USD)">
                <input name="monthly_price" type="number" min={0} step="any" defaultValue={s?.monthly_price ?? ""} className={input} />
                </Field>
            </div>

            <Field label="Price note" hint="e.g. per screen, one-time">
                <input name="price_note" defaultValue={s?.price_note ?? ""} className={input} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Lead type" hint="Pre-selects the contact form.">
                <select name="need" defaultValue={s?.need ?? "build_or_fix"} className={input}>
                    <option value="cafe_demo">Café demo</option>
                    <option value="build_or_fix">Build or fix</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="other">Other</option>
                </select>
                </Field>
                <Field label="Sort order" hint="Lower shows first.">
                <input name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} className={input} />
                </Field>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="is_active" defaultChecked={s?.is_active ?? true} />
                Show on /services
            </label>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <div className="flex items-center gap-4">
                <button disabled={pending}
                className="rounded-full bg-green-800 px-6 py-2.5 font-semibold text-white hover:bg-green-900 disabled:opacity-60">
                {pending ? "Saving..." : "Save"}
                </button>
                <Link href="/admin/services" className="text-sm text-gray-600 hover:text-black">Cancel</Link>
            </div>
        </form>
    );
}

const input = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-700 focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode}) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-gray-800">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
        </label>
    );
}