/** Placeholder shaped like the top campaigns block while data loads. */
export function ExamplesSkeleton() {
    return (
        <>
            <div className="md:hidden flex items-end justify-center gap-3 sm:gap-4 py-2" aria-hidden>
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
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto px-2" aria-hidden>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                        <div className="w-36 h-36 lg:w-40 lg:h-40 rounded-full bg-ink/10 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-ink/10 animate-pulse" />
                        <div className="h-2.5 w-12 rounded bg-ink/10 animate-pulse" />
                    </div>
                ))}
            </div>
        </>
    );
}
