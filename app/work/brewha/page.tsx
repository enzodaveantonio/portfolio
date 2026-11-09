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

            <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
                <dt className="font-semibold">Role</dt>
                <dd className="text-gray-700">Sole developer: product design, mobile app, backend, deployment</dd>

                <dt className="font-semibold">Mobile</dt>
                <dd className="text-gray-700">React Native, Expo, Expo Router, TypeScript, Zustand</dd>

                <dt className="font-semibold">Backend</dt>
                <dd className="text-gray-700">Supabase: PostgreSQL, Row Level Security, Auth, Storage, Edge Functions</dd>

                <dt className="font-semibold">Delivery</dt>
                <dd className="text-gray-700">EAS Build and over-the-air updates, Firebase Cloud Messaging, Google sign-in</dd>

                <dt className="font-semibold">Key features</dt>
                <dd className="text-gray-700">
                    Order ahead and walk-in counter mode, GCash receipt verification, stamp-card vouchers, push notifications, daily cash reports, store open/closed switch, in-app account deletion
                </dd>
            </dl>

            <Section title="The problem">
                <p>Like many small cafés, Brew-ha ran on paper and messages:</p>
                <ul className="list-disc space-y-2 pl-5">
                    <li>Orders were written by hand, so nothing connected what was ordered to what was paid.</li>
                    <li>Customers paid by GCash and showed a screenshot, which staff had to trust or check by hand.</li>
                    <li>There was no loyalty program to bring customers back.</li>
                    <li>
                        At closing, nobody could say how much cash the drawer <em>should</em> hold,
                        so shortages went unexplained.
                    </li>
                </ul>
                <p>
                    The owner wanted one system for app orders and walk-ins, without paying for a
                    point-of-sale subscription or a payment gateway.
                </p>
            </Section>

            <Section title="What I built">
                <h3 className="font-semibold text-gray-900">
                 For customers
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>A menu with sizes, milk/temperature options, add-ons, a cart, and checkout for pickup</li>
                    <li>Pay in cash at pickup, or by bank or e-wallet transfer with a receipt upload</li>
                    <li>Live order tracking with a daily pickup number, plus push notifications when the order is ready, a payment is confirmed or rejected, or the order is cancelled</li>
                    <li>A stamp card: 10 drinks earn a free-drink voucher, applied automatically at checkout</li>
                    <li>Google or email sign-in, profile editing, password change and in-app account deletion</li>
                    <li>Order history with the full details of every past order, its payment status and the rewards it earned, plus one-tap reorder that puts a past order back in the cart</li>
                </ul>

                <h3 className="font-semibold text-gray-900">
                    For staff
                </h3>
                <ul className="list-disc space-y-2 pl-5">
                    <li>A real-time order panel with a vibration alert and a push notification for each new order</li>
                    <li>Payment verification: view the receipt, approve, or reject with a reason the customer sees</li>
                    <li>Counter mode for walk-in customers, using the same menu and checkout</li>
                    <li>Cash & Reports: open the drawer, log expenses, and close the day with the expected cash, the counted cash and the difference</li>
                    <li>
                        A menu builder the owner runs without a developer: sizes, milk, sweetness and add-ons
                        set up per category or per product, each with its own price, and items marked sold out
                        instantly
                    </li>
                    <li>Home banners, and an “accepting orders” switch with a custom closed message</li>
                </ul>
            </Section>

            <Section title="Engineering highlights">
                <Highlight title="Prices are decided by the database, never the phone">
                    <p>The app sends only product IDs, quantities and option IDs. A single Postgres function,{" "}<code>place_order</code>, looks up real prices, validates every option against the product, applies vouchers under a row lock, and writes the order in one transaction. A modified app cannot change what anything costs, and a voucher cannot be spent twice.</p>
                    <p>The same principle runs through the whole app: every order, payment, stamp and voucher passes through rules enforced by the Supabase database itself, not by the phone. So a tampered phone or a modified copy of the app gains nothing: it can only ask, and the database decides.</p>
                </Highlight>

                <Highlight title="Payment verification without a payment gateway">
                    <p>Customers upload a transfer receipt to a private storage bucket via Supabase. Staff view it through links that expire within minutes, then approve or reject it. Every attempt is a row in a <code>payments</code> ledger with its status, reviewer and timestamp, so a rejected and re-uploaded payment keeps its full history. A database trigger refuses to start preparing any unpaid transfer order, whatever screen tries.</p>
                </Highlight>

                <Highlight title="Loyalty as a ledger">
                    <p>
                        Stamps are never stored as a single number. Each change is a row: earned on order completion, and converted into a voucher when it reaches 10 stamps, then the count resets to 0. The balance is their sum, like a bank statement. Triggers award stamps when an order completes and restore a voucher if its order is cancelled.
                    </p>
                </Highlight>

                <Highlight title="Security by default">
                    <p>
                        Row Level Security is on for every table, so customers can only read their own orders, receipts and rewards. Staff actions run through functions that check the caller’s role, and functions meant only for the server have execute permission revoked from app users. Webhooks and scheduled jobs authenticate with their own secrets.
                    </p>
                </Highlight>
                
                <Highlight title="A notification pipeline with no polling">
                    <p>               
                        A database webhook calls an Edge Function on every order change. The function compares the old and new row to decide whether anything worth a notification happened, finds the right recipients, sends through Expo’s push service, and deletes tokens for uninstalled apps.
                    </p>
                </Highlight>

                <Highlight title="Daily operations">
                    <p>               
                        Order numbers restart at #001 each day using an atomic counter, so two simultaneous orders never share a number. The cash report calculates sales from the orders themselves and combines them with logged expenses, so sales are never typed in twice. At closing, the expected cash is frozen as a snapshot, so later changes cannot rewrite a closed day.
                    </p>
                </Highlight>

                <Highlight title="Privacy built in, not bolted on">
                    <p>               
                        Account deletion removes the person’s files, anonymizes their past orders for the café’s records, and then deletes the login, in an order that is safe to retry. A nightly scheduled job deletes payment receipts after one year. The published privacy policy describes exactly what the system does.
                    </p>
                </Highlight>
            </Section>

            <Section title="Timeline">
                <p>The system is complete and in live testing at the café. This timeline is updated as results come in.</p>
                <ul className="list-disc space-y-2 pl-5">
                    <li><strong>Oct 22, 2026:</strong> Google sign-in and push notifications live on Android.</li>
                    <li><strong>Oct 29, 2026:</strong> In-app account deletion and automatic one-year receipt cleanup shipped.</li>
                    <li><strong>Nov 7, 2026:</strong> Automatic image compression for uploads; test data cleared; privacy policy and terms published; Google Play developer account created.</li>
                    <li><strong>Nov 8, 2026:</strong> First live day at the café. Real walk-in orders ran through counter mode, and a bug found mid-shift was fixed in the database the same day, with no app update needed.</li>
                    <li><strong>Nov 9, 2026:</strong> Preparing a Google Play closed test with café customers.</li>
                </ul>
            </Section>

            <Section title="What I learned">
                <ul className="list-disc space-y-2 pl-5">
                    <li><strong>Adoption is the hard part, not the code.</strong>A working system only matters once staff use it during a real shift, so the counter flow was designed to be faster than writing on paper.</li>
                    <li><strong>Scope decides whether anything ships.</strong>  A feature list with no end means an app that never launches. Every idea went onto a “later” list unless the first version needed it.</li>
                    <li><strong>Some secondary features earn their place by driving adoption.</strong>  The stamp card isn’t essential to taking an order, but it gives customers a reason to order through the app instead of messaging the café, so it got shipped in the first version.</li>
                    <li><strong>Put the rules where they cannot be skipped.</strong>  Pricing, payment checks and stamps live in the database, so every screen, present or future, follows the same rules.</li>
                    <li><strong>Store facts, calculate totals.</strong>  Ledgers for stamps, payments and cash make every number traceable to the rows behind it, a habit from my data engineering background.</li>
                </ul>
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

function Highlight({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <div className="mt-1 space-y-3">{children}</div>
        </div>
    );
}