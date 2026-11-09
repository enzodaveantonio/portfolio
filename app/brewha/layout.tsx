export default function BrewhaPolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="prose prose-gray mx-auto max-w-3xl px-6 py-20">
            {children}
            <hr />
            <p className="text-sm">
                <a href="/brewha/privacy">Privacy Policy</a> ·{" "}
                <a href="/brewha/terms">Terms of Use</a> ·{" "}
                <a href="/brewha/delete-account">Delete your account</a> ·{" "}
                <a href="/work/brewha">About the Brew-ha app</a>
            </p>
        </main>
    );
}