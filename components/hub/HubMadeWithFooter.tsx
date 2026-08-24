import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

/** Shared hub footer: "Made with" + logo. Mobile-friendly tap target. */
export function HubMadeWithFooter({ className = '' }: { className?: string }) {
    return (
        <footer className={`text-center ${className}`}>
            <Link
                href="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 px-4 text-sm text-muted hover:text-brand-deep transition-colors"
            >
                <span>Made with</span>
                <BrandMark href={null} size={20} />
            </Link>
        </footer>
    );
}
