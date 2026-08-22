/** Placeholder while live campaign examples load. Matches mobile carousel height. */
export function ExamplesSkeleton() {
    return (
        <div className="flex items-center justify-center gap-3 py-2" aria-hidden>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={`rounded-full bg-ink/10 animate-pulse ${i === 1 ? 'w-[132px] h-[132px]' : 'w-20 h-20 opacity-60'}`}
                />
            ))}
        </div>
    );
}
