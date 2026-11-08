import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto-max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold">Enzo Antonio</h1>
      <p className="mt-4 text-lg text-gray-600">
        React Native developer with a data engineering background.
        I build mobile apps with backends that hold up: orders, payments,
        and data that stays correct.
      </p>

      <h2 className="mt-16 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Work
      </h2>

      <Link
        href="/work/brewha"
        className="mt-4 block rounded-xl border border-gray-200 p-6 transition hover:border-gray-400 hover: shadow-sm"
      >
        <p className="text-sm font-medium text-green-700">Café ordering · Payments · Loyalty</p>
        <h3 className="mt-1 text-xl font-semibold">Brew-ha Cafe & Bar</h3>
        <p className="mt-2 text-gray-600">
          A mobile app that runs an independent café's orders, GCash payment
          verification, stamp-card rewards and daily cash reports.
        </p>
        <p className="mt-4 text-sm font-medium">Read the case study →</p>
      </Link>
    </main>
  );
}