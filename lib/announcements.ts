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
        id: '2026-09-02-manage-rename',
        date: '2026-09-02',
        title: 'Dashboard links survive a custom URL',
        summary: 'The manage link in your welcome email still opens after you change the campaign slug.',
        items: [
            'Renaming ollabs.studio/c/… used to 404 the dashboard URL from the welcome email, because only the public campaign page followed the redirect.',
            'The emailed /manage?k= link, a bookmarked dashboard, and Change the frame now follow the old slug the same way WhatsApp shares already did.',
        ],
    },
    {
        id: '2026-08-30-home-tool',
        date: '2026-08-30',
        title: 'Homepage is the tool now',
        summary: 'Type a campaign name on the first screen and the link updates. Colour rings moved into create.',
        items: [
            'The first screen is a live slug, one field, and Criar campanha. No second button, no colour swatches.',
            'The Mine Create Hub bar is gone from the marketing homepage so the thumb zone stays free.',
            'Guide cards live on /guides. Day pages stay at /day, linked from the homepage in one line.',
        ],
    },
    {
        id: '2026-08-29-campaign-path',
        date: '2026-08-29',
        title: 'Portuguese campaign pages, a working homepage demo, and a safer save',
        summary: 'Brazilian campaigns speak Portuguese. After a save you get profile-picture steps. WhatsApp in-app browsers get a way out if the download fails.',
        items: [
            'A supporter opening a Brazilian campaign sees Portuguese on the first paint, with counts as 1.926.',
            'Pick profile photo or story before you upload, then get one instruction for setting the picture after you save.',
            'Type a name on the homepage to see a live ollabs.studio/c link and carry it into Create.',
        ],
    },
    {
        id: '2026-08-28-guides-four-more',
        date: '2026-08-28',
        title: 'Four more guides: saving on iPhone, custom frames, manage, and keeping access',
        summary: 'Same Guides index. New pieces on the share sheet, the photo window, the dashboard, and recover.',
        items: [
            'New guides for saving a framed photo on iPhone, making a PNG that leaves room for the face, reading manage stats, and keeping a campaign when you switch phones.',
            'The longer campaign guide and the short hub and start pieces are unchanged.',
        ],
    },
    {
        id: '2026-08-28-guides-article',
        date: '2026-08-28',
        title: 'A longer guide for running a campaign people join',
        summary: 'New explainer on frames, the first hour on WhatsApp, and when to use a hub.',
        items: [
            'New guide: How to run a profile-picture campaign that people actually join, under Guides in the nav.',
            'Guides index now shows the author, date, and reading time for each piece.',
        ],
    },
    {
        id: '2026-08-28-locale-trees',
        date: '2026-08-28',
        title: 'Spanish, Indonesian, and Tagalog marketing pages retired',
        summary: 'Those language landings now send you to the English home. Product UI in those languages is unchanged.',
        items: [
            'Links to /es, /id, and /tl now redirect home. Portuguese at /pt is unchanged. Hindi at /hi stays as a small stub.',
            'Choosing Spanish, Indonesian, or Filipino in the language offer still switches the campaign and create screens. It no longer opens a separate marketing site.',
        ],
    },
    {
        id: '2026-08-28-contact-quiet-c',
        date: '2026-08-28',
        title: 'A Contact page, and quieter campaign pages',
        summary: 'Ads no longer sit on the frame tool. There is a public Contact page in the footer.',
        items: [
            'Campaign and hub pages no longer show ads. The frame, save, and share controls are unchanged.',
            'Footer now includes Contact, with email for support, press, bugs, and reporting a campaign.',
        ],
    },
    {
        id: '2026-08-27-contrast-thumbs',
        date: '2026-08-27',
        title: 'Clearer links, lighter home on phones',
        summary: 'Brand blue text is easier to read, and phones stop downloading desktop-only campaign thumbs.',
        items: [
            'Accent text and links use a deeper brand blue that meets contrast guidelines on the page background.',
            'Home on phones loads the three podium faces only, not the wider desktop grid.',
        ],
    },
    {
        id: '2026-08-26-home-hydration',
        date: '2026-08-26',
        title: 'Smoother home load',
        summary: 'Cold opens of the home page no longer fight a brief nav flicker on phones.',
        items: [
            'The top bar on home stays logo-only on first paint, matching what you see after the page settles.',
        ],
    },
    {
        id: '2026-08-26-home-perf',
        date: '2026-08-26',
        title: 'Faster home on phones',
        summary: 'Home no longer pulls multi-megabyte frame files before you see the page.',
        items: [
            'Top campaign thumbs use small explore photos only, not full frame PNGs.',
            'The awareness calendar loads when you scroll to it, with light color rings on the home strip.',
            'AdSense script waits for a tap or a few seconds so first paint stays clear.',
        ],
    },
    {
        id: '2026-08-26-nav-clarity',
        date: '2026-08-26',
        title: 'Clearer paths after you publish',
        summary: 'Hub vs campaign is clearer, Done lands in My campaigns, and SEO pages always offer a next step.',
        items: [
            'Empty hub explains that it is your public page and points you to Create first.',
            'After you publish, Done opens My campaigns. Hub setup stays an optional next step.',
            'Returning organizers see Continue in My campaigns on the home page.',
            'Use cases, day pages, guides, and locale landings end with Create plus Explore.',
        ],
    },
    {
        id: '2026-08-26-platform-polish',
        date: '2026-08-26',
        title: 'Platform polish pass',
        summary: 'Uniform mobile chrome, clearer campaign save/share, and Guides in more footers.',
        items: [
            'Back on phones across organizer pages, including Manage under the shared top bar.',
            'Create Continue, Save hub, Publish, and Sign in share one ink primary button.',
            'Campaign save bar no longer covers Copy image; share-photo CTA matches the share sheet.',
            'Marketing pages use notch-safe top padding and a shared footer with Guides.',
            'Thumb menu stays off Explore, Guides, About, and other browse pages.',
        ],
    },
    {
        id: '2026-08-25-mobile-nav',
        date: '2026-08-25',
        title: 'Easier mobile create',
        summary: 'Back control on phones, Continue clear of the tab bar, and a quieter organizer menu.',
        items: [
            'Back chevron in the top bar on phones so you can leave Create or Hub without jumping home. Manage has the same back control.',
            'Create Continue sits above the Mine · Create · Hub bar instead of under it.',
            'Thumb menu uses the same paper surface and equal tabs instead of a heavy dark plate.',
            'Organizer primary actions (Continue, Save hub, Publish) share one ink button style.',
        ],
    },
    {
        id: '2026-08-24-guides',
        date: '2026-08-24',
        title: 'Organizer guides',
        summary: 'Short explainers for starting a campaign and using your hub, plus a hint in the hub editor.',
        items: [
            'New guide: how to start a campaign, from frame upload to WhatsApp in the first hour.',
            'New guide: what a hub is, and when to share /u/ vs /c/.',
            'Home FAQ covers hub vs campaign. Hub editor links to the hub guide.',
            'Footer has a Guides column, plus a /guides index of all explainers.',
        ],
    },
    {
        id: '2026-08-24-lane-e',
        date: '2026-08-24',
        title: 'Quieter craft',
        summary: 'One soft shadow under frames, skeleton circles while Explore loads, and calmer type on marketing pages.',
        items: [
            'Circular frames share one ambient shadow. Buttons and chrome stay flat.',
            'Explore shows pulsing circle placeholders until each thumb paints.',
            'Section titles use bold. Heroes keep extrabold.',
        ],
    },
    {
        id: '2026-08-24-lane-d',
        date: '2026-08-24',
        title: 'Marketing pages with a real frame',
        summary: 'Home and SEO pages lead with a live campaign example, not decorative rings.',
        items: [
            'Home desktop shows a large framed campaign beside the headline.',
            'Use-case and day pages include one live example campaign with a real thumb.',
            'Hub editor labels use sentence case instead of all-caps section chrome.',
        ],
    },
    {
        id: '2026-08-24-lane-c',
        date: '2026-08-24',
        title: 'Organizer desktop that breathes',
        summary: 'Create, manage, hub, and Mine feel like documents on a wide screen, not phone cards stretched out.',
        items: [
            'Create keeps the live canvas beside the controls on large screens.',
            'Campaign manage is a wider document: inline share, stats as rows, less widget chrome.',
            'Hub editor shows a live /u preview beside the form on desktop.',
            'Mine lists live frame thumbs and sorts by recent supporter activity.',
        ],
    },
    {
        id: '2026-08-24-lane-b',
        date: '2026-08-24',
        title: 'Discovery with real frames',
        summary: 'Explore and the home top list show larger live frames, and desktop gets more campaigns at a glance.',
        items: [
            'Explore thumbs are larger, especially on desktop, with a wider grid.',
            'Home keeps the mobile podium and shows up to six campaigns on desktop.',
            'First-screen frame art is prefetched so custom overlays paint faster.',
        ],
    },
    {
        id: '2026-08-24-lane-a',
        date: '2026-08-24',
        title: 'Campaign page built for phones',
        summary: 'Bigger preview, clearer adjust step, WhatsApp-first after you save, and hubs lead with Join.',
        items: [
            'On /c the frame fills more of the screen. After you add a photo, drag and Size sit right under it.',
            'After you save, WhatsApp Share photo leads. Story share is next. The sticky save bar steps aside.',
            'Public hubs show a large featured frame and a full-width Join button above the fold.',
        ],
    },
    {
        id: '2026-08-23-home-explore-polish',
        date: '2026-08-23',
        title: 'Quieter home, real faces on Explore',
        summary: 'Less template chrome on the homepage, and campaign grids can show supporter photos.',
        items: [
            'Homepage sections trimmed: plain flow steps, flat closing CTA, text use-case links.',
            'Explore and the home podium pick a random supporter thumbnail when one exists.',
            'Saving a framed photo uploads a small public thumb for the grid (starts filling on new saves).',
        ],
    },
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
