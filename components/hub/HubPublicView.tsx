import Link from 'next/link';
import { ExternalLink, Users } from 'lucide-react';
import type { PublicHub } from '@/lib/hub';
import { AdSlot } from '@/components/AdSlot';
import { HubMadeWithFooter } from '@/components/hub/HubMadeWithFooter';

/** Mobile-first Linktree column. Primary job: push people into /c for the frame. */
export function HubPublicView({ hub }: { hub: PublicHub }) {
    const ctaHref = hub.featured ? `/c/${hub.featured.slug}` : null;

    return (
        <div className="min-h-screen bg-paper text-ink">
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.35]"
                style={{
                    background:
                        'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(1,190,246,0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255,92,57,0.08), transparent 50%)',
                }}
                aria-hidden
            />

            <div className="relative mx-auto max-w-md px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
                <header className="flex flex-col items-center text-center pt-6 pb-8">
                    {hub.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={hub.avatarUrl}
                            alt=""
                            className="h-24 w-24 rounded-full object-cover border-2 border-ink/10 bg-cream shadow-sm"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-brand/25 border-2 border-ink/10 flex items-center justify-center font-display text-3xl font-extrabold text-brand-deep">
                            {hub.displayName.replace(/^@/, '').slice(0, 1).toUpperCase()}
                        </div>
                    )}
                    <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
                        {hub.displayName}
                    </h1>
                    <p className="mt-1 text-sm text-muted">@{hub.handle}</p>
                    {hub.bio && (
                        <p className="mt-3 text-[15px] leading-relaxed text-ink/80 max-w-sm">
                            {hub.bio}
                        </p>
                    )}
                </header>

                <div className="space-y-3">
                    {ctaHref && hub.featured && (
                        <Link
                            href={ctaHref}
                            className="flex w-full min-h-14 flex-col items-center justify-center gap-0.5 rounded-2xl bg-brand px-5 py-4 text-center shadow-sm transition-all hover:brightness-105 active:scale-[0.99]"
                        >
                            <span className="text-base font-bold text-ink">Support</span>
                            <span className="text-sm font-semibold text-ink/85 truncate max-w-[92%]">
                                {hub.featured.title}
                            </span>
                        </Link>
                    )}

                    {hub.links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full min-h-12 items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-cream px-5 py-3.5 text-[15px] font-semibold text-ink transition-colors hover:bg-paper2"
                        >
                            <span className="truncate">{link.title}</span>
                            <ExternalLink size={16} className="shrink-0 text-muted" />
                        </a>
                    ))}

                    {hub.campaigns.length > 0 && (
                        <div className="pt-4">
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted px-1">
                                More campaigns
                            </p>
                            <ul className="space-y-2">
                                {hub.campaigns.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/c/${c.slug}`}
                                            className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream/80 px-4 py-3 transition-colors hover:bg-cream"
                                        >
                                            {c.preview_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={c.preview_url}
                                                    alt=""
                                                    className="h-11 w-11 rounded-xl object-cover border border-ink/10"
                                                />
                                            ) : (
                                                <div className="h-11 w-11 rounded-xl bg-brand/20 border border-ink/10" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="font-display font-bold truncate text-[15px]">
                                                    {c.title}
                                                </p>
                                                {c.supporter_count != null && c.supporter_count > 0 && (
                                                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                                                        <Users size={11} />
                                                        {c.supporter_count.toLocaleString()} supporters
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!ctaHref && hub.links.length === 0 && hub.campaigns.length === 0 && (
                        <p className="text-center text-sm text-muted py-8">
                            This hub is not ready yet.
                        </p>
                    )}
                </div>

                {/* One quiet unit below the links / campaigns — after the job of the
                    page (get people into /c), never above the featured support CTA. */}
                <div className="mt-8">
                    <AdSlot surface="seo" />
                </div>

                <HubMadeWithFooter className="mt-12 pb-[max(1rem,env(safe-area-inset-bottom))]" />
            </div>
        </div>
    );
}
