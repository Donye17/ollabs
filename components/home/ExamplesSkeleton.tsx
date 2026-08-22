/** Placeholder shaped like the top-3 podium while campaigns load. */
export function ExamplesSkeleton() {
    return (
        <div className="flex items-end justify-center gap-3 sm:gap-4 py-2" aria-hidden>
            <div className="flex flex-col items-center gap-2 opacity-70">
                <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-ink/10 animate-pulse" />
                <div className="h-3 w-16 rounded bg-ink/10 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2 -mt-4">
                <div className="h-8 w-8 rounded-full bg-brand/30 animate-pulse" />
                <div className="w-[112px] h-[112px] sm:w-[128px] sm:h-[128px] rounded-full bg-ink/10 animate-pulse" />
                <div className="h-3 w-20 rounded bg-ink/10 animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2 opacity-70">
                <div className="h-7 w-7 rounded-full bg-ink/10 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-ink/10 animate-pulse" />
                <div className="h-3 w-16 rounded bg-ink/10 animate-pulse" />
            </div>
        </div>
    );
}
