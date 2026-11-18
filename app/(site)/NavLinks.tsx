"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { href: "/", label: "Home", mobile: false },
    { href: "/services", label: "Services", mobile: true },
    { href: "/about", label: "About", mobile: true },
];

export default function NavLinks() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <div className="flex items-center gap-4 text-sm sm:gap-8 sm:text-base">
            {LINKS.map((l) => (
                <Link
                    key={l.href}
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`${l.mobile ? "" : "hidden sm: inline"} ${
                        isActive(l.href)
                            ? "font-semibold text-green-800"
                            : "text-gray-600 hover:text-black"
                    }`}
                >
                    {l.label}
                </Link>
            ))}
            <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={`rounded-full bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900 sm:px-5 ${
                    isActive("/contact") ? "ring-2 ring-green-800 ring-offset-2" : ""
                }`}
            >
                Contact
            </Link>
        </div>
    );
}