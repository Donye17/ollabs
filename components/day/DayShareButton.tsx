'use client';

import { WhatsAppGlyph, WHATSAPP_GREEN } from '@/components/ShareGlyphs';
import { whatsappUrl } from '@/lib/share';
import { track, withUtm } from '@/lib/analytics';

/** Share this calendar day page into WhatsApp (conversion path for /day). */
export function DayShareButton({
    dayName,
    daySlug,
}: {
    dayName: string;
    daySlug: string;
}) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ollabs.studio';
    const url = `${origin}/day/${daySlug}`;
    const text = `Free ${dayName} profile picture frame on Ollabs:`;

    return (
        <a
            href={whatsappUrl(text, withUtm(url, 'whatsapp'))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('day_share', { day: daySlug, platform: 'whatsapp' })}
            className="w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white hover:brightness-105 transition-all"
            style={{ backgroundColor: WHATSAPP_GREEN }}
        >
            <WhatsAppGlyph size={16} /> Share this day on WhatsApp
        </a>
    );
}
