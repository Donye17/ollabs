// Use-case landing pages for SEO. Each targets a search intent like
// "profile picture frame for fundraisers". Content is real and specific,
// no fabricated stats. Rendered at /for/<slug>.

export interface UseCase {
    slug: string;
    audience: string;        // "Fundraisers"
    h1: string;
    subtitle: string;
    keyword: string;         // primary search phrase
    intro: string[];         // paragraphs
    benefits: { title: string; body: string }[];
    faqs: { q: string; a: string }[];
}

export const USE_CASES: UseCase[] = [
    {
        slug: 'fundraisers',
        audience: 'Fundraisers',
        h1: 'Profile picture frames for fundraisers',
        subtitle: 'Turn every supporter into a walking billboard for your cause.',
        keyword: 'profile picture frame for fundraisers',
        intro: [
            'Running a fundraiser is a numbers game of attention. The more people who show your cause on their profile, the more the ask spreads. Ollabs lets you make one frame, share one link, and watch supporters add it to their photo in seconds.',
            'No signup, no ads, and no cost. Make a frame with your colors or your logo, drop the link in your emails and group chats, and let your people carry the message for you.',
        ],
        benefits: [
            { title: 'One link to share', body: 'Post it in your donation emails, texts, and socials. Everyone uses the same link.' },
            { title: 'See the momentum', body: 'A live counter shows how many supporters have added the frame, real numbers, updated as they join.' },
            { title: 'Your brand, your frame', body: 'Upload your logo or pick your colors so every framed photo looks like your campaign.' },
        ],
        faqs: [
            { q: 'Is it free for nonprofits and fundraisers?', a: 'Yes. Ollabs is completely free, with no ads and no signup for you or your supporters.' },
            { q: 'Can supporters share their framed photo anywhere?', a: 'Yes. They download a normal image and can post it on any platform or set it as their profile picture.' },
        ],
    },
    {
        slug: 'nonprofits',
        audience: 'Nonprofits',
        h1: 'Profile picture frames for nonprofits',
        subtitle: 'Rally your community around a cause with one shareable link.',
        keyword: 'profile picture frame for nonprofits',
        intro: [
            'Awareness spreads fastest when your community wears it. Ollabs gives your nonprofit a simple way to make a branded profile-picture frame and share it with one link, so supporters, staff, and volunteers can all show up together.',
            'It is free, ad-free, and needs no account. Make a frame with your logo and colors, and let your people put your mission on their profile.',
        ],
        benefits: [
            { title: 'On-brand in minutes', body: 'Upload your logo or set your colors so every photo reinforces your identity.' },
            { title: 'No barriers to join', body: 'Supporters add the frame without downloading an app or creating an account.' },
            { title: 'Real reach you can see', body: 'The supporter counter shows genuine adoption, not vanity numbers.' },
        ],
        faqs: [
            { q: 'Do supporters need an account?', a: 'No. They open your link, add a photo, and download. That is it.' },
            { q: 'Can we use our own logo as the frame?', a: 'Yes. Upload a transparent PNG and it wraps every supporter’s photo with a window in the center for their face.' },
        ],
    },
    {
        slug: 'churches',
        audience: 'Churches',
        h1: 'Profile picture frames for churches',
        subtitle: 'Get your congregation showing up for a series, event, or campaign.',
        keyword: 'profile picture frame for churches',
        intro: [
            'Whether it is a sermon series, a mission trip, or a community drive, a shared profile frame helps your congregation rally around it together. Ollabs makes it simple: one frame, one link, and members add it to their photo.',
            'Free, ad-free, and no signup. Make a frame with your church colors or logo and share it in your bulletin, app, and group chats.',
        ],
        benefits: [
            { title: 'Perfect for a series', body: 'Spin up a frame for each series or event and retire it when you are done.' },
            { title: 'Works for everyone', body: 'Members of any age can add it on their phone in seconds.' },
            { title: 'Your look', body: 'Use your church colors or logo so it feels like part of the campaign.' },
        ],
        faqs: [
            { q: 'Can we make a new frame for each series?', a: 'Yes. Create as many campaigns as you like, each with its own link.' },
            { q: 'Is there any cost?', a: 'No. Ollabs is free with no ads.' },
        ],
    },
    {
        slug: 'schools',
        audience: 'Schools',
        h1: 'Profile picture frames for schools',
        subtitle: 'Spirit weeks, fundraisers, and class pride in one shareable link.',
        keyword: 'profile picture frame for schools',
        intro: [
            'From spirit week to a class fundraiser to graduation, a shared profile frame gets students, parents, and staff showing school pride together. Ollabs lets you make one and share it with a single link.',
            'It is free, has no ads, and needs no account, so the whole community can join in seconds.',
        ],
        benefits: [
            { title: 'School colors, instantly', body: 'Set your colors or upload the mascot and crest as a frame.' },
            { title: 'Great for spirit weeks', body: 'Make a fresh frame for each theme or event.' },
            { title: 'Everyone can join', body: 'No app, no login, works on any phone.' },
        ],
        faqs: [
            { q: 'Can parents and staff use it too?', a: 'Yes. Anyone with the link can add the frame to their photo.' },
            { q: 'Is student data collected?', a: 'No. Photos are processed in the browser and are not stored on our servers.' },
        ],
    },
    {
        slug: 'sports-teams',
        audience: 'Sports teams',
        h1: 'Profile picture frames for sports teams',
        subtitle: 'Get fans and players repping the team on game day.',
        keyword: 'profile picture frame for sports teams',
        intro: [
            'Nothing builds hype like a wall of fans wearing your colors. Ollabs lets your team or club make a profile frame and share it with one link, so players, families, and supporters can all rep the team.',
            'Free, ad-free, and no signup. Use your team colors or crest and drop the link in your group chats and socials before the big game.',
        ],
        benefits: [
            { title: 'Team colors and crest', body: 'Pick your colors or upload the crest so every photo screams team pride.' },
            { title: 'Rally before game day', body: 'Share the link and watch the supporter count climb.' },
            { title: 'One tap for fans', body: 'Supporters add it on their phone in seconds, no app needed.' },
        ],
        faqs: [
            { q: 'Can we use our crest as the frame?', a: 'Yes. Upload a transparent PNG of your crest and it wraps each photo.' },
            { q: 'Is it free for clubs?', a: 'Yes, completely free with no ads.' },
        ],
    },
    {
        slug: 'events',
        audience: 'Events',
        h1: 'Profile picture frames for events',
        subtitle: 'Build buzz before, during, and after your event.',
        keyword: 'profile picture frame for events',
        intro: [
            'A shared profile frame turns your attendees into promoters. Ollabs lets you make an event frame and share one link, so people can show they are going and spread the word for you.',
            'Free, ad-free, and no signup. Add your event branding, print the QR code for the venue, and let attendees join with a tap.',
        ],
        benefits: [
            { title: 'Built-in QR code', body: 'Download a QR of your campaign to put on signage, badges, and slides.' },
            { title: '"I’m going" energy', body: 'Attendees show they are attending, which pulls in more people.' },
            { title: 'Your event branding', body: 'Use your colors or upload the event logo as the frame.' },
        ],
        faqs: [
            { q: 'Can I print a QR code for the venue?', a: 'Yes. Every campaign has a downloadable QR code you can print.' },
            { q: 'Does it work during the event?', a: 'Yes. Share the link or QR on screens and signage so people join on the spot.' },
        ],
    },
    {
        slug: 'birthdays',
        audience: 'Birthdays',
        h1: 'Profile picture frames for birthdays',
        subtitle: 'Get everyone celebrating with a matching frame.',
        keyword: 'birthday profile picture frame',
        intro: [
            'Surprise someone by getting friends and family to all wear a birthday frame on their photos. Ollabs makes it easy: create a frame, share one link, and everyone joins the celebration.',
            'It is free, with no ads and no signup, so even the least techy relatives can add it in seconds.',
        ],
        benefits: [
            { title: 'A sweet surprise', body: 'Coordinate friends to all switch their photo at once.' },
            { title: 'Make it personal', body: 'Add a name, a color, or a photo-style frame for the day.' },
            { title: 'Anyone can join', body: 'No app or login, just tap the link and add a photo.' },
        ],
        faqs: [
            { q: 'Can I add the birthday person’s name?', a: 'Yes. Upload a custom frame with their name, or pick a color and keep it simple.' },
            { q: 'Is it free?', a: 'Yes, completely free with no ads.' },
        ],
    },
    {
        slug: 'awareness-campaigns',
        audience: 'Awareness campaigns',
        h1: 'Profile picture frames for awareness campaigns',
        subtitle: 'Put a cause on thousands of profiles with one link.',
        keyword: 'awareness profile picture frame',
        intro: [
            'Awareness months and solidarity campaigns spread when people wear them. Ollabs lets you make a frame for your cause and share one link, so anyone can add it to their photo and pass it on.',
            'Free, ad-free, and no signup. Use a ribbon color or upload a custom design, and let the movement show.',
        ],
        benefits: [
            { title: 'Ribbon colors ready', body: 'Pick from clean color rings or upload your own awareness design.' },
            { title: 'Spreads person to person', body: 'Each supporter is nudged to invite the next after they add the frame.' },
            { title: 'Honest reach', body: 'The counter shows real supporters, never inflated numbers.' },
        ],
        faqs: [
            { q: 'Can I match a specific ribbon color?', a: 'Yes. Set an exact color, or upload a custom frame with your design.' },
            { q: 'Do you inflate the supporter count?', a: 'Never. Every count is a real person who added the frame.' },
        ],
    },
];

export function getUseCase(slug: string): UseCase | undefined {
    return USE_CASES.find((u) => u.slug === slug);
}
