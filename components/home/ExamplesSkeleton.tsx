/** Placeholder shaped like the top campaigns fan while data loads. */
export function ExamplesSkeleton() {
    return (
        <div className="campaign-fan-set" aria-hidden>
            <div className="campaign-fan">
                <div className="absolute left-0 top-[var(--fan-drop)] z-[1] h-[var(--fan-side)] w-[var(--fan-side)] -rotate-[14deg] rounded-avatar bg-frame-green/25 animate-pulse" />
                <div className="absolute left-[calc(var(--fan-step)-(var(--fan-center)-var(--fan-side))/2)] top-0 z-[3] h-[var(--fan-center)] w-[var(--fan-center)] rounded-avatar bg-brand/20 animate-pulse" />
                <div className="absolute left-[calc(var(--fan-step)*2)] top-[var(--fan-drop)] z-[2] h-[var(--fan-side)] w-[var(--fan-side)] rotate-[14deg] rounded-avatar bg-frame-purple/30 animate-pulse" />
            </div>
            <div className="campaign-fan-labels">
                <div className="mx-auto h-3 w-16 rounded bg-ink/10 animate-pulse" />
                <div className="mx-auto h-3 w-20 rounded bg-ink/10 animate-pulse" />
                <div className="mx-auto h-3 w-16 rounded bg-ink/10 animate-pulse" />
            </div>
        </div>
    );
}
