// Awareness calendar pages, rendered at /day/<slug>.
//
// These are product pages, not blog posts: each one explains a day AND lets the
// visitor make a frame for it without leaving. See OLLABS_CALENDAR_SPEC.md.
//
// Deliberately capped at ~40 entries. Google's March 2026 core update punished
// large template-built page sets, and the test that matters is whether each
// page answers a question no other page here already answers. Every entry needs
// real, specific editorial or it does not ship.

import { FrameConfig, FrameType } from '@/lib/types';

export type DateRule =
    | { type: 'fixed'; month: number; day: number }
    | { type: 'range'; from: [number, number]; to: [number, number] }
    | { type: 'month'; month: number }
    // weekday follows Date.getUTCDay(): 0 = Sunday, 3 = Wednesday.
    // e.g. Unity Day is { month: 10, weekday: 3, n: 3 } -> Oct 21 in 2026.
    | { type: 'nth-weekday'; month: number; weekday: number; n: number }
    // Giving Tuesday is { offsetDays: 5 } -> Dec 1 in 2026.
    | { type: 'after-thanksgiving'; offsetDays: number };

export interface AwarenessDay {
    slug: string;
    name: string;
    kind: 'day' | 'week' | 'month' | 'season';
    date: DateRule;
    colors: { name: string; hex: string }[];
    category: string;              // must be one of CATEGORY_KEYS
    audience: string[];
    keyword: string;
    tagline: string;
    intro: string[];
    background: string[];
    howOrgsMark: { title: string; body: string }[];
    campaignIdeas: string[];
    faqs: { q: string; a: string }[];
    // Optional. A day ships with a generated ring in its own colour and gets
    // upgraded to custom artwork later, so writing a page is never blocked on
    // someone drawing a frame first.
    frame?: FrameConfig;
    relatedUseCases: string[];
    relatedDays: string[];
}

/** The day's own artwork, or a clean ring built from its primary colour. */
export function resolveFrame(day: AwarenessDay): FrameConfig {
    if (day.frame) return day.frame;
    return {
        id: `day-${day.slug}`,
        type: FrameType.SOLID,
        name: day.name,
        color1: day.colors[0]?.hex ?? '#01BEF6',
        width: 22,
    };
}

// ---------------------------------------------------------------- date math

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];

function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
    const d = new Date(Date.UTC(year, month - 1, 1));
    let count = 0;
    while (true) {
        if (d.getUTCDay() === weekday) {
            count += 1;
            if (count === n) return d;
        }
        d.setUTCDate(d.getUTCDate() + 1);
    }
}

function thanksgiving(year: number): Date {
    return nthWeekday(year, 11, 4, 4); // 4th Thursday of November
}

/**
 * Resolve a rule to its next occurrence on or after `from`.
 *
 * Computed rather than stored so pages roll forward on their own. A calendar
 * showing last year's dates is the fastest way to look abandoned.
 */
export function nextOccurrence(rule: DateRule, from: Date = new Date()): { start: Date; end: Date } {
    const y = from.getUTCFullYear();
    const startOfDay = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const today = startOfDay(from);

    const build = (year: number): { start: Date; end: Date } => {
        switch (rule.type) {
            case 'fixed': {
                const s = new Date(Date.UTC(year, rule.month - 1, rule.day));
                return { start: s, end: s };
            }
            case 'month': {
                return {
                    start: new Date(Date.UTC(year, rule.month - 1, 1)),
                    end: new Date(Date.UTC(year, rule.month, 0)),
                };
            }
            case 'range': {
                const s = new Date(Date.UTC(year, rule.from[0] - 1, rule.from[1]));
                const endYear = rule.to[0] < rule.from[0] ? year + 1 : year;
                return { start: s, end: new Date(Date.UTC(endYear, rule.to[0] - 1, rule.to[1])) };
            }
            case 'nth-weekday': {
                const s = nthWeekday(year, rule.month, rule.weekday, rule.n);
                return { start: s, end: s };
            }
            case 'after-thanksgiving': {
                const t = thanksgiving(year);
                const s = new Date(t);
                s.setUTCDate(s.getUTCDate() + rule.offsetDays);
                return { start: s, end: s };
            }
        }
    };

    const thisYear = build(y);
    return thisYear.end >= today ? thisYear : build(y + 1);
}

export function formatOccurrence(day: AwarenessDay, occ: { start: Date; end: Date }): string {
    const s = occ.start, e = occ.end;
    const sameDay = s.getTime() === e.getTime();
    if (day.kind === 'month' && s.getUTCDate() === 1) return `${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
    if (sameDay) {
        return s.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    }
    const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
    const a = s.toLocaleDateString('en-US', { month: 'long', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }), timeZone: 'UTC' });
    const b = e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    return `${a} to ${b}`;
}

/** "12 days away", "Happening now", "Today". Drives the countdown in the hero. */
export function countdownLabel(occ: { start: Date; end: Date }, from: Date = new Date()): string {
    const today = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
    const days = Math.round((occ.start.getTime() - today.getTime()) / 86_400_000);
    if (days <= 0 && occ.end.getTime() >= today.getTime()) {
        return occ.start.getTime() === occ.end.getTime() ? 'Today' : 'Happening now';
    }
    if (days === 1) return 'Tomorrow';
    return `${days} days away`;
}

// ------------------------------------------------------------------- content

export const DAYS: AwarenessDay[] = [
    {
        slug: 'national-nonprofit-day',
        name: 'National Nonprofit Day',
        kind: 'day',
        date: { type: 'fixed', month: 8, day: 17 },
        colors: [{ name: 'Ollabs cyan', hex: '#01BEF6' }],
        category: 'cause',
        audience: ['Nonprofits', 'Foundations', 'Volunteers', 'Board members'],
        keyword: 'national nonprofit day profile picture frame',
        tagline: 'One day to say thank you to the people who keep the work going.',
        intro: [
            'National Nonprofit Day is a chance to point the spotlight at the people who usually stand behind it: the staff, volunteers, and board members who keep a mission running when nobody is watching.',
            'A profile frame is a small way to do that publicly. Your team, your volunteers, and your donors add it to their photo, and for a day your whole network is visibly part of the same thing. It takes a minute, it costs nothing, and nobody has to sign up.',
        ],
        background: [
            'National Nonprofit Day is marked each year on August 17. It was established to recognise the sector\'s contribution and, just as importantly, the individual people inside it who rarely get named in an annual report.',
            'It sits at a useful point in the calendar. Late August is after the summer lull and before the autumn fundraising season begins in earnest, which makes it a natural moment to re-engage a list that has gone quiet without asking anyone for money.',
        ],
        howOrgsMark: [
            {
                title: 'Thank staff and volunteers by name',
                body: 'The strongest posts on this day are specific. Naming five volunteers and what they actually did outperforms a generic thank-you graphic every time, because it gives those five people something to reshare.',
            },
            {
                title: 'Give the team something to wear',
                body: 'A shared profile frame turns a one-off post into a day-long presence. Every staff member who adds it puts your organisation in front of their own network, which is an audience your page cannot reach on its own.',
            },
            {
                title: 'Say what the year actually looked like',
                body: 'Not a highlight reel. One honest number, one thing that was harder than expected, one thing that worked. Donors read past polish, and August is a low-stakes moment to practise that voice before year-end appeals.',
            },
            {
                title: 'Ask for nothing',
                body: 'A day of gratitude with no donate button attached buys more goodwill than it costs in missed revenue. The ask lands better in November if August was genuinely a thank-you.',
            },
        ],
        campaignIdeas: [
            'Make a frame in your brand colours and send the link to staff and board the morning of August 17.',
            'Pair the frame with a post naming individual volunteers, and tag them so they can reshare it.',
            'Ask long-time volunteers for a one-sentence answer to "why do you keep showing up", and run them across the day.',
            'Send the frame link to partner organisations, so the day reads as a sector moment rather than self-promotion.',
            'Use the same frame internally on Slack and Teams avatars, not just public social.',
            'Save the campaign link. Run it again next August rather than starting over.',
        ],
        faqs: [
            { q: 'When is National Nonprofit Day?', a: 'August 17 every year. In 2026 it falls on a Monday, which makes it easy to build a full working day of posts around.' },
            { q: 'Is Ollabs free for nonprofits?', a: 'Yes, and it stays free. No signup, no ads, and no watermark on the photo your supporters download. We never charge supporters, which is the difference between us and most alternatives.' },
            { q: 'Do our staff and volunteers need accounts?', a: 'No. They open the link, add their photo, and download it. There is nothing to install and nothing to sign up for.' },
            { q: 'Can we use our own logo and brand colours?', a: 'Yes. Set exact hex values, or upload a finished frame design as a transparent PNG.' },
            { q: 'Can we reuse the campaign next year?', a: 'Yes. Keep the dashboard link, or start a fresh campaign with the same design so the new year gets its own supporter count.' },
        ],
        // Designed overlay from scripts/frames/national_nonprofit_day.py.
        // cutoutScale 0 because the PNG already carries its own transparent
        // photo window; anything higher punches a second hole in the middle.
        frame: {
            id: 'day-national-nonprofit-day',
            type: FrameType.CUSTOM_IMAGE,
            name: 'National Nonprofit Day',
            color1: 'transparent',
            width: 0,
            imageUrl: '/frames/national-nonprofit-day.png',
            cutoutScale: 0,
        },
        relatedUseCases: ['nonprofits', 'fundraisers', 'companies'],
        relatedDays: ['national-smores-day'],
    },
    {
        slug: 'national-smores-day',
        name: "National S'mores Day",
        kind: 'day',
        date: { type: 'fixed', month: 8, day: 10 },
        colors: [
            { name: 'Chocolate', hex: '#603018' },
            { name: 'Graham', hex: '#D89060' },
            { name: 'Campfire', hex: '#F97316' },
        ],
        category: 'event',
        audience: ['Summer camps', 'Scout troops', 'Youth programs', 'Campgrounds', 'Cafes and bakeries'],
        keyword: "national s'mores day profile picture frame",
        tagline: 'The last great excuse of the summer, and the easiest one to get a whole camp to join in on.',
        intro: [
            "National S'mores Day lands on August 10, which is almost perfectly placed: peak camp season, a couple of weeks before school starts, and right when everyone is trying to hold on to summer a little longer.",
            'It is a low-stakes day, and that is the point. Nobody needs convincing to celebrate s\'mores. Share one link, and camp staff, counsellors, scouts, parents, and alumni can all put the same frame on their photo in about ten seconds.',
        ],
        background: [
            "The first published s'mores recipe appeared in 1927, in a Girl Scouts handbook called Tramping and Trailing with the Girl Scouts, under the name \"Some More\" and credited to troop leader Loretta Scott Crew. It was written to feed sixteen scouts around a fire.",
            "It was not the invention, though. A 1925 Memphis Commercial Appeal column reporting from a Girl Scout camp already carried the recipe, so troops were making them before anyone wrote it down. The contracted spelling we use now did not show up in print until the 1970s.",
            'That history is the reason this day belongs to camps and scout troops more than to brands. It started around a real campfire, with real kids, and the organisations that own that story authentically are the ones whose posts land.',
        ],
        howOrgsMark: [
            {
                title: 'Close out the camp season',
                body: 'For most summer camps August 10 falls in the final session or just after it. A shared frame gives departing campers and counsellors something to post while the summer is still fresh, which is exactly when they are most likely to say something nice about you unprompted.',
            },
            {
                title: 'Give staff and counsellors the link first',
                body: 'Counsellors have the audience that matters: other counsellors, parents, and prospective families. Send them the link a day early so the frames are already up when families start posting.',
            },
            {
                title: 'Pair it with registration',
                body: 'Early registration for next summer usually opens in the autumn. A warm, no-ask post in August costs nothing and puts you back in the feed of every family who spent this summer with you.',
            },
            {
                title: 'Food businesses have the easiest version of this',
                body: 'If you sell anything remotely s\'mores adjacent, this is a day with built-in search demand and no competition for the frame. Put the link on the counter with a QR code and let customers do the posting.',
            },
        ],
        campaignIdeas: [
            'Send the frame link to camp staff and counsellors the evening of August 9, so the frames are live first thing.',
            'Run a "best campfire photo" thread and ask everyone entering to wear the frame.',
            'Scout troops: pair it with the 1927 origin story. It is a genuinely good piece of trivia and it belongs to scouting.',
            'Print the campaign QR code for a camp noticeboard or a shop counter.',
            'Ask alumni families to post a photo from the summer they attended, framed.',
            'Save the campaign and run it again next August. It is the same date every year.',
        ],
        faqs: [
            { q: "When is National S'mores Day?", a: 'August 10 every year. In 2026 it falls on a Monday.' },
            { q: 'Who actually invented s\'mores?', a: 'Nobody knows for certain. The first published recipe was in a 1927 Girl Scouts handbook, credited to troop leader Loretta Scott Crew, but a 1925 newspaper column from a Girl Scout camp shows troops were already making them.' },
            { q: 'Is this free to use?', a: 'Yes. No signup, no ads, and no watermark on the photo anyone downloads. We never charge supporters.' },
            { q: 'Can we put our camp or business logo on it?', a: 'Yes. Upload your own frame design as a transparent PNG, or set your own colours in the builder.' },
            { q: 'Do campers and parents need an account?', a: 'No. They open the link, add a photo, and download. Nothing to install and nothing to join.' },
        ],
        // Illustrated overlay, inset so the circular crop does not slice the
        // outermost marshmallows and graham crackers.
        frame: {
            id: 'day-national-smores-day',
            type: FrameType.CUSTOM_IMAGE,
            name: "National S'mores Day",
            color1: 'transparent',
            width: 0,
            imageUrl: '/frames/national-smores-day.png',
            cutoutScale: 0,
        },
        relatedUseCases: ['events', 'schools', 'companies'],
        relatedDays: ['national-nonprofit-day'],
    },
];

export function getDay(slug: string): AwarenessDay | undefined {
    return DAYS.find((d) => d.slug === slug);
}

/** Days sorted by how soon they are next happening. Drives the /day index. */
export function daysByUpcoming(from: Date = new Date()): { day: AwarenessDay; occ: { start: Date; end: Date } }[] {
    return DAYS
        .map((day) => ({ day, occ: nextOccurrence(day.date, from) }))
        .sort((a, b) => a.occ.start.getTime() - b.occ.start.getTime());
}

export interface CalendarEntry {
    day: AwarenessDay;
    occ: { start: Date; end: Date };
    past: boolean;
}

/**
 * A window of entries around today, for the home page timeline.
 *
 * Every day here recurs annually, so "past" means this year's occurrence has
 * already been and gone. We look back one year and forward one so the strip
 * still reads as a continuous timeline when only a handful of days exist.
 */
export function calendarWindow(
    from: Date = new Date(),
    pastCount = 4,
    futureCount = 8,
    // Only look back this far. Without a limit, a day that has not come round
    // yet this year surfaces last year's date instead, so in August you would
    // see "August 10, 2025" sitting two days before the 2026 one.
    pastWindowDays = 120,
): CalendarEntry[] {
    const today = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
    const earliest = today.getTime() - pastWindowDays * 86_400_000;
    const seen = new Set<string>();
    const all: CalendarEntry[] = [];

    for (const day of DAYS) {
        // this year's and next year's occurrence, so a passed date still
        // appears behind us rather than vanishing to twelve months ahead
        for (const probe of [
            new Date(Date.UTC(today.getUTCFullYear() - 1, 0, 1)),
            today,
        ]) {
            const occ = nextOccurrence(day.date, probe);
            const key = `${day.slug}:${occ.start.getTime()}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const past = occ.end.getTime() < today.getTime();
            if (past && occ.start.getTime() < earliest) continue;
            all.push({ day, occ, past });
        }
    }

    all.sort((a, b) => a.occ.start.getTime() - b.occ.start.getTime());
    const past = all.filter((e) => e.past).slice(-pastCount);
    const future = all.filter((e) => !e.past).slice(0, futureCount);
    return [...past, ...future];
}
