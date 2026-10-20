import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DayArticle, dayMetadata } from '@/app/day/[slug]/page';
import { dayPtSlugs } from '@/lib/daysPt';

export const revalidate = 3600;

export function generateStaticParams() {
    return dayPtSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    return dayMetadata(slug, 'pt');
}

export default async function PtDayPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!dayPtSlugs().includes(slug)) notFound();
    return DayArticle({ slug, locale: 'pt' });
}
