import Link  from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-green-800">404</p>
      <h1 className="mt-2 text-4xl font-bold">This page doesn't exist.</h1>
      <p className="mt-4 text-gray-600">The link might be old, or there's a typo in the URL.</p>
      <Link href="/" className="mt-8 rounded-full bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900">
        Back home
      </Link>
    </main>
  );
}