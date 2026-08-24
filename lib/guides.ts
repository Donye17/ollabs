/** Organizer how-to guides. Plain language, no em dashes. */

export type GuideSection = {
    title: string;
    paragraphs?: string[];
    steps?: { title: string; body: string }[];
    bullets?: string[];
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
    slug: string;
    title: string;
    description: string;
    subtitle: string;
    sections: GuideSection[];
    faqs: GuideFaq[];
    cta: { href: string; label: string };
};

export const GUIDES: Guide[] = [
    {
        slug: 'hub',
        title: 'What is a campaign hub?',
        description:
            'Your Ollabs hub is one link for your bio: a Join button to your frame, a short bio, and other links. Learn when to use /u/your-handle vs a campaign link.',
        subtitle:
            'A hub is your public home on Ollabs. Paste it in Instagram, TikTok, or anywhere you keep a bio link. The Join button opens your featured frame so supporters can add it to their photo.',
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
