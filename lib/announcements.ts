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
        id: '2026-08-23-cool-paper-mark',
        date: '2026-08-23',
        title: 'Cooler paper, same O',
        summary: 'The site background is a cooler white, and the logo is the cyan square with a white ring.',
        items: [
            'Page background moved off warm cream onto cool paper.',
            'Favicon, app icons, and in-product logos use the blue mark with a thick white circle.',
        ],
    },
    {
        id: '2026-08-23-join-cta',
        date: '2026-08-23',
        title: 'Hubs say Join, not Support',
        summary: 'The big hub button means put on the frame, not donate. Phones also drop the duplicate top Create and My campaigns links.',
        items: [
            'Public hubs use Join (Participar, Gabung, Unirme, Sumali) above the campaign title.',
            'On phones, Mine Create Hub at the bottom is enough, so the top bar stays logo-only.',
        ],
    },
    {
        id: '2026-08-23-hub-framed-avatar',
        date: '2026-08-23',
        title: 'Frame your hub photo with a campaign',
        summary: 'On /hub, pick one of your campaign frames, drop in a photo, and use the result as your bio picture.',
        items: [
            'Hub photo can use any campaign frame you already published, the same way supporters wear a frame.',
            'Plain upload is still there if you want a photo without a frame.',
        ],
    },
    {
        id: '2026-08-22-path-p3',
        date: '2026-08-22',
        title: 'Story share, safer manage links, hub waitlist',
        summary: 'Share a 9:16 story crop after you save, manage cookies drop the key from the address bar, and organizers can raise a hand for paid hub upgrades.',
        items: [
            'After you frame a photo, Share as story builds a tall 9:16 PNG for Instagram and WhatsApp status.',
            'Opening your manage link sets a short cookie and clears ?k= from the URL so screenshots leak less.',
            'On your hub editor, you can join the waitlist for paid upgrades. No billing yet.',
            'Campaigns with enough distinct reports hide from Explore automatically.',
        ],
    },
    {
        id: '2026-08-22-path-full',
        date: '2026-08-22',
        title: 'Hubs, explore, and day pages push harder toward Share',
        summary: 'Bio hubs get themes and tap counts, Explore leans toward your country, and calendar days open WhatsApp with one tap.',
        items: [
            'Hub Support labels match Portuguese, Bahasa, Spanish, and Filipino when your browser does.',
            'Reorder hub links, hide extra campaigns, pick a theme, and see Support and link tap counts.',
            'Starter frame packs for Brasil, Indonesia, Pilipinas, México, and Nigeria sit above colour rings.',
            'Explore softly boosts campaigns from your country. Manage shows supporter countries.',
            'Day pages share on WhatsApp and unfurl with the day frame art.',
        ],
    },
    {
        id: '2026-08-22-path-ab',
        date: '2026-08-22',
        title: 'Share faster after save, claim your hub in one tap',
        summary: 'Supporters get a clearer next step, and organizers get a live bio link tied to the campaign they just published.',
        items: [
            'After you save a framed photo, Share leads on phones so WhatsApp and Save Image stay obvious.',
            'Publishing while signed in can claim your /u hub and feature that campaign without a detour.',
            'Hubs show the featured campaign as a Support card with preview and supporter count.',
            'Zero-supporter campaigns get a Share now nudge on manage and mine, plus an optional email after about 20 minutes.',
            'Opaque custom frames warn before publish when the PNG has no clear photo window.',
        ],
    },
    {
        id: '2026-08-22-about',
        date: '2026-08-22',
        title: 'A short About page',
        summary: 'Who Ollabs is for, how it stays free, and how to reach us.',
        items: [
            'New About page at /about with contact at hello@ollabs.studio.',
            'Linked from the home footer next to Privacy and Terms.',
            'Campaign emails now reply to hello@ so organizers can reach you.',
        ],
    },
    {
        id: '2026-08-22-filipino-use-cases',
        date: '2026-08-22',
        title: 'More campaign guides in Filipino',
        summary: 'Organizers in the Philippines can find a starting point that fits their community.',
        items: [
            'New Filipino guides cover churches, schools, events, communities, and awareness campaigns.',
            'A Filipino Ollabs and Twibbonize comparison explains the differences honestly.',
            'Portuguese, Bahasa, Spanish, and Filipino use cases now each have their own directory.',
        ],
    },
    {
        id: '2026-08-22-sharing-and-discovery',
        date: '2026-08-22',
        title: 'Sharing speaks more of your language',
        summary: 'Campaign links are easier to send and useful pages are easier to find.',
        items: [
            'WhatsApp share messages now support Spanish and Tagalog, alongside English, Portuguese, and Bahasa.',
            'The publish screen keeps WhatsApp in view and gives one calm reminder before an unshared campaign is closed.',
            'Home now links directly to calendar moments, use cases, comparisons, and every language landing.',
        ],
    },
    {
        id: '2026-08-22-campaign-thumb-zone',
        date: '2026-08-22',
        title: 'Campaign pages keep the thumb zone clear',
        summary: 'Supporters opening a link only see the frame job, not organizer navigation.',
        items: [
            'Mine, Create, and Hub stay on organizer screens (home, create, mine, hub).',
            'Public campaign and hub pages no longer show the bottom tab bar, so Save or share sits flush at the bottom.',
            'Language offers stay out of the way of save and publish buttons.',
        ],
    },
    {
        id: '2026-08-22-mobile-tab-bar',
        date: '2026-08-22',
        title: 'Create, Mine, and Hub on organizer phone screens',
        summary: 'A clearer bottom tab bar so you can move around without hunting for links.',
        items: [
            'Mine, Create, and Hub stay fixed at the bottom on organizer mobile pages.',
            'Create sits raised in the middle on a dark bar so it is easy to spot with your thumb.',
            'Save and share bars on create sit above the tab bar.',
        ],
    },
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
