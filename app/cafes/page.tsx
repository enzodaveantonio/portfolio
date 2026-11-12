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