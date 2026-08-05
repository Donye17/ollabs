import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { ArrowRight, Check, X } from 'lucide-react';

const URL = 'https://ollabs.studio/vs/twibbonize';

export const metadata: Metadata = {
    title: 'Ollabs vs Twibbonize',
    description:
        'An honest comparison of Ollabs and Twibbonize for profile picture frame campaigns. The core difference: Twibbonize charges supporters to remove a watermark. Ollabs never charges supporters.',
    keywords: [
        'twibbonize alternative',
        'ollabs vs twibbonize',
        'twibbonize without watermark',
        'free twibbon alternative',
        'profile picture frame no watermark',
    ],
    alternates: { canonical: URL },
    openGraph: {
        type: 'website',
        url: URL,
        siteName: 'Ollabs',
        title: 'Ollabs vs Twibbonize',
        description:
            'The core difference: Twibbonize charges supporters to remove a watermark. Ollabs never charges supporters.',
        images: ['/og.png'],
    },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

const rows: { label: string; ollabs: string; twibbonize: string; ollabsWins: boolean }[] = [
    {
        label: 'Watermark on the supporter’s photo',
        ollabs: 'Never',
        twibbonize: 'Yes, unless paid to remove',
        ollabsWins: true,
    },
    {
        label: 'Who pays',
        ollabs: 'Nobody. Organizers may donate if they want to',
        twibbonize: 'Supporters, to remove the watermark',
        ollabsWins: true,
    },
    {
        label: 'Ads',
        ollabs: 'None',
        twibbonize: 'Yes',
        ollabsWins: true,
    },
    {
        label: 'Account required to support',
        ollabs: 'No',
        twibbonize: 'No',
        ollabsWins: false,
    },
    {
        label: 'Account required to create',
        ollabs: 'No',
        twibbonize: 'Yes',
        ollabsWins: true,
    },
    {
        label: 'Mobile app',
        ollabs: 'No, works in the browser',
        twibbonize: 'Yes, iOS and Android',
        ollabsWins: false,
    },
    {
        label: 'Scale and track record',
        ollabs: 'New, small, growing',
        twibbonize: 'Very large, hundreds of millions of users',
        ollabsWins: false,
    },
];

const faqs = [
    {
        q: 'What is the actual difference between Ollabs and Twibbonize?',
        a: 'Who pays. Twibbonize’s business model puts a watermark on the photo a supporter downloads and charges to remove it. Ollabs makes money from organizers who choose to support it, never from supporters. Your supporters download a clean, unwatermarked photo every time.',
    },
    {
        q: 'Why does the watermark matter so much?',
        a: 'If you are a nonprofit, school, or company, a watermark and a paywall land on your supporters, not on the platform. They see your campaign and then they see an upsell. That reflects on your organization.',
    },
    {
        q: 'Is Ollabs really free, or is this a trial?',
        a: 'Free, and not a trial. Unlimited campaigns and unlimited supporters. Some alternatives advertise as free but mean free for one month.',
    },
    {
        q: 'Is Twibbonize better at anything?',
        a: 'Yes. It is far larger, has been running much longer, and has native iOS and Android apps. If you need a mobile app or you are running a campaign in Indonesia or the Philippines where it is dominant, it is a reasonable choice.',
    },
    {
        q: 'Can I move an existing campaign to Ollabs?',
        a: 'There is no import, but recreating a frame takes a couple of minutes. Upload your existing frame design as a transparent PNG and you will have a new link right away.',
    },
];

export default function VsTwibbonizePage() {
    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    return (
        <main className="min-h-screen bg-paper text-ink">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
            <NavBar />

            <section className="relative pt-32 pb-14 px-6 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[380px] h-[380px] rounded-full border-[42px] border-brand/15 pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-cream border border-ink/10 px-4 py-1.5 text-xs font-bold text-muted mb-6">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand" /> Comparison
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.03] mb-5">
                        Ollabs vs Twibbonize
                    </h1>
                    <p className="text-lg md:text-xl text-ink/70 mb-8 max-w-2xl">
                        Both let you run a profile picture frame campaign. The difference that actually matters is
                        who ends up paying: Twibbonize charges your supporters to remove a watermark. Ollabs never
                        charges supporters, ever.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/create"
                            className="group h-12 px-7 rounded-xl bg-brand text-ink font-bold flex items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all"
                        >
                            Create a free campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/explore"
                            className="h-12 px-7 rounded-xl border border-ink/15 text-ink font-bold flex items-center hover:bg-ink/5 transition-all"
                        >
                            See live campaigns
                        </Link>
                    </div>
                </div>
            </section>

            <section className="px-6 pb-4">
                <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-ink/10">
                                <th className="text-left font-display font-extrabold p-4 w-[38%]"> </th>
                                <th className="text-left font-display font-extrabold p-4 text-brand-deep">Ollabs</th>
                                <th className="text-left font-display font-extrabold p-4 text-muted">Twibbonize</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.label} className="border-b border-ink/5 last:border-0 align-top">
                                    <td className="p-4 font-semibold text-ink/80">{r.label}</td>
                                    <td className="p-4">
                                        <span className="flex items-start gap-2">
                                            {r.ollabsWins && (
                                                <Check size={16} className="text-brand-deep mt-0.5 shrink-0" />
                                            )}
                                            <span className="text-ink/80">{r.ollabs}</span>
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-start gap-2">
                                            {r.ollabsWins && <X size={16} className="text-muted mt-0.5 shrink-0" />}
                                            <span className="text-ink/70">{r.twibbonize}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="max-w-3xl mx-auto text-xs text-muted mt-3 leading-relaxed">
                    Based on Twibbonize’s own published help documentation on watermarks and its Remove Watermark
                    plan, current as of August 2026. Products change; if something here is out of date, tell us at{' '}
                    <a href="mailto:hello@ollabs.studio" className="text-brand-deep font-semibold hover:underline">
                        hello@ollabs.studio
                    </a>{' '}
                    and we will correct it.
                </p>
            </section>

            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-4">
                        Where Twibbonize is the better pick
                    </h2>
                    <p className="text-lg text-ink/75 leading-relaxed mb-4">
                        We would rather be straight with you than pretend there is no reason to use them. Twibbonize
                        is enormous, has been running for years, and has native mobile apps. It is especially
                        established in Indonesia and the Philippines. If you want an app on the App Store, or you are
                        running a campaign in a market where everyone already knows the Twibbonize name, that
                        familiarity is worth something.
                    </p>
                    <p className="text-lg text-ink/75 leading-relaxed">
                        Ollabs is newer and smaller. What we will not do is put an ad or a watermark or a payment
                        screen between your supporters and the thing you asked them to do.
                    </p>
                </div>
            </section>

            <section className="px-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-6">Common questions</h2>
                    <div className="space-y-5">
                        {faqs.map((f) => (
                            <div key={f.q} className="bg-cream border border-ink/10 rounded-2xl p-5">
                                <h3 className="font-display font-bold mb-2">{f.q}</h3>
                                <p className="text-ink/75 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 pb-24">
                <div className="max-w-3xl mx-auto bg-cream border border-ink/10 rounded-3xl p-10 text-center">
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-3">
                        Try it with one campaign
                    </h2>
                    <p className="text-ink/70 mb-7 max-w-xl mx-auto">
                        It takes about a minute and costs nothing. If it does not beat what you are using, you have
                        lost a minute.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex h-12 px-7 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:-translate-y-0.5 hover:brightness-105 transition-all"
                    >
                        Create a campaign
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
