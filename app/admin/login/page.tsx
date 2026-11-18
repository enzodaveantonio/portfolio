"use client";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function AdminLogin() {
    const [state, formAction, pending] = useActionState(login, initial);
    return (
        <main className="mx-auto max-w-sm px-6 py-24">
            <h1 className="text-2xl font-bold">Admin</h1>
            <form action={formAction} className="mt-8 space-y-4">
                <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5" />
                <input name="password" type="password" placeholder="Password" required className="w-full rounded-lg border border-gray-300 px-4 py-2.5" />
                {state.error && <p className="text-sm text-red-600">{state.error}</p>}
                <button disabled={pending} className="w-full rounded-full bg-green-800 px-6 py-3 font-semibold text-white disabled:opacity-60">
                    {pending ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </main>
    );
}