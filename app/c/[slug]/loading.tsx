/** Frame, title, and save control while the campaign row is still loading. No nav: the campaign page itself has none. */
export default function CampaignLoading() {
    return (
        <main
            className="min-h-screen bg-paper text-ink flex flex-col items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))]"
            aria-busy="true"
            aria-live="polite"
        >
            <span className="sr-only">Loading</span>
            <div className="mb-4 mt-2 h-11 w-28 rounded-control bg-ink/10 animate-pulse" />
            <div className="flex w-full max-w-sm flex-col items-center gap-3">
                <div className="h-7 w-48 rounded-control bg-ink/10 animate-pulse" />
                <div className="h-4 w-64 max-w-full rounded bg-ink/10 animate-pulse" />
                <div className="mt-2 h-[min(60dvh,420px)] w-full max-w-[420px] rounded-avatar bg-ink/10 animate-pulse" />
                <div className="mt-4 h-14 w-full rounded-control bg-ink/10 animate-pulse" />
            </div>
        </main>
    );
}
