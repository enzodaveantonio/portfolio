"use client";

import { useActionState } from "react";
import { updateSettings, type SettingsState } from "./actions";

type Settings = {
    ph_discount: number;
    php_per_usd: number;
    founding_slots_left: number;
    founding_offer: string | null;
};

const initial: SettingsState = {};

export default function SettingsForm({ settings }: { settings: Settings }) {
    const [state, action, pending] = useActionState(updateSettings, initial);

    return (
        <form action={action} className="max-w-md space-y-5">
            <Field label="Founding slots left" hint="Shown on /services. 0 hides the badge.">
                <input name="founding_slots_left" type="number" min={0} max={20} step={1} defaultValue={settings.founding_slots_left} className={input} />
            </Field>

            <Field label="Founding offer text">
                <textarea name="founding_offer" rows={2} maxLength={200}
                    defaultValue={settings.founding_offer ?? ""} className={input} /> 
            </Field>

            <Field label="PH discount (%)">
                <input name="ph_discount_pct" type="number" min={0} max={90} step={1}
                defaultValue={Math.round(settings.ph_discount * 100)} className={input} />
            </Field>

            <Field label="Peso per USD" hint="Used for the ≈ ₱ prices.">
                <input name="php_per_usd" type="number" min={30} max={100} step={0.01}
                defaultValue={settings.php_per_usd} className={input} />
            </Field>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            {state.ok && <p className="text-sm text-green-700">Saved. /services is updated.</p>}

            <button disabled={pending}
                className="rounded-full bg-green-800 px-6 py-2.5 font-semibold text-white hover:bg-green-900 disabled:opacity-60"
            >
                {pending ? "Saving..." : "Save"}
            </button>
        </form>
    );
}

const input = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-700 focus:outline-none";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-gray-800">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
        </label>
    );
}