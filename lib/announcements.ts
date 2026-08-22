/**
 * Public changelog. Newest first.
 *
 * Add an entry when something user-visible ships. Keep bullets plain and
 * specific so organizers can see the product is alive. No em dashes.
 */

export type Announcement = {
    id: string;
    /** ISO date (YYYY-MM-DD), shown in the UI. */
    date: string;
    title: string;
    /** One-line context under the title. Optional. */
    summary?: string;
    items: string[];
};

export const ANNOUNCEMENTS: Announcement[] = [
    {
        id: '2026-08-22-home-podium',
        date: '2026-08-22',
        title: 'Home shows the top three campaigns',
        summary: 'Real traction up front, not a scrolling reel of everything new.',
        items: [
            'Hero Explore campaigns opens the full explore page.',
            'Home podium ranks the top three live campaigns by supporters, with first place in the middle.',
            'Explore all campaigns sits under the podium when you want more.',
        ],
    },
    {
        id: '2026-08-22-organizer-growth',
        date: '2026-08-22',
        title: 'Organizer tools and more languages',
        summary: 'Easier hubs, clearer stats, and more ways to reach your market.',
        items: [
            'First-supporter email when someone joins your campaign, so you know when to share again.',
            'Country breakdown on My campaigns: where you published from and where your first supporters joined.',
            'Suggested hub handle after publish and on /hub, so claiming /u/your-name is one tap.',
            'Messenger share on the publish screen for Indonesia and Tagalog browsers.',
            'Six Spanish use-case pages at /es/for and a Spanish Twibbonize comparison at /es/vs/twibbonize.',
            'Language banner offers for Tagalog, Hindi, and Spanish landings.',
        ],
    },
    {
        id: '2026-08-22-mobile-seo',
        date: '2026-08-22',
        title: 'Mobile-first organizer shell and market pages',
        summary: 'Everything important stays at your thumb on a phone.',
        items: [
            'My campaigns always visible in the top nav on mobile and in the /create sticky bar.',
            'Bottom nav on organizer pages: Create, Mine, Hub.',
            'Campaign hub footer shows Made with and the Ollabs logo on public /u pages.',
            'Reuse frame from My campaigns opens /create with your frame loaded.',
            'Portuguese and Bahasa /for pages plus Twibbonize comparison pages for each.',
            'Tagalog, Hindi, and Spanish home landings at /tl, /hi, and /es.',
            'Calendar pages for Nigeria, Mexico, Malaysia, Philippines, and Thailand.',
            'Publisher and supporter country tracking to see where campaigns travel.',
        ],
    },
    {
        id: '2026-08-15-iphone-save',
        date: '2026-08-15',
        title: 'Reliable photo save on iPhone',
        summary: 'Especially inside WhatsApp and Instagram in-app browsers.',
        items: [
            'Save or share photo leads with the share sheet on iOS so photos land in your library, not a dead download link.',
            'Download still works on desktop and Android where the browser supports it.',
        ],
    },
    {
        id: '2026-08-launch-basics',
        date: '2026-08-01',
        title: 'Ollabs launch',
        summary: 'Free profile picture campaigns with no watermark on supporters.',
        items: [
            'Create a custom frame, publish one link, and share it anywhere.',
            'Supporters add their photo in the browser with no signup and no watermark.',
            'Live supporter counter on every campaign.',
            'Optional organizer email for dashboard access and milestone updates.',
            'Organizer hubs at /u/your-handle with a Support button and extra links.',
        ],
    },
];

export function formatAnnouncementDate(iso: string): string {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
