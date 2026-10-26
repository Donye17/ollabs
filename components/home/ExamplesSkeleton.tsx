/** Three small circles while the proof row loads. Not a second hero. */
export function ExamplesSkeleton() {
    return (
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 px-5" aria-hidden>
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-ink/10" />
                    <div className="h-3 w-16 animate-pulse rounded bg-ink/10" />
                </div>
            ))}
        </div>
    );
}
