/** Shape of the homepage questions block while that chunk loads. */
export function FaqSkeleton() {
    return (
        <section className="py-24 bg-paper2/50" aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading</span>
            <div className="max-w-lg mx-auto px-5">
                <div className="mx-auto mb-12 h-8 w-56 rounded-control bg-ink/10 animate-pulse" />
                <div className="space-y-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <div key={i} className="h-14 rounded-card border border-ink/10 bg-cream animate-pulse" />
                    ))}
                </div>
            </div>
        </section>
    );
}
