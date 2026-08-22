import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ANNOUNCEMENTS, formatAnnouncementDate } from '@/lib/announcements';

export function UpdatesList() {
    return (
        <div className="space-y-5">
            {ANNOUNCEMENTS.map((entry, index) => (
                <article
                    key={entry.id}
                    className="bg-cream border border-ink/10 rounded-2xl p-5 sm:p-6"
                >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <time
                            dateTime={entry.date}
                            className="text-[11px] font-bold uppercase tracking-wider text-muted"
                        >
                            {formatAnnouncementDate(entry.date)}
                        </time>
                        {index === 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 border border-brand/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-deep">
                                <Sparkles size={11} /> Latest
                            </span>
                        )}
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-ink mb-1">
                        {entry.title}
                    </h2>
                    {entry.summary && (
                        <p className="text-sm text-ink/70 mb-4 leading-relaxed">{entry.summary}</p>
                    )}
                    <ul className="space-y-2.5">
                        {entry.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-ink/80 leading-relaxed">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </article>
            ))}

            <div className="rounded-2xl border border-brand/20 bg-brand/10 px-5 py-5 sm:px-6 text-center">
                <p className="text-sm text-ink/80 mb-4 leading-relaxed">
                    We ship often. Have feedback or a feature idea? We read every message.
                </p>
                <Link
                    href="/create"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-ink hover:brightness-105 active:brightness-95 transition-all mr-3"
                >
                    Create a campaign
                    <ArrowRight size={16} />
                </Link>
                <a
                    href="mailto:feedback@ollabs.studio?subject=Ollabs%20feedback"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-ink/15 bg-paper px-5 text-sm font-bold text-ink hover:bg-ink/5 transition-colors"
                >
                    Send feedback
                </a>
            </div>
        </div>
    );
}
