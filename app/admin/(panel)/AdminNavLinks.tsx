"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { href: "/admin", label: "Leads" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/settings", label: "Settings" },
];

export default function AdminNavLinks() {
    const pathname = usePathname();
    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return (
        <>
            {LINKS.map((l) => (
                <Link
                    key={l.href}
                    href={l.href}
                    className={isActive(l.href) ? "font-semibold text-green-800" : "text-gray-600 hover:text-black"}
                >
                    {l.label}
                </Link>
            ))}
        </>
    );
}