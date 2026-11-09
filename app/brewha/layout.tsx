export default function BrewhaPolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="prose prose-gray mx-auto max-w-3xl px-6 py-20">
            {children}
        </main>
    );
}