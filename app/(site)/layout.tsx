import Link from "next/link";
import NavLinks from "./NavLinks";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="whitespace-nowrap font-semibold">
            Enzo Antonio
          </Link>
          <NavLinks />
        </nav>
      </header>

      {children}

      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:justify-between">
          <div>
            <p>© 2026 Enzo Antonio · Siquijor, PH</p>
            <p className="mt-1 text-xs">
              Built with Next.js, React, and Supabase ·{" "}
              <a
                href="https://github.com/enzodaveantonio/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-black"
              >Github Portfolio</a>
            </p>
          </div>
          <a href="mailto:hello@enzoantonio.com" className="hover:text-black">
            hello@enzoantonio.com
          </a>
        </div>
      </footer>
    </>
  );
}