"use client";

import type { StripItem } from '@/components/home/CalendarStrip';
import { CalendarStrip } from '@/components/home/CalendarStrip';

/** Server-renders the calendar strip so "What is coming up" is never an empty heading. */
export function HomeCalendarClient({ items }: { items: StripItem[] }) {
    return <CalendarStrip items={items} />;
}
