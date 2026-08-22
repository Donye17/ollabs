"use client";

import dynamic from 'next/dynamic';
import type { StripItem } from '@/components/home/CalendarStrip';

const CalendarStrip = dynamic(
    () => import('@/components/home/CalendarStrip').then((m) => ({ default: m.CalendarStrip })),
    {
        ssr: false,
        loading: () => <div className="h-[280px] mx-6 rounded-2xl bg-ink/[0.04] animate-pulse" aria-hidden />,
    }
);

export function HomeCalendarClient({ items }: { items: StripItem[] }) {
    return <CalendarStrip items={items} />;
}
