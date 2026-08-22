import Link from 'next/link';

/** Shared hub footer: "Made with" + logo. Mobile-friendly tap target. */
export function HubMadeWithFooter({ className = '' }: { className?: string }) {
    return (
        <footer className={`text-center ${className}`}>
            <Link
                href="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 px-4 text-sm text-muted hover:text-brand-deep transition-colors"
            >
                <span>Made with</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Ollabs Logo Black.png" alt="Ollabs" className="h-5 w-auto" />
            </Link>
        </footer>
    );
}
