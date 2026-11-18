"use client";
import { useTransition } from "react";
import { updateLeadStatus } from "./actions";

const LABELS: Record<string, string> = {
    new: "New", building_demo: "Building demo", demo_shown: "Demo shown", won: "Won", lost: "Lost",
};

export function StatusSelect({ id, status }: { id: string; status: string }) {
    const [pending, startTransition] = useTransition();
    return (
        <select
            defaultValue={status}
            disabled={pending}
            onChange={(e) => startTransition(() => updateLeadStatus(id, e.target.value))}
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
        >
            {Object.entries(LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );
}