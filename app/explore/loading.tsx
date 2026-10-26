import { NavBar } from '@/components/NavBar';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

/** Grid of circles while Explore's campaign list is still on the server. */
export default function ExploreLoading() {
    return (
        <main className="min-h-screen bg-paper text-ink" aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading</span>
            <NavBar />
            <div className={`${PAGE_TOP_UNDER_NAV} px-6 pb-10`}>
                <div className="max-w-6xl mx-auto">
                    <div className="h-9 w-40 rounded-control bg-ink/10 animate-pulse" />
                    <div className="mt-3 h-4 w-72 max-w-full rounded bg-ink/10 animate-pulse" />
                    <div className="mt-8 flex gap-2">
                        {Array.from({ length: 3 }, (_, i) => (
                            <div key={i} className="h-11 w-24 rounded-avatar bg-ink/10 animate-pulse" />
                        ))}
                    </div>
                    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {Array.from({ length: 8 }, (_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className="h-32 w-32 sm:h-36 sm:w-36 rounded-avatar bg-ink/10 animate-pulse" />
                                <div className="h-3 w-20 rounded bg-ink/10 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
