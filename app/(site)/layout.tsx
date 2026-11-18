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
          <p>© 2026 Enzo Antonio · Siquijor, PH</p>
          <a href="mailto:hello@enzoantonio.com" className="hover:text-black">
            hello@enzoantonio.com
          </a>
        </div>
      </footer>
    </>
  );
}