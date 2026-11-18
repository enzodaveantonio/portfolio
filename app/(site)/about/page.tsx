import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "About · Enzo Antonio",
    description: "I build apps around how your business actually runs, because I used to run small businesses too.",
};

type Testimonial = { quote: string; name: string; role: string };

const testimonials: Testimonial[] = [
    {
        quote:
            "He didn’t just take on the technical build; he took responsibility for the business context behind it. What impressed me most was how clearly he communicated.",
        name: "Jef Lacson",
        role: "Former CFO, UnionDigital Bank, on working with me",
    },
];


export default function AboutPage() {
    return (
        <main>
            {/* 1. Headline: the why */}
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
                <p className="text-sm font-semibold uppercase tracking-wide text-green-800">About</p>
                <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                    Your unique business needs in one custom app.
                </h1>
            </section>

            {/* 2 + 3. Photo + story */}
            <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 pb-24 md:grid-cols-5">
                <div className="space-y-6 md:col-span-2">
                    <Image
                        src="/about/app.png"
                        alt="Brew-ha customer app and staff order panel"
                        width={1600}
                        height={1200}
                        className="w-full rounded-2xl"
                    />
                    <Image
                        src="/about/enzo.jpg"
                        alt="Enzo Antonio at Brew-ha Cafe & Bar"
                        width={1200}
                        height={900}
                        className="w-full rounded-2xl object-cover"
                    />
                </div>
                
                <div className="space-y-5 text-lg leading-relaxed text-gray-700 md:col-span-3">
                    <p className="text-2xl font-semibold leading-snug text-gray-900">
                        What if a custom app makes your team’s lives 10x easier?
                    </p>
                    <p>
                        As a former online bookstore & pastry business owner, I have tried multiple generic business apps to streamline operations... 
                    </p>
                    <p>
                        You know how frustrating it is to compromise because you have to work around the app’s default features. Or worse, manually inputting your data using spreadsheets or pen & paper... That’s why I started building apps. 
                    </p>
                    <p>
                        My first app—Brew-ha Cafe & Bar—was a test project for my brother’s coffee shop. We began with the core features. Then, he asked: “Can we add notifications and a cash entry for income and expenses?” Days later, those features were live.
                    </p>
                    <p>
                         And that’s how we’re gonna work together—you tell me the outcomes you want, I build it, you test and approve it. Might even give you better, alternative ideas. We speak the same language anyway ;)
                    </p>
                    <p>
                        The bonus? With my data engineering background, I’ll design your database such that you can trust the numbers your app shows you. 
                    </p>
                    <Link href="/work/brewha" className="inline-block font-semibold text-green-800 hover:underline">
                        Read the Brew-ha case study →
                    </Link>
                </div>
            </section>

            {/* 4. Testimonials */}
            <section className="bg-green-900 py-20 text-white">
                <div className="mx-auto max-w-4xl space-y-16 px-6 text-center">
                    {testimonials.map((t) => (
                        <figure key={t.name}>
                            <blockquote className="text-2xl font-medium leading-snug md:text-3xl">“{t.quote}”</blockquote>
                            <figcaption className="mt-6 text-green-200">
                                <span className="font-semibold text-white">{t.name}</span> · {t.role}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>
            
            {/* 6. CTA */}
            <section className="mx-auto max-w-3xl px-6 py-24 text-center">
                <h2 className="text-4xl font-extrabold tracking-tight">Tell me how your business runs.</h2>
                <p className="mt-4 text-lg text-gray-700">I’ll tell you honestly what an app could do for it, and what it couldn’t.</p>
                <Link
                    href="/contact"
                    className="mt-8 inline-block rounded-full bg-green-800 px-8 py-3 font-semibold text-white hover:bg-green-900"
                >
                    Let’s talk
                </Link>
            </section>
        </main>
    );
}