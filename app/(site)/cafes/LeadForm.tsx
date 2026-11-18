"use client";
import { useActionState } from "react";
import { submitLead, type LeadState } from "./actions";

const initial: LeadState = { ok: false };

export default function LeadForm({ defaultNeed = "cafe_demo", service }: { defaultNeed?: string; service?: string }) {
    const [state, formAction, pending] = useActionState(submitLead, initial);

    if (state.ok) {
        return (
            <p className="rounded-xl bg-green-50 p-6 text-green-900">
                Got it! I’ll message you within 24 hours. Your demo will be ready in 48. ☕
            </p>
        );
    }

    return (
        <form action={formAction} className="space-y-4">
            <label className="block">
                <span className="text-sm font-medium text-gray-800">
                    What do you need?<span className="ml-0.5 text-red-600" aria-hidden="true">*</span>
                </span>
                <select
                    name="need"
                    defaultValue={defaultNeed}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus:border-green-700 focus:outline-none"
                >
                    <option value="cafe_demo">Free café / restaurant app demo</option>
                    <option value="build_or_fix">Build, fix or publish an app</option>
                    <option value="dashboard">A dashboard for my data</option>
                    <option value="other">Something else</option>
                </select>
            </label>
            <Field name="name" label="Your name" required placeholder="e.g. Juan dela Cruz" />
            <Field name="business_name" label="Business name" required placeholder="e.g. Brew-ha Cafe & Bar" />
            <Field name="location" label="Location" placeholder="e.g. Maria, Siquijor" />
            <Field name="facebook_url" label="Facebook page link" placeholder="e.g. facebook.com/brewhacafebar" />
            <Field name="phone" label="Mobile number / WhatsApp" required placeholder="e.g. 0917 123 4567" />
            <Field name="messenger_url" label="Messenger link" placeholder="e.g. m.me/yourpage" />
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <input type="hidden" name="service" value={service ?? ""} />

            <p className="text-xs text-gray-500">
                <span className="text-red-600">*</span> Required
            </p>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            <button
                disabled={pending}
                className="w-full rounded-full bg-green-800 px-6 py-3 font-semibold text-white disabled:opacity-60"
            >
                {pending ? "Sending..." : "Get my free demo"}
            </button>
        </form>
    );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return(
        <label className="block">
            <span className="text-sm font-medium text-gray-800">
                {label}
                {props.required && <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>}
            </span>
            <input
                {...props}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-700 focus:outline-none"
            />
        </label>
    );
}