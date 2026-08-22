import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { ArrowRight, Check } from 'lucide-react';

const URL = 'https://ollabs.studio/vs/linktree';

export const metadata: Metadata = {
    title: 'Ollabs vs Linktree for campaigns',
    description:
        'Linktree lists your links. Ollabs adds profile picture frame campaigns and a Support button that opens your twibbon-style page. Free hub at /u/your-handle.',
    alternates: { canonical: URL },
    openGraph: { url: URL, title: 'Ollabs vs Linktree', siteName: 'Ollabs', images: ['/og.png'] },
};

const rows = [
    { label: 'Profile picture frame campaigns', ollabs: 'Built in', linktree: 'Not included' },
    { label: 'Link-in-bio page', ollabs: 'Free hub at /u/handle', linktree: 'Free tier limited' },
    { label: 'Supporter downloads', ollabs: 'No watermark', linktree: 'N/A' },
    { label: 'Account to create', ollabs: 'Optional', linktree: 'Required for editing' },
    { label: 'Price for organizers', ollabs: 'Free', linktree: 'Paid tiers for more links' },
];

export default function VsLinktreePage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="relative pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.5rem)] pb-12 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4">Ollabs vs Linktree</h1>
                    <p className="text-base sm:text-lg text-ink/70 mb-8 leading-relaxed">
                        Linktree is great at listing links. Ollabs is built for the moment people actually change their
                        profile picture for your cause. You get a hub like Linktree plus frame campaigns that convert.
                    </p>
                    <Link href="/create" className="inline-flex min-h-[48px] px-6 rounded-xl bg-brand text-ink font-bold items-center gap-2 hover:brightness-105 transition-all">
                        Create a campaign <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
            <section className="px-4 sm:px-6 pb-16">
                <div className="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-ink/10 bg-cream">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-ink/10">
                                <th className="text-left p-4 font-display font-extrabold w-[40%]" />
                                <th className="text-left p-4 font-display font-extrabold text-brand-deep">Ollabs</th>
                                <th className="text-left p-4 font-display font-extrabold text-muted">Linktree</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.label} className="border-b border-ink/5 last:border-0">
                                    <td className="p-4 font-semibold text-ink/80">{r.label}</td>
                                    <td className="p-4">
                                        <span className="flex items-start gap-2 text-ink/80">
                                            <Check size={16} className="text-brand-deep shrink-0 mt-0.5" />
                                            {r.ollabs}
                                        </span>
                                    </td>
                                    <td className="p-4 text-ink/70">{r.linktree}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="max-w-3xl mx-auto text-sm text-ink/70 mt-8 leading-relaxed">
                    Many organizers use both: Linktree for static links, Ollabs when they need thousands of people to
                    wear the same frame. Ollabs hubs combine both jobs in one free page.
                </p>
                <div className="max-w-3xl mx-auto mt-8 flex flex-wrap gap-3">
                    <Link href="/hub" className="min-h-[44px] px-5 rounded-xl border border-ink/15 font-bold inline-flex items-center hover:bg-ink/5">
                        Set up your hub
                    </Link>
                    <Link href="/vs/twibbonize" className="min-h-[44px] px-5 rounded-xl border border-ink/15 font-bold inline-flex items-center hover:bg-ink/5">
                        Compare to Twibbonize
                    </Link>
                </div>
            </section>
        </main>
    );
}
