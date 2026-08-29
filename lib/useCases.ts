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
    /** Audience-specific scenes. Must not be interchangeable with another page. */
    scenarios: { title: string; paragraphs: string[] }[];
    benefits: { title: string; body: string }[];
    faqs: { q: string; a: string }[];
    guide: { href: string; label: string };
    /** Honest caption when the live example is from a nearby category. */
    exampleNote?: string;
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
            'No signup and no cost. Make a frame with your colors or your logo, drop the link in your emails and group chats, and let your people carry the message for you.',
        ],
        scenarios: [
            {
                title: 'A matching gift with a Friday deadline',
                paragraphs: [
                    'When a donor matches gifts until Friday night, the clock is the campaign. Put the frame link in the same email as the donate button. Plenty of people will not click donate on the first pass, but they will change a photo if it takes ten seconds on their phone. Their friends then see the ask inside WhatsApp and Instagram, which is where most of a list actually lives.',
                    'On Saturday, paste the live supporter count into the recap you send the matching donor. It is a real number of people who opened the link and saved a picture, not a screenshot of likes. Ollabs does not process money. Keep Pix, PayPal, or the donation form in the caption and in the email so the frame and the ask travel together.',
                ],
            },
            {
                title: 'The committee chat, not the newsletter',
                paragraphs: [
                    'A donor wall PDF sits on a website. A profile frame sits in the group chat where the committee already argues about table assignments. For a school auction, a church roof, or a community raffle, ask every organizer to add the frame the night you launch, then drop the same link in the parent or volunteer WhatsApp.',
                    'You are not collecting emails and you are not building a new list. You are making the fundraiser visible in the thread where money already moves. People who never open Mailchimp still open that chat.',
                ],
            },
            {
                title: 'What this page is not for',
                paragraphs: [
                    'If you need a standing public home for the organization, with a bio and a Join button that always points at the current frame, that is a hub. If you need a payment page, that is your existing donate tool. This page is for the short push: one link, a visible count, and a picture people can set before the match expires.',
                ],
            },
        ],
        benefits: [
            { title: 'One link to share', body: 'Post it in your donation emails, texts, and socials. Everyone uses the same link.' },
            { title: 'See the momentum', body: 'A live counter shows how many supporters have added the frame, real numbers, updated as they join.' },
            { title: 'Your brand, your frame', body: 'Upload your logo or pick your colors so every framed photo looks like your campaign.' },
        ],
        faqs: [
            { q: 'Is it free for nonprofits and fundraisers?', a: 'Yes. Ollabs is completely free, with no signup and no watermark for you or your supporters.' },
            { q: 'Can supporters share their framed photo anywhere?', a: 'Yes. They download a normal image and can post it on any platform or set it as their profile picture.' },
            { q: 'Does Ollabs collect the donation?', a: 'No. The campaign is a picture tool. Put your donation link in the share text and in the email you send with the frame link.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'nonprofits',
        audience: 'Nonprofits',
        h1: 'Profile picture frames for nonprofits',
        subtitle: 'Rally your community around a cause with one shareable link.',
        keyword: 'profile picture frame for nonprofits',
        intro: [
            'Awareness spreads fastest when your community wears it. Ollabs gives your nonprofit a simple way to make a branded profile-picture frame and share it with one link, so supporters, staff, and volunteers can all show up together.',
            'It is free and needs no account. Make a frame with your logo and colors, and let your people put your mission on their profile.',
        ],
        scenarios: [
            {
                title: 'Staff, volunteers, and the people you serve',
                paragraphs: [
                    'A fundraiser page is about the ask. A nonprofit page is about who wears the org all year. Staff can add the frame on LinkedIn during a hiring week. Volunteers can add it the weekend of a food drive. Beneficiaries should never be pressured to participate. The link is optional, public, and has no login, so nobody has to join a platform to show support.',
                    'If chapters or local groups each want their own mark, they can each publish a campaign. Headquarters does not have to design every PNG. Upload the logo once, or let a local organizer upload theirs, and share that group’s link in that group’s chat.',
                    'Keep the donate link in the caption when the week is a drive. The rest of the year, leave money off the frame so the org mark does not read as a perpetual ask. Volunteers who already gave time should not feel billed every time they open Instagram.',
                ],
            },
            {
                title: 'Annual identity versus a disaster week',
                paragraphs: [
                    'Keep a quiet, on-brand frame for the year if you want a stable look on staff profiles. When a flood, a bill, or a court date hits, publish a second campaign with a sharper message and a new link. Retire it when the week is over so last month’s emergency is not still sitting on people’s photos.',
                    'The counter on the emergency campaign is the number you can honestly quote in an update. It is not a substitute for service stats, and we do not inflate it.',
                ],
            },
            {
                title: 'A bio link that outlasts one campaign',
                paragraphs: [
                    'Instagram and TikTok bios want one URL. A hub is that URL: a Join button to whichever frame you feature this month, plus a short bio. Share the /c/ campaign link in WhatsApp when you need people to act in the next hour. Share the /u/ hub in the bio so the next visitor still finds you after this week’s frame comes down.',
                ],
            },
        ],
        benefits: [
            { title: 'On-brand in minutes', body: 'Upload your logo or set your colors so every photo reinforces your identity.' },
            { title: 'No barriers to join', body: 'Supporters add the frame without downloading an app or creating an account.' },
            { title: 'Real reach you can see', body: 'The supporter counter shows genuine adoption, not vanity numbers.' },
        ],
        faqs: [
            { q: 'Do supporters need an account?', a: 'No. They open your link, add a photo, and download. That is it.' },
            { q: 'Can we use our own logo as the frame?', a: 'Yes. Upload a transparent PNG and it wraps every supporter’s photo with a window in the center for their face.' },
            { q: 'Can we keep a campaign off Explore?', a: 'Yes. Set it to unlisted and share only the link with members, chapters, or an email list.' },
        ],
        guide: { href: '/guides/hub', label: 'What a campaign hub is' },
    },
    {
        slug: 'churches',
        audience: 'Churches',
        h1: 'Profile picture frames for churches',
        subtitle: 'Get your congregation showing up for a series, event, or campaign.',
        keyword: 'profile picture frame for churches',
        intro: [
            'Whether it is a sermon series, a mission trip, or a community drive, a shared profile frame helps your congregation rally around it together. Ollabs makes it simple: one frame, one link, and members add it to their photo.',
            'Free, and no signup. Make a frame with your church colors or logo and share it in your bulletin, app, and group chats.',
        ],
        scenarios: [
            {
                title: 'A sermon series has an end date',
                paragraphs: [
                    'A six-week series is a closed window. Make the frame the week before Sunday one, put the QR in the bulletin, and ask small-group leaders to drop the link in their chats after service. When the series ends, publish a new campaign for the next season instead of leaving last quarter’s title on people’s photos.',
                    'Vacation Bible school, a mission team send-off, and a building offering each deserve their own link. Mixing them into one evergreen frame makes the counter meaningless and the design muddy.',
                ],
            },
            {
                title: 'Bulletin QR and the group that actually reads it',
                paragraphs: [
                    'Print the campaign QR next to the series title. People who will not type a URL will still point a camera at the page during the announcements. The same link goes in the church WhatsApp, which is usually a better channel than the app store listing for your church app.',
                    'Older members often live in a phone browser they did not choose. There is no app to install and no account to remember. They open the link, add a photo, and save. If the in-app browser blocks a download, the share sheet is there so they can send the picture to themselves.',
                ],
            },
            {
                title: 'Not a second church website',
                paragraphs: [
                    'Ollabs is not your sermon archive, giving page, or calendar. Keep those on the site you already have. The hub is only useful if you want one bio link that always opens the current series frame. For this Sunday’s push, the campaign link is enough.',
                    'Wednesday night small groups will spread the link faster than the Sunday announcements. Send it to leaders on Saturday with a one-line reminder of the series title, not a brand deck. People add a photo between parking the car and walking in, or they do not add it at all.',
                ],
            },
        ],
        benefits: [
            { title: 'Perfect for a series', body: 'Spin up a frame for each series or event and retire it when you are done.' },
            { title: 'Works for everyone', body: 'Members of any age can add it on their phone in seconds.' },
            { title: 'Your look', body: 'Use your church colors or logo so it feels like part of the campaign.' },
        ],
        faqs: [
            { q: 'Can we make a new frame for each series?', a: 'Yes. Create as many campaigns as you like, each with its own link.' },
            { q: 'Is there any cost?', a: 'No. Ollabs is free, and supporters are never charged.' },
            { q: 'Can we print a QR for the bulletin?', a: 'Yes. Every campaign has a downloadable QR you can put on the bulletin, slides, or a foyer poster.' },
        ],
        guide: { href: '/guides/hub', label: 'What a campaign hub is' },
    },
    {
        slug: 'schools',
        audience: 'Schools',
        h1: 'Profile picture frames for schools',
        subtitle: 'Spirit weeks, fundraisers, and class pride in one shareable link.',
        keyword: 'profile picture frame for schools',
        intro: [
            'From spirit week to a class fundraiser to graduation, a shared profile frame gets students, parents, and staff showing school pride together. Ollabs lets you make one and share it with a single link.',
            'It is free and needs no account, so the whole community can join in seconds.',
        ],
        scenarios: [
            {
                title: 'Spirit week is a parent campaign',
                paragraphs: [
                    'Students often cannot change a school-managed profile. The people who actually post are parents, PTA officers, and staff. Put the link in the parent WhatsApp and the PTA email, not only in the student newsletter. A color ring in school colors is enough for a theme day. Upload the mascot as a transparent PNG if you already have art from last year.',
                    'Make a fresh campaign for each week so last year’s “pajama day” is not still circulating. The counter is how many households joined, which is more honest than a hallway photo of a few posters.',
                ],
            },
            {
                title: 'PTA fundraiser versus graduation',
                paragraphs: [
                    'A PTA ask is a fundraiser: pair the frame with the donation or ticket link. Graduation is pride, not a pitch. Do not reuse the auction frame for commencement. Families will notice, and the photos will look like leftover marketing.',
                    'Graduation frames get shared by aunts and grandparents who are not in the parent chat. Send the link in the class group and ask one parent to forward it. There is no student account to provision and no photo stored on our servers. Processing happens in the browser on their phone.',
                ],
            },
            {
                title: 'What we do not store',
                paragraphs: [
                    'Photos are not uploaded to Ollabs for safekeeping. That matters in a school context. If a district forbids third-party apps, this still runs in a browser tab. You are not asking families to create accounts for children.',
                    'The office can put the QR on the weekly family email and on the sandwich-board at pickup. Students on a school Chromebook are not the audience. The parent standing in the car line is.',
                ],
            },
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
        guide: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'sports-teams',
        audience: 'Sports teams',
        h1: 'Profile picture frames for sports teams',
        subtitle: 'Get fans and players repping the team on game day.',
        keyword: 'profile picture frame for sports teams',
        intro: [
            'Nothing builds hype like a wall of fans wearing your colors. Ollabs lets your team or club make a profile frame and share it with one link, so players, families, and supporters can all rep the team.',
            'Free, and no signup. Use your team colors or crest and drop the link in your group chats and socials before the big game.',
        ],
        scenarios: [
            {
                title: 'Youth club: the parent group is the locker room',
                paragraphs: [
                    'Under-12 and under-14 sides do not live on Twitter. They live in a WhatsApp or TeamSnap thread run by a team manager. Drop the frame link there on Thursday if the match is Saturday. Ask every parent to add it, including the ones who cannot attend. The wall of framed photos is for the kids to screenshot, and for grandparents who follow along from another city.',
                    'A college intramural or adult rec league is the opposite: players will post themselves. Same tool, different chat. Put the link in the team group, not on a public Explore listing, if you only want this roster.',
                ],
            },
            {
                title: 'Match day versus a season mark',
                paragraphs: [
                    'A cup final or derby deserves a one-off campaign with the opponent or the round in the art. A season-long “we are the blues” mark can stay up from August to May. Do not mix them. If you leave the final’s frame up into next season, new families will think last year’s story is this year’s.',
                    'Watch the counter in the hours before kickoff. That is the window. Sharing the link on Monday after a loss is usually too late.',
                ],
            },
            {
                title: 'Crest as a PNG, not a photo of a jersey',
                paragraphs: [
                    'Photographing a jersey and hoping it becomes a frame usually looks muddy. Export the crest as a transparent PNG, upload it in the builder, and leave a clear window for the face. If you only have colors, a clean ring in those colors is better than a blurry badge.',
                    'If the club has a clash kit, pick the home colors unless the campaign is specifically the away day. Mixing both in one ring looks like two teams. Parents screenshot the framed photo for grandparents; keep the badge readable at the size of a WhatsApp avatar.',
                ],
            },
        ],
        benefits: [
            { title: 'Team colors and crest', body: 'Pick your colors or upload the crest so every photo screams team pride.' },
            { title: 'Rally before game day', body: 'Share the link and watch the supporter count climb.' },
            { title: 'One tap for fans', body: 'Supporters add it on their phone in seconds, no app needed.' },
        ],
        faqs: [
            { q: 'Can we use our crest as the frame?', a: 'Yes. Upload a transparent PNG of your crest and it wraps each photo.' },
            { q: 'Is it free for clubs?', a: 'Yes, completely free, and no watermark on any photo.' },
            { q: 'Can we keep it to this roster only?', a: 'Yes. Set the campaign to unlisted so it stays off Explore, and share the link only in the team chat.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'events',
        audience: 'Events',
        h1: 'Profile picture frames for events',
        subtitle: 'Build buzz before, during, and after your event.',
        keyword: 'profile picture frame for events',
        intro: [
            'A shared profile frame turns your attendees into promoters. Ollabs lets you make an event frame and share one link, so people can show they are going and spread the word for you.',
            'Free, and no signup. Add your event branding, print the QR code for the venue, and let attendees join with a tap.',
        ],
        scenarios: [
            {
                title: 'The registration email, before anyone arrives',
                paragraphs: [
                    'A conference, festival, or concert has a list of people who already said yes. Put the frame link in the confirmation email next to the calendar file and the venue map. Attendees who set the picture before travel are doing your marketing in every group chat they already belong to. That is different from a birthday, where the list is a family thread and the window is one day.',
                    'If tickets are still on sale, the framed photos are social proof that the room is filling. The counter is people who bothered to save an image, which is a colder number than “interested” clicks on a Facebook event.',
                ],
            },
            {
                title: 'QR at the door and on the holding slide',
                paragraphs: [
                    'Print the campaign QR on badges, on the registration table tent, and on the slide that plays before the first talk. People who skipped the email will still join in the foyer on venue wifi. The download happens on their phone. You do not need a photo booth laptop unless you want one.',
                    'During the event the same link keeps working. After it ends, leave the campaign up for a week if you want recap posts, then stop promoting it so next year’s edition can have a clean counter.',
                ],
            },
            {
                title: 'Weddings and private parties',
                paragraphs: [
                    'A ticketed public event wants to be found. A wedding usually does not. Set the campaign to unlisted, put the QR on the program, and skip Explore. Guests who will not download a wedding app will still open a browser link. That is the whole reason this exists next to the birthday page: birthdays are a surprise in a chat. Events are a date, a door, and a QR.',
                    'On the day, put the QR on the holding slide at 200% size. People in the back row will still not type a URL. They will point a camera at the screen during the five minutes before the keynote.',
                ],
            },
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
        guide: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'birthdays',
        audience: 'Birthdays',
        h1: 'Profile picture frames for birthdays',
        subtitle: 'Get everyone celebrating with a matching frame.',
        keyword: 'birthday profile picture frame',
        intro: [
            'Surprise someone by getting friends and family to all wear a birthday frame on their photos. Ollabs makes it easy: create a frame, share one link, and everyone joins the celebration.',
            'It is free, with no signup, so even the least techy relatives can add it in seconds.',
        ],
        exampleNote:
            'Live examples come from event-tagged campaigns when a birthday-specific one is not in the pool. The tool is the same: one link in the family chat.',
        scenarios: [
            {
                title: 'Coordinating the surprise in the family chat',
                paragraphs: [
                    'A birthday frame is logistics, not marketing. Create it privately, set the campaign to unlisted, and paste the link only in the group that is in on the surprise. Ask everyone to switch their photo the morning of the birthday, or the night before if time zones are messy. The guest of honor should not see the link until the pictures are already up.',
                    'This is not a venue QR and not a ticketed list. There is no registration email. The entire distribution is one thread of aunts, cousins, and friends who will not download a party app for a Saturday.',
                ],
            },
            {
                title: 'Relatives who will not install anything',
                paragraphs: [
                    'The person who still uses Facebook on a tablet is the person you need. They open the link in the same browser they already have, add a photo from the camera roll, and save. If their in-app browser refuses the download, they can use the share sheet to send the file to themselves. You should not be on the phone walking them through an account.',
                    'Add the name in the art if you want it personal. A color ring with a name in a custom PNG is enough. You do not need a designer on Fiverr for a one-day frame.',
                ],
            },
            {
                title: 'Take it down the next day',
                paragraphs: [
                    'Unlike a sports season or a church series, a birthday is over on Monday. Tell the group they can switch back. Leave the campaign online if you want, but stop sending the link. A leftover birthday frame on a profile in March looks like spam, not love.',
                    'Pin the link in the family group the night before, with the time you want photos to flip. One reminder. A stream of “did you do it yet” messages is how the surprise leaks.',
                ],
            },
        ],
        benefits: [
            { title: 'A sweet surprise', body: 'Coordinate friends to all switch their photo at once.' },
            { title: 'Make it personal', body: 'Add a name, a color, or a photo-style frame for the day.' },
            { title: 'Anyone can join', body: 'No app or login, just tap the link and add a photo.' },
        ],
        faqs: [
            { q: 'Can I add the birthday person’s name?', a: 'Yes. Upload a custom frame with their name, or pick a color and keep it simple.' },
            { q: 'Is it free?', a: 'Yes, completely free, and no watermark on any photo.' },
            { q: 'Can we hide it from Explore so the birthday person does not see it early?', a: 'Yes. Set the campaign to unlisted and share the link only in the surprise group.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'awareness-campaigns',
        audience: 'Awareness campaigns',
        h1: 'Profile picture frames for awareness campaigns',
        subtitle: 'Put a cause on thousands of profiles with one link.',
        keyword: 'awareness profile picture frame',
        intro: [
            'Awareness months and solidarity campaigns spread when people wear them. Ollabs lets you make a frame for your cause and share one link, so anyone can add it to their photo and pass it on.',
            'Free, and no signup. Use a ribbon color or upload a custom design, and let the movement show.',
        ],
        scenarios: [
            {
                title: 'Ribbon month without faking the count',
                paragraphs: [
                    'Awareness months work because a color is already understood: pink, yellow, purple, red. Set that hex in the builder, or upload the coalition’s official art if they publish a PNG. Then share the link in the groups that already care, not in a blast to strangers. A profile frame is a solidarity signal, not a petition signature and not a donation.',
                    'The counter is people who saved a picture. Treat it that way in every caption. We do not sell “reach.” If another site promises inflated numbers, that is why those pages get treated as junk. Quote the number Ollabs shows, or quote nothing.',
                ],
            },
            {
                title: 'A national color versus your local story',
                paragraphs: [
                    'A national ribbon campaign can use the shared color so feeds look like one movement. A local story (a specific hospital ward, a missing-person week, a city ordinance) needs its own art and its own link so it does not get lost inside a generic month. Do not paste last October’s frame onto a different cause in January.',
                    'If you are a chapter of a larger org, ask whether they already have official art. Uploading a random ribbon you found on Google often looks cheap next to the real one, and it can confuse people about who is running the campaign.',
                ],
            },
            {
                title: 'Person to person, not a hashtag',
                paragraphs: [
                    'Hashtags die in a day. A framed photo stays on a profile until someone changes it. After someone saves, the page asks them to invite the next person. That chain is the product. You still need a real page or a helpline in the caption if the cause requires one. The frame is the signal, not the service.',
                    'If the month has an official helpline, put that number in the share text, not a donate link, unless you are also running a drive. Mixing a ribbon with a pitch is how people start treating the color as advertising.',
                ],
            },
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
        guide: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'companies',
        audience: 'Companies',
        h1: 'Profile picture frames for companies',
        subtitle: 'Mark a milestone, a launch, or a culture moment across your whole team.',
        keyword: 'company profile picture frame',
        intro: [
            'Internal moments spread best when people opt into them. An anniversary, a funding milestone, a product launch, a values week: give your team one link and they can put it on their own profile in seconds, on LinkedIn or anywhere else.',
            'No signup, and nothing watermarked. Upload your logo or set your exact brand colors, and every framed photo looks like it came from your design team.',
        ],
        scenarios: [
            {
                title: 'LinkedIn during a launch week',
                paragraphs: [
                    'Product launches, funding announcements, and anniversary weeks show up on LinkedIn before they show up on Instagram. Employees who already post about work will add a frame if it matches the brand guide and does not watermark their face. Contractors and agency partners can use the same link. You are not provisioning SSO for a picture tool.',
                    'Set exact hex values or upload the PNG brand already approved. A “close enough” ring next to a carefully designed wordmark looks like someone in marketing skipped legal. Unlisted mode keeps the campaign off the public Explore page so a stealth week stays inside the company.',
                ],
            },
            {
                title: 'Internal all-hands, not a public stunt',
                paragraphs: [
                    'Values week, a safety campaign, or a rebrand dry-run may be employees-only. Unlisted plus the intranet link is enough. IT does not need to review an app store listing. People open a browser, add a photo, download. If the company phone blocks file downloads, the share sheet still gets the image into Photos or Drive.',
                    'Do not run an internal frame as a public Explore campaign “for awareness.” Staff will treat it as a leak.',
                ],
            },
            {
                title: 'What this will not replace',
                paragraphs: [
                    'This is not Slack, not an employee directory, and not a DAM. If you need a stable careers-page URL that always opens the current culture frame, use a hub. If you need the logo in fifty sizes, keep using the brand folder. The campaign is the week the whole company is supposed to look like one feed.',
                    'Legal and brand will care about the PNG more than about the tool. Send them the transparent file and the hex, not a screenshot of the builder. Once they sign off, the link does not need another review cycle every time someone in sales uses it.',
                ],
            },
        ],
        benefits: [
            { title: 'Your brand, exactly', body: 'Upload a transparent PNG of your own design, or set precise hex colors so the ring matches your brand guide.' },
            { title: 'Nobody has to sign up', body: 'Employees, contractors, and partners all use the same link. No accounts to provision and nothing for IT to approve.' },
            { title: 'Clean enough for LinkedIn', body: 'No watermark and no third-party branding on the photo your team posts publicly.' },
        ],
        faqs: [
            { q: 'Can we use our exact brand colors?', a: 'Yes. Set any hex value, or upload a finished frame design as a transparent PNG.' },
            { q: 'Will our employees get a watermark on their photo?', a: 'No. The photo downloads clean, with no watermark and no Ollabs branding on it. Nobody has to create an account, and supporters are never charged.' },
            { q: 'Can we run this for an internal-only moment?', a: 'Yes. Set the campaign to unlisted so it does not appear on the public Explore page, and share the link internally.' },
        ],
        guide: { href: '/guides/hub', label: 'What a campaign hub is' },
    },
    {
        slug: 'universities',
        audience: 'Universities',
        h1: 'Profile picture frames for universities',
        subtitle: 'Homecoming, commencement, admitted students, Greek life, and giving days.',
        keyword: 'university profile picture frame',
        intro: [
            'Campus moments run on a calendar and repeat every year. Homecoming, commencement, admitted students day, founders day, and the annual giving push all work the same way: one frame, one link, thousands of profiles.',
            'Free, with no signup for students, alumni, or staff. Make it in your school colors, share the link, and watch the counter move.',
        ],
        exampleNote:
            'Live examples come from school-tagged campaigns. A university frame is the same product, aimed at alumni and campus groups rather than K-12 parents.',
        scenarios: [
            {
                title: 'Alumni who left campus and will not sign up',
                paragraphs: [
                    'Giving day and homecoming fail when the ask requires a new account. Alumni already ignore the giving-day microsite. A frame link in the class Facebook group or the alumni WhatsApp is something they can finish on a phone in a parking lot. They download a picture. They do not create a portal login.',
                    'Central advancement can still run the official mark. Chapters, teams, and departments can run their own without waiting in the brand-review queue, because creating a campaign does not require a CMS account on the university site.',
                ],
            },
            {
                title: 'Commencement is not giving day',
                paragraphs: [
                    'Commencement and admitted-students day are pride. Giving day is an ask. Use different art and different links. Families printing commencement photos do not want a donation ribbon in the frame. Donors on giving day do not want a mortarboard left over from May.',
                    'Reuse the design next year if you want, but publish a new campaign so this year’s counter starts at zero. Last year’s number on this year’s page is how these pages start looking like doorways.',
                ],
            },
            {
                title: 'Greek life and clubs without a central ticket',
                paragraphs: [
                    'A chapter that wants a rush week frame should not file a ticket with university marketing. They make the campaign, share one link in the group, and take it down after bid day. The hub is useful only if the chapter wants a stable bio URL. For a three-day rush, the campaign link is enough.',
                    'This is not a K-12 spirit week. Parents of children are not your audience. Students, alumni, faculty, and staff are. Keep the copy and the art at that register.',
                    'Put the giving-day frame in the class Facebook groups and the email that already goes to the reunion list. Do not bury it only on the university homepage. The people who still give are often the people who never visit that homepage.',
                ],
            },
        ],
        benefits: [
            { title: 'Built for repeat moments', body: 'Run one for homecoming, another for commencement, another for giving day. Each gets its own link and its own numbers.' },
            { title: 'Alumni do not need an account', body: 'The people least likely to sign up for anything are exactly the people you need. They do not have to.' },
            { title: 'Chapters and departments can self-serve', body: 'Anyone can make their own campaign, so Greek chapters, athletics, and departments do not have to queue behind central marketing.' },
        ],
        faqs: [
            { q: 'Can individual chapters or departments make their own?', a: 'Yes. Creating a campaign is free and takes a minute, so any group on campus can run their own without going through a central team.' },
            { q: 'Do students need to install anything?', a: 'No. It works in a phone browser. They open the link, add their photo, and download.' },
            { q: 'Can we reuse the same frame next year?', a: 'Yes. Make a new campaign with the same design so the new one gets its own supporter count.' },
        ],
        guide: { href: '/guides/hub', label: 'What a campaign hub is' },
    },
];

export function getUseCase(slug: string): UseCase | undefined {
    return USE_CASES.find((u) => u.slug === slug);
}
