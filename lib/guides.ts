/** Organizer how-to guides. Plain language, no em dashes. */

export type GuideSection = {
    title: string;
    paragraphs?: string[];
    steps?: { title: string; body: string }[];
    bullets?: string[];
    image?: { src: string; alt: string; caption?: string };
    /** Owner-produced screenshot. Rendered as an HTML comment until the file exists. */
    screenshot?: string;
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
    slug: string;
    title: string;
    description: string;
    subtitle: string;
    author: { name: string; role: string };
    publishedAt: string;
    updatedAt?: string;
    readingMinutes: number;
    heroImage?: { src: string; alt: string; caption?: string };
    sections: GuideSection[];
    faqs: GuideFaq[];
    cta: { href: string; label: string };
};

const AUTHOR = { name: 'Donye', role: 'Founder of Ollabs' };

export function sectionAnchor(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function formatGuideDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    const names = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return `${names[(m || 1) - 1]} ${d}, ${y}`;
}

/** Newest first. Array order breaks ties, so keep new guides at the top of GUIDES. */
export function recentGuides(n = 3): Guide[] {
    return [...GUIDES]
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, n);
}

export const GUIDES: Guide[] = [
    {
        slug: 'run-a-campaign-people-join',
        title: 'How to run a profile-picture campaign that people actually join',
        description:
            'What to put on the frame, why the first hour on WhatsApp decides the outcome, how to write the ask, what to do when the counter stalls, and when a hub link beats a campaign link.',
        subtitle:
            'A campaign is a picture and a link, sent to people who already talk to each other. Most Ollabs traffic is phones and WhatsApp. The large majority of campaigns are Brazilian. The rest of this guide is what to do with that.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 8,
        sections: [
            {
                title: 'What the frame should actually say',
                screenshot:
                    'the frame builder with a transparent PNG loaded, showing the center window for the face',
                paragraphs: [
                    'Most first frames try to carry a slogan, a date, a logo, a hashtag, and a website in the ring. The window for the face shrinks to a postage stamp. Supporters cannot see themselves, so they do not save the file, so they do not send it on.',
                    'Create is three steps: Frame, Name, Send. You can upload a square PNG with transparency and a hole in the middle, or pick a colour ring if you do not have art yet. Premade rings are a fallback. The live preview stays on screen while you drag the window. Leave the centre empty on purpose.',
                    'One short line of type is enough: the series title, the team name, the colour of the month. A QR code does not belong in the artwork. Every campaign already has a downloadable QR on the campaign page, for print and for a screen at the door.',
                    'If you have a crest or a logo, export it as a transparent PNG. Photographing a jersey, a poster, or a phone screenshot of a logo usually looks muddy at the size of a WhatsApp avatar. If the badge is unreadable there, the frame is not done.',
                    'Name the campaign something a supporter will recognize in a chat preview. The title is what WhatsApp shows next to the link. A private joke that only the committee understands will look like spam to the aunt who actually posts. Category and goal are optional. They do not replace a clear title.',
                ],
            },
            {
                title: 'The first hour on WhatsApp decides it',
                screenshot:
                    'the publish screen with WhatsApp as the primary share action',
                paragraphs: [
                    'Of the campaigns that ever got a supporter, the median got the first one 4.5 minutes after publish. Eighty-four percent of those first supporters arrived inside the first hour. Not one campaign got its first supporter after 24 hours. Either the link is sent in the minutes after you tap publish, or it is not sent.',
                    'The publish screen opens WhatsApp on purpose. Copying a URL, leaving the in-app browser, finding the right group, and pasting is where campaigns die. Send it to one group that already cares: the cell, the parent chat, the team, the staff WhatsApp. One room that will act beats a broadcast to people who will not.',
                    'Most use is on phones, much of it inside WhatsApp or Instagram. After someone saves, the page asks them to pass the link to the next person. That chain is the product. You are not buying ads and you are not waiting for Explore to invent an audience.',
                    'If you wait until the morning, you are running a different experiment. The data we have says the first supporter does not arrive the next day. Share before you close the tab.',
                ],
            },
            {
                title: 'Write the ask that travels with the link',
                paragraphs: [
                    'The organizer paste is one sentence plus the URL. In English it is: add this frame to your profile picture. Keep it that short. A group chat is not a newsletter. If you explain the whole cause in the same message as the link, people scroll past both.',
                    'If you also need a donate link, a Pix key, or a helpline, put that on the next line. Do not put it in the artwork. The frame is a signal. The money or the phone number is a separate action, and stuffing both into the ring is how faces disappear.',
                    'When the phone looks Brazilian, the paste is already in Portuguese, because that is where almost all real campaigns run. You do not have to rewrite it. If you do rewrite it, keep the verb: put this on your photo, here is the link.',
                    'Supporters never create an account. They open the link, add a photo from the camera roll, and save or share. Inside iPhone in-app browsers, the share sheet is the reliable way to keep the file. A download button can fail there. If someone says nothing arrived, tell them to share the picture to themselves, not to hunt for a Files folder.',
                    'You can print the campaign QR for a bulletin, a badge, or a holding slide. That is for people in a room. The WhatsApp paste is for people not in the room. Use both if you have an event. For a group chat only, skip the QR and send the link.',
                ],
            },
            {
                title: 'When the counter stalls in the teens',
                screenshot:
                    'the manage dashboard showing views, supporter count, and country breakdown',
                paragraphs: [
                    'The counter is people who saved a framed photo. It is not likes and it is not inflated. Stuck in the low teens means the link is circulating in a small room and nobody is sending it into the next room.',
                    'Open manage. That is the URL with ?k= on the end, the one also in the welcome email if you left an address. You will see views, supporters, and a country breakdown. If views are also tiny, the link never left your phone. Send it again, to a different group, today.',
                    'If views are high and supporters are not, the frame is the problem. Faces too small, type too dense, or a design that reads as a watermark. You can change the frame from manage without losing the link or the count. Upload a cleaner PNG and ask the same group to try once more.',
                    'Do not start a second campaign with a new URL to "reset" the number. The people who already joined the first one will not find the second. Change the art, keep the link.',
                    'A reminder email exists for campaigns that still have zero supporters. If you get one, the fix is another WhatsApp send, not a new slug. Explore will not help yet. It lists public campaigns that already have supporters. It is not a discovery engine for a link you have not sent.',
                    'If the country breakdown on manage is almost all one country, write the next ask in that language. For Ollabs that is usually Portuguese. The product already switches the paste when the phone looks Brazilian. Use it.',
                ],
            },
            {
                title: 'When a hub link beats a campaign link',
                paragraphs: [
                    'A campaign link, ollabs.studio/c/your-slug, opens the frame. Use it in WhatsApp, in email, on a slide, anywhere you want someone to act in the next minute.',
                    'A hub, ollabs.studio/u/your-handle, is a bio page: your name, a short bio, optional other links, and a Join button to the campaign you feature. Claiming a handle needs a free organizer login so the page stays yours if you switch phones. Instagram and TikTok bios want one URL that does not change every week. Put the hub there.',
                    'Keep sending the /c/ link in chats. The hub does not replace it. Join on the hub still opens the featured campaign. You can hide old campaigns on the hub so the list stays current. Strangers who find you through a bio should get the hub. The group that already said yes should get the campaign link.',
                    'If you only have one push this week, skip the hub. Make the frame, tap publish, open WhatsApp, send. Set up /u/your-handle when you know you will run another frame next month and you need a bio that still works.',
                    'Create does not require an account. A hub does, because the handle has to stay yours. If you are not ready to sign in, still publish the campaign. You can claim it later from manage. Do not delay the first WhatsApp send to set up a bio page.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Do supporters need an account?',
                a: 'No. They open your link, add a photo, and download or share. There is never a signup wall on the campaign page.',
            },
            {
                q: 'Can I change the frame after people have joined?',
                a: 'Yes. Use Change the frame on manage. The link, the supporter count, and old shares keep working.',
            },
            {
                q: 'Why does publish open WhatsApp instead of offering a copy button first?',
                a: 'Campaigns that get a first supporter almost always get that person in the first hour. Opening WhatsApp is the shortest path from a finished frame to a group that can act.',
            },
            {
                q: 'Do I need a hub for a one-off campaign?',
                a: 'No. A hub is for a stable bio URL. For a single WhatsApp push, the campaign link is enough.',
            },
        ],
        cta: { href: '/create', label: 'Create a campaign' },
    },
    {
        slug: 'hub',
        title: 'What is a campaign hub?',
        description:
            'Your Ollabs hub is one link for your bio: a Join button to your frame, a short bio, and other links. Learn when to use /u/your-handle vs a campaign link.',
        subtitle:
            'A hub is your public home on Ollabs. Paste it in Instagram, TikTok, or anywhere you keep a bio link. The Join button opens your featured frame so supporters can add it to their photo.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 3,
        sections: [
            {
                title: 'Campaign link vs hub link',
                paragraphs: [
                    'A campaign link (ollabs.studio/c/your-slug) goes straight to the frame. Someone opens it, adds a photo, and saves. Use this in WhatsApp groups, email blasts, and anywhere you want speed.',
                    'A hub link (ollabs.studio/u/your-handle) is your bio page. It shows who you are, optional links, and one big Join button to your featured campaign. Use this where people discover you first: Instagram bio, TikTok, Linktree-style spots.',
                ],
                bullets: [
                    'WhatsApp group today? Share the /c/ campaign link.',
                    'Instagram or TikTok bio? Share the /u/ hub link.',
                    'Running several frames? The hub lists them; Join always leads to the one you feature.',
                ],
            },
            {
                title: 'Set up your hub in four steps',
                steps: [
                    {
                        title: 'Claim your handle',
                        body: 'Open Hub in Ollabs and pick ollabs.studio/u/your-name. You need a free organizer login so the page stays yours if you switch phones.',
                    },
                    {
                        title: 'Choose a featured campaign',
                        body: 'Pick the frame you want the Join button to open. Usually this is your newest or most important campaign.',
                    },
                    {
                        title: 'Add a bio and links',
                        body: 'One or two lines about the cause, plus optional links (Instagram, donation page, news). Keep the list short.',
                    },
                    {
                        title: 'Save and paste the hub URL',
                        body: 'Copy ollabs.studio/u/your-handle into your bio. Share the campaign link separately when you want people in a chat to act right now.',
                    },
                ],
            },
            {
                title: 'What supporters see',
                paragraphs: [
                    'They land on a simple page: your name, photo, bio, a large preview of the featured frame, and a full-width Join button. Tap Join and they are on the campaign page to upload a photo. No account, no app.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Do I need a hub if I already have a campaign link?',
                a: 'No. A campaign link is enough for a one-off push. A hub helps when you want one stable bio URL that always points at your current frame.',
            },
            {
                q: 'Does the hub replace my campaign link?',
                a: 'No. Join on the hub sends people to your featured /c/ page. You can still share the campaign link directly anytime.',
            },
            {
                q: 'Can I hide old campaigns on the hub?',
                a: 'Yes. In the hub editor you can hide campaigns you do not want listed. Join still uses whichever campaign you feature.',
            },
            {
                q: 'Is the hub free?',
                a: 'Yes. Claiming a hub and sharing it is free, same as creating a campaign.',
            },
        ],
        cta: { href: '/hub', label: 'Edit your hub' },
    },
    {
        slug: 'start-a-campaign',
        title: 'How to start a campaign',
        description:
            'Step-by-step: upload a frame, name your campaign, publish, and share on WhatsApp in the first hour when most campaigns get their first supporter.',
        subtitle:
            'You can publish in under a minute. No signup required to create. Share the link immediately after publish: most campaigns that take off get their first supporter within an hour.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 3,
        sections: [
            {
                title: 'Before you start',
                bullets: [
                    'Have a square frame ready: a transparent PNG with a hole for the face, or pick a color ring in the builder.',
                    'Know the title you want on the share link (cause name, event, candidate, team).',
                    'Plan to paste the link in WhatsApp or a group chat right after publish.',
                ],
            },
            {
                title: 'Steps',
                steps: [
                    {
                        title: 'Make the frame',
                        body: 'Go to Create. Upload your PNG or choose a style. Drag the photo window if you use a custom design. The live preview stays visible while you adjust.',
                    },
                    {
                        title: 'Name the campaign',
                        body: 'Give it a clear title supporters will recognize. Optional: goal, category, custom slug (ollabs.studio/c/your-slug).',
                    },
                    {
                        title: 'Publish',
                        body: 'Tap publish. Ollabs saves your frame and gives you a share link. If you are signed in, the campaign also appears under My campaigns on any device.',
                    },
                    {
                        title: 'Share in the first hour',
                        body: 'Open WhatsApp from the publish screen and send the link to one group you trust. Most first supporters arrive within an hour of sharing. Waiting a day rarely works.',
                    },
                ],
            },
            {
                title: 'After publish',
                paragraphs: [
                    'Bookmark the manage link (the URL with ?k=...) to see views, supporters, and countries. You can change the frame later without losing your link or count.',
                    'Optional: claim a hub at ollabs.studio/u/your-handle for your bio, with Join pointing at this campaign.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Do supporters need an account?',
                a: 'No. They open your link, add a photo, and download or share. Never a signup wall.',
            },
            {
                q: 'Can I change the frame after publishing?',
                a: 'Yes. Use Change the frame on your manage dashboard. Your link, supporter count, and old shares keep working.',
            },
            {
                q: 'What if nobody joins?',
                a: 'Share again in WhatsApp. One group message beats posting once and waiting. The manage page nudges you if you still have zero supporters.',
            },
            {
                q: 'Is there a watermark?',
                a: 'No. Supporters get a clean image. Ollabs never charges them to remove a watermark.',
            },
        ],
        cta: { href: '/create', label: 'Create a campaign' },
    },
];

export function getGuide(slug: string): Guide | undefined {
    return GUIDES.find((g) => g.slug === slug);
}
