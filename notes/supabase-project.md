1. Create the Supabase project ✅

The free plan gives you 2 projects, and Brew-ha already uses one. Create one new project, called enzo-platform, to hold your leads now and the multi-café demo engine later. Run this in its SQL Editor:

sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business_name text not null,
  town text,
  facebook_url text,
  contact text not null,
  source text not null default 'website',
  status text not null default 'new'
    check (status in ('new','building_demo','demo_shown','won','lost'))
);
alter table leads enable row level security;
-- No policies on purpose: only the server (service role) can read or write.

2. Install packages ✅

npm i @supabase/supabase-js resend server-only

3. Environment variables ✅

In .env.local (and the same four in Vercel → Settings → Environment Variables):

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
LEAD_ALERT_EMAIL=renzodavid.antonio01@gmail.com

4. lib/supabase-admin.ts ✅

import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

import "server-only" makes the build fail if this file is ever imported into a client component. It’s a safety net for the secret key.

5. app/cafes/actions.ts: the server action ✅

"use server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type LeadState = { ok: boolean; error?: string };

const resend = new Resend(process.env.RESEND_API_KEY);

function field(form: FormData, key: string, max = 200) {
  return String(form.get(key) ?? "").trim().slice(0, max);
}

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  // Honeypot: real people never see this field; bots fill it in.
  if (field(form, "website")) return { ok: true };

  const lead = {
    name: field(form, "name", 100),
    business_name: field(form, "business_name", 120),
    town: field(form, "town", 80) || null,
    facebook_url: field(form, "facebook_url", 300) || null,
    contact: field(form, "contact", 120),
  };

  if (!lead.name || !lead.business_name || !lead.contact) {
    return { ok: false, error: "Please fill in your name, café name and how to reach you." };
  }

  const { error } = await supabaseAdmin.from("leads").insert(lead);
  if (error) {
    console.error("Lead insert failed:", error);
    return { ok: false, error: "Something went wrong. Please message me on Facebook instead." };
  }

  try {
    await resend.emails.send({
      from: "Leads <onboarding@resend.dev>",
      to: process.env.LEAD_ALERT_EMAIL!,
      subject: `New café lead: ${lead.business_name}`,
      text: Object.entries(lead).map(([k, v]) => `${k}: ${v ?? "-"}`).join("\n"),
    });
  } catch (e) {
    // The lead is already saved, so a failed email shouldn't fail the form.
    console.error("Lead email failed:", e);
  }

  return { ok: true };
}

Look at the try/catch around the email: it’s the same “the important part already succeeded, don’t undo it” thinking as in your loadProfile.

6. app/cafes/LeadForm.tsx: the form (client component) ✅

"use client";
import { useActionState } from "react";
import { submitLead, type LeadState } from "./actions";

const initial: LeadState = { ok: false };

export default function LeadForm() {
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
      <Field name="name" label="Your name" required />
      <Field name="business_name" label="Café or restaurant name" required />
      <Field name="town" label="Town" />
      <Field name="facebook_url" label="Facebook page link" placeholder="facebook.com/yourcafe" />
      <Field name="contact" label="Mobile number or Messenger" required />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-full bg-green-800 px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Get my free demo"}
      </button>
    </form>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-700 focus:outline-none"
      />
    </label>
  );
}

useActionState gives you three things: the action’s latest result (state), the function to attach to the form (formAction), and whether it’s still running (pending). You don’t need any useState or onSubmit handlers.

7. app/cafes/page.tsx: the page ✅

Copy the three showcase images into public/cafes/ as ordering.png, loyalty.png and staff.png.

import type { Metadata } from "next";
import Image from "next/image";
import LeadForm from "./LeadForm";

export const metadata: Metadata = {
  title: "Your café’s own app · Enzo Antonio",
  description: "See your café’s own ordering and loyalty app, free, in 48 hours.",
};

export default function CafesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-5xl font-extrabold tracking-tight">
        Your café’s own app.
        <br />
        <span className="text-green-800">See it free in 48 hours.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-700">
        Send me your Facebook page. I’ll build a working demo with your logo and menu. No cost, no commitment.
      </p>
      <a href="#demo" className="mt-8 inline-block rounded-full bg-green-800 px-6 py-3 font-semibold text-white">
        Get my free demo
      </a>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <div>
          <h2 className="font-bold">Your customers</h2>
          <p className="mt-1 text-gray-700">Order ahead · skip the line · earn free drinks</p>
        </div>
        <div>
          <h2 className="font-bold">You</h2>
          <p className="mt-1 text-gray-700">See every order live · check payments · track daily sales</p>
        </div>
      </section>

      <section className="mt-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-green-800">
          Built for Brew-ha Cafe &amp; Bar, Siquijor
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {["ordering", "loyalty", "staff"].map((n) => (
            <Image key={n} src={`/cafes/${n}.png`} alt={`Brew-ha ${n} screens`} width={1600} height={1200} className="rounded-xl" />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-gray-700">
          <li>Send your café’s Facebook page</li>
          <li>I build your demo in 48 hours</li>
          <li>I show it to you on my phone, and you decide</li>
        </ol>
      </section>

      <section id="demo" className="mt-16 rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-bold">Get your free demo</h2>
        <p className="mt-1 text-gray-600">I only take on a few cafés at a time, so each one gets proper attention.</p>
        <div className="mt-6">
          <LeadForm />
        </div>
      </section>
    </main>
  );
}

The apostrophes are the curly ’, not ', to avoid the JSX lint error you hit last time.

Test it
npm run dev → open localhost:3000/cafes → submit a test lead.
Check: a row in Supabase’s leads table ✅, and an email in your Gmail ✅.
Submit with an empty name: you should see the error message ✅.
Commit, push, check the live site, then delete your test rows.