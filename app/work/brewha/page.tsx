export const metadata = {
    title: "Brew-ha: Cafe ordering, payments & loyalty · Enzo Antonio",
    description: "A mobile ordering, payment and loyalty system for an independent café in Siquijor, built end to end with React Native and Supabase.",
};

export default function BrewhaCaseStudy() {
    return (
        <main className="mx-auto max-w-3xl px-6 py-20">
            <p className="text-sm font-medium text-green-700">Case Study</p>
            <h1 className="mt-2 text-4xl font-bold">Brew-ha Cafe & Bar</h1>
            <p className="mt-4 text-lg text-gray-600">
                A mobile ordering, payment and loyalty system for an independent café in Siquijor,
                Philippines. Built end to end: the customer app, the staff tools, and the backend
                that keeps money and data correct.
            </p>

            <Section title="The problem">
                <p>Coming tomorrow.</p>
            </Section>

            <Section title="What I built">
                <p>Coming tomorrow.</p>
            </Section>

            <Section title="Engineering highlights">
                <p>Coming tomorrow.</p>
            </Section>

            <Section title="What I learned">
                <p>Coming tomorrow.</p>
            </Section>
        </main>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return(
        <section className="mt-14">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">{children}</div>
        </section>
    );
}