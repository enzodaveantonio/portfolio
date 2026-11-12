import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enzo Antonio · React Native Developer",
  description: "React Native developer in Siquijor. Ordering, loyalty and admin apps for cafés and small businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="antialiased">
        <header className="border-b border-gray-200">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold">
              Enzo Antonio
            </Link>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/services" className="hover:text-black">Services</Link>
              <Link href="/cafes" className="hover:text-black">For cafés</Link>
              <Link href="/work/brewha" className="hover:text-black">Work</Link>
              <Link href="/about" className="hover:text-black">About</Link>
              <a
                href="mailto:hello@enzoantonio.com"
                className="rounded-full bg-green-800 px-4 py-2 font-semibold text-white hover:bg-green-900"
              >
                Contact
              </a>
            </div>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
