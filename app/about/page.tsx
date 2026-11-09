export const metadata = {
    title: "About · Enzo Antonio",
    description: "React Native developer with a data engineering background, based in the Philippines.",
};

export default function AboutPage() {
    return (
        <main className="mx-auto max-w-3xl px-6 py-20">
            <h1 className="text-4xl font-bold">About</h1>

            <div className="mt-8 space-y-5 text-lg text-gray-700">
                <p>
                    Hey there! I’m Enzo, a React Native developer based in the Philippines. I build mobile apps
                    for small to mid-sized businesses, with secure backends designed so the money and the data always add up.
                </p>

                <p>
                    I came to app development from data engineering, where I built pipelines and
                    dashboards with SQL, PySpark, Databricks, Snowflake and Power BI. That background
                    shapes how I build apps: rules live in the database where they can’t be skipped,
                    every number traces back to the records behind it, and reports are calculated,
                    never typed in by hand. It also means I can build both your app and the
                    dashboards that show you how your business is really doing.
                </p>

                <p>
                    Before tech, I spent four years in real estate, and as a student I started several
                    small businesses of my own, including a bookstore and a pastry business. So I know
                    the pain of running the counter, counting the cash at closing, chasing payments and
                    managing inventory. I build software that takes that work off your plate, so you
                    can focus on growing the business.
                </p>

                <p>
                    I studied Business Economics at Silliman University, graduating magna cum laude.
                </p>
            </div>

            <section className="mt-14">
                <h2 className="text-2xl font-semibold">What I work with</h2>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-gray-700">
                    <dt className="font-semibold text-gray-900">Mobile</dt>
                    <dd>React Native, Expo, TypeScript</dd>

                    <dt className="font-semibold text-gray-900">Backend</dt>
                    <dd>Supabase, PostgreSQL, Edge Functions</dd>

                    <dt className="font-semibold text-gray-900">Data</dt>
                    <dd>SQL, PySpark, Databricks, Snowflake, Power BI</dd>
                </dl>
            </section>

            <section className="mt-14">
                <h2 className="text-2xl font-semibold">Working together</h2>
                <p className="mt-4 text-gray-700">
                    Got a project you’re working on? I work remotely with clients anywhere, on Philippine time (UTC+8). Drop me a short email about what you’re building:{" "}
                    <a href="mailto:hello@enzoantonio.com" className="font-medium underline">
                        hello@enzoantonio.com
                    </a>
                </p>
            </section>
            
        </main>
    )
}