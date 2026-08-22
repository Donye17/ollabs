import { calendarWindow, formatOccurrence, countdownLabel, calendarDateParts, resolveFrame } from '@/lib/days';
import { getFrameOverrides } from '@/lib/dayFrames';
import type { StripItem } from '@/components/home/CalendarStrip';
import { HomeCalendarClient } from '@/components/home/HomeCalendarClient';

export async function HomeCalendarSection() {
    const frameOverrides = await getFrameOverrides();
    const calendarItems: StripItem[] = calendarWindow().map(({ day, occ, past }) => {
        const parts = calendarDateParts(day, occ);
        return {
            slug: day.slug,
            name: day.name,
            dateTop: parts.top,
            dateMain: parts.main,
            countdown: past ? formatOccurrence(day, occ) : countdownLabel(occ),
            past,
            frame: resolveFrame(day, frameOverrides.get(day.slug)),
        };
    });

    if (calendarItems.length === 0) return null;

    return (
        <section className="py-16 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-3">What is coming up</h2>
                <p className="text-ink/70">
                    Days worth marking, with a frame ready for each one. Pick a day, use the frame, or run it as
                    your own campaign.
                </p>
            </div>
            <div className="max-w-6xl mx-auto">
                <HomeCalendarClient items={calendarItems} />
            </div>
        </section>
    );
}
