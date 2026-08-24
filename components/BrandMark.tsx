import Link from 'next/link';

type Props = {
    href?: string | null;
    size?: number;
    withWordmark?: boolean;
    className?: string;
};

/**
 * Cyan rounded square with a thick white ring, plus the wordmark.
 * Favicon files are the same mark rasterized; this SVG stays sharp in the UI.
 */
export function BrandMark({
    href = '/',
    size = 28,
    withWordmark = true,
    className = '',
}: Props) {
    const mark = (
        <span className="inline-flex items-center gap-2 min-h-[44px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/favicon/mark.svg"
                alt={withWordmark ? '' : 'Ollabs'}
                width={size}
                height={size}
                className="shrink-0"
            />
            {withWordmark ? (
                <span className="font-display font-bold tracking-tight text-ink text-[17px] sm:text-[19px]">
                    Ollabs
                </span>
            ) : null}
        </span>
    );

    if (!href) {
        return <span className={className}>{mark}</span>;
    }
    return (
        <Link href={href} className={`shrink-0 ${className}`}>
            {mark}
        </Link>
    );
}
