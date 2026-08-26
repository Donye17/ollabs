import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

type Props = {
    /** Extra class on the outer footer (e.g. safe-area padding). */
    className?: string;
};

/**
 * Compact marketing footer. Guides live here so day/vs/explore match home.
 * Keep lean: no second Product column.
 */
export function SiteFooter({ className = '' }: Props) {
    return (
        <footer
            className={`border-t border-ink/10 bg-paper py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] ${className}`}
        >
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                <BrandMark href="/" size={24} />
                <nav className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1" aria-label="Footer">
                    <Link href="/guides" className="hover:text-brand-deep transition-colors">
                        Guides
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/about" className="hover:text-brand-deep transition-colors">
                        About
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/for" className="hover:text-brand-deep transition-colors">
                        Use cases
                    </Link>
                    <span aria-hidden className="text-ink/20">
                        ·
                    </span>
                    <Link href="/privacy" className="hover:text-brand-deep transition-colors">
                        Privacy
                    </Link>
                </nav>
                <p className="text-center sm:text-right">&copy; {new Date().getFullYear()} Ollabs</p>
            </div>
        </footer>
    );
}
