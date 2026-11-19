"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { href: "/admin", label: "Leads" },
    { href: "/admin/settings", label: "Settings" },
];

export default function AdminNavLinks() {
    const pathname = usePathname();
    return (
        <>
            {LINKS.map((l) => (
                <Link
                    key={l.href}
                    href={l.href}
                    className={pathname === l.href ? "font-semibold text-green-800" : "text-gray-600 hover:text-black"}
                >
                    {l.label}
                </Link>
            ))}
        </>
    );
}