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
        slug: 'save-framed-photo-on-iphone',
        title: 'How to save a framed photo on iPhone from WhatsApp or Instagram',
        description:
            'Why Download can fail inside those apps, how Share photo puts the PNG in Photos, when to open Safari, and how Share as story is different from a profile picture.',
        subtitle:
            'Most Ollabs links open inside WhatsApp or Instagram, not in Safari. The campaign page is built around that. This is the path that actually leaves a picture on the phone.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 8,
        sections: [
            {
                title: 'Why Download is the wrong first tap on iPhone',
                screenshot:
                    'the campaign page after a photo is fitted, with Share photo as the primary button in the thumb-zone bar',
                paragraphs: [
                    'If someone sent you an Ollabs link in WhatsApp or Instagram, you are probably still inside that app. The page looks like a website. It is running in a small browser the app owns. On iPhone, that in-app browser ignores the usual Download control. Tapping it can look like it worked and leave you with nothing in Photos.',
                    'Ollabs learned this the hard way. A detached download link is ignored on some phones. Even when the file starts, revoking it too soon can race the browser and the PNG never arrives. The product does not ask you to hunt a Files folder. The reliable path is the share sheet.',
                    'On iPhone, even Safari is a poor place for a raw file download. An anchor download often lands in Files as a generic document, not in the Photos library where a profile picture lives. The page therefore leads with Share photo when the phone can hand a PNG to the system sheet.',
                    'Desktop is the other way around. There, Download is the control that should lead, and the share sheet is extra. If you are helping someone on a computer, Download is fine. If you are helping someone who opened the link from a chat on an iPhone, tell them to ignore Download and use Share photo.',
                    'The framed result is a square PNG. That is the file you set as a profile picture in WhatsApp, Instagram, or a contacts app. Do not crop it in another editor unless you have to. The campaign already fitted the face to the window.',
                ],
            },
            {
                title: 'Share photo and Save Image',
                paragraphs: [
                    'Add your photo by tapping the circle or dragging a file onto it. Drag to move the face. Use Size to zoom. The page stays on that fit until you save. There is no account wall. Supporters never sign in.',
                    'When the fit looks right, tap Share photo. The phone should open the system share sheet with the PNG already attached. In that sheet, tap Save Image. That is the line that writes the picture into Photos. The campaign page even says so: in the sheet, tap Save Image to add it to your Photos app.',
                    'You can also send the picture straight into a chat from that same sheet. That is useful when you want someone else to see the framed face before you change your own profile picture. The sheet is the product. The website is only there to build the file.',
                    'If you cancel the sheet, nothing is counted as a save. Open Share photo again. Do not keep tapping Download hoping a folder will appear. On iPhone the download path is treated as unavailable on purpose, because it would drop a stray file in Files instead of Photos.',
                    'Android is more forgiving. A download often does land in the gallery. The page still prefers the share sheet when the browser supports it, because that is what most people wanted from the button anyway: a picture they can keep or send, not a lesson in file managers.',
                ],
            },
            {
                title: 'When the page says it could not save',
                paragraphs: [
                    'Sometimes the in-app browser will not hand a file to the share sheet at all. The page then shows an error next to the controls: Could not save here. Open this page in Safari, then try again. On iPhone there is an Open in Safari button for that exact case.',
                    'Tap it. Finish the fit again if you need to, then Share photo. Safari still uses the share sheet rather than a silent download. You are leaving WhatsApp\'s browser, not switching to a different product.',
                    'Errors sit in a coral box next to the failed control. The site never uses a blocking alert, because in an in-app browser a stray tap dismisses an alert before you can read it. If you see the coral box, that is the instruction. There is nothing hiding in a popup.',
                    'If Photos still has nothing after Save Image, check that you did not tap a different row in the sheet, such as a contact or an app that cannot accept images. Save Image is the row that matters for a profile picture. Then open WhatsApp or Instagram and set the photo from the library as you normally would.',
                    'The counter on the campaign only moves when a framed photo is actually saved or shared, not when someone only viewed the page. If you fitted a face and backed out, you are not in the count yet. That is why a group can have many views and a small supporter number: people looked, then left the in-app browser without a file.',
                ],
            },
            {
                title: 'Share as story vs the square you put on your profile',
                screenshot:
                    'the post-save screen with Share as story under Share photo, and WhatsApp for sending the campaign link',
                paragraphs: [
                    'Share as story is a second file. It is a tall 9:16 PNG for Instagram stories or WhatsApp status. The square framed face sits in the middle of a dark field. It is not a replacement for the square you set as a profile picture. Save the square first. Use the story file if you also want a status that shows the same face.',
                    'The story export does not add slogans or a fake phone UI. It is the circle on ink, sized for a story canvas. If you need type on the story, add it in Instagram or WhatsApp after you share. The Ollabs file is the picture, not a finished broadcast graphic.',
                    'After a successful save, the page switches tone. You are in. Now bring your people. Share your framed photo first. Then send the link so others can add it too. That order is deliberate. A framed selfie in the chat is proof. A bare URL without a picture is easier to ignore.',
                    'Share on WhatsApp from that screen sends the campaign link, not only the image. If the share sheet is available, Share photo stays primary and Share link on WhatsApp sits under it. If you speak Tagalog, or the product language is Indonesian, Share on Messenger also appears, because those rooms still live there. Everyone else can still use Share another way or Copy link.',
                    'There is a QR on the same screen if you need to throw the campaign onto a projector or a printed card. Scan to open this campaign. That is for a room of people, not for the person already holding the phone. For a group chat, send the link. For a hall, show the QR.',
                ],
            },
            {
                title: 'After you have the picture, send the link',
                paragraphs: [
                    'Changing your own profile picture does not add anyone else. The next person still needs the campaign URL. Paste it under the photo, or use Share link on WhatsApp so the message is already written.',
                    'The supporter paste is one line plus the URL: I just added this frame to my photo on Ollabs. Add yours. When the phone looks Brazilian, that sentence is already in Portuguese, because that is where almost all real campaigns run. You do not have to rewrite it.',
                    'Do not start a second campaign because the first download failed. The organizer already has a link. If the PNG never arrived, the fix is Share photo or Safari, not a new slug. A new URL splits the group and the counter.',
                    'If you are the organizer reading this so you can coach a group: say Share photo, then Save Image. Do not say download the frame. That phrase is how iPhone users end up in Files, or with nothing. If someone insists the button did nothing, send them Open in Safari.',
                    'Want a frame of your own after you join someone else\'s? Make your own frame at the bottom of the campaign page. That is a new campaign with a new link. It does not replace the one you just saved.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Why did Download do nothing on my iPhone?',
                a: 'Inside WhatsApp and Instagram, iPhone ignores the usual file download. Use Share photo, then Save Image. If the sheet never opens, tap Open in Safari and try again.',
            },
            {
                q: 'Where does the file go?',
                a: 'Save Image writes it to Photos. A raw download on iPhone often lands in Files instead, which is why the page avoids that path.',
            },
            {
                q: 'Is Share as story my profile picture?',
                a: 'No. Share as story is a tall image for status. The square PNG from Share photo is the one you set as a profile picture.',
            },
            {
                q: 'Do I need an Ollabs account to save?',
                a: 'No. Open the link, add a photo, and share or save. Signup is never required on the campaign page.',
            },
        ],
        cta: { href: '/guides/run-a-campaign-people-join', label: 'How to run a campaign people join' },
    },
    {
        slug: 'custom-png-frame-photo-window',
        title: 'How to make a custom PNG frame that leaves room for the face',
        description:
            'Upload a square transparent PNG, open a photo window so the face is not crushed, when the opaque warning means you should cut a hole, and when a colour ring is enough.',
        subtitle:
            'Create is Frame, Name, Send. The live preview stays on screen while you adjust the window. Most first frames fail because the art eats the face.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 8,
        sections: [
            {
                title: 'Start with a square PNG, not a photo of a poster',
                screenshot:
                    'the create Frame step with the large upload zone and a transparent PNG sitting in the circle preview',
                paragraphs: [
                    'Go to Create. You do not need an account to publish. The builder is three steps: Frame, Name, Send. Artwork is the product. Colour rings are a collapsed fallback if you have no file yet.',
                    'Upload a square PNG with transparency. The on-page tip is blunt: PNG with transparency works best. A JPEG of a logo, a screenshot of a badge, or a photo of a jersey usually looks muddy at avatar size. If the crest is unreadable at WhatsApp avatar size, the frame is not done.',
                    'The drop zone is large on purpose. The old small circle made upload feel optional. This is the whole first step. You can change the frame image later without starting over. The live preview stays visible while you work, including on a phone. Do not design in a separate tab and hope.',
                    'A square logo or round badge works. Ollabs keeps the outer design and opens a window in the center for each supporter\'s photo. You can also upload a full designed ring that already has a transparent hole. Both are valid. What does not work is a busy rectangle of slogan, date, hashtag, URL, and logo with no empty middle.',
                    'Create still accepts JPEG, WebP, and GIF. Those formats are how people arrive with a flattened export. They can still publish. They are not the best source. If you control the file, export PNG from the design tool with the center empty.',
                ],
            },
            {
                title: 'Open the photo window so the face is the subject',
                paragraphs: [
                    'After a custom image is on the canvas, a Photo window slider appears. Left is more frame. Right is more photo. The default is a centered window so solid logos and badges work without extra work. If your PNG already has a transparent center, you can pull the slider toward zero and let the file\'s own hole do the job.',
                    'Watch the live preview while you drag. The face should be the largest readable thing in the circle. If a supporter cannot see themselves, they will not save the file, so they will not send the link on. That is the whole conversion problem, and it is usually the artwork, not the share copy.',
                    'One short line of type in the ring is enough: the series title, the team name, the colour of the month. A QR code does not belong in the artwork. Every campaign already has a downloadable QR on the campaign page and on manage, for print and for a screen at the door.',
                    'If you drop an optional preview photo on the circle, you are only checking the fit. That photo is not published as a supporter. Supporters still add their own picture on the public link. The preview is so you can see whether the window crushed a real face before you tap Continue.',
                    'On phones, the preview is sticky while you adjust. That is on purpose. Do not collapse the canvas to make more room for sliders. If you cannot see the face and the window at once, you will ship a stamp-sized window and only notice after the first WhatsApp send.',
                ],
            },
            {
                title: 'The opaque warning, and what to do with it',
                paragraphs: [
                    'If the upload looks solid in the center, Create shows a coral warning: this image looks opaque in the center. Use a PNG with a transparent hole for the photo, or open the photo window with the slider below. The site does not block you. The warning is there because organizers often expect a designed hole and uploaded a flattened badge instead.',
                    'Two honest fixes. Re-export the file with a transparent middle, or use the slider to cut a circle so the photo shows through. A transparent border around an otherwise solid square is not a hole. The check looks at the center disc, where the face sits.',
                    'A colour ring from Simple styles is the right fallback when you have no art yet. Pick a ring, name the campaign, send. You can Change the frame from manage later without losing the link or the supporter count. That is better than delaying the first WhatsApp send for a designer who is not in the chat.',
                    'Premade rings are not the product. They exist so a teacher or a captain can publish tonight. If you have a crest, use the PNG. If you only have a hex colour in your head, use the ring and ship.',
                    'You can change the frame after people have joined. Manage has Change the frame. It reopens Create against the live campaign. The URL, the count, and old shares stay. Do not publish a second campaign to "fix the art." The people who already joined will not find the second link.',
                ],
            },
            {
                title: 'Name it so the chat preview is recognizable',
                paragraphs: [
                    'Continue takes you to Name. The title is what WhatsApp shows next to the link. A private joke that only the committee understands will look like spam to the aunt who actually posts. Use the cause, the team, the event, or the candidate the group already says out loud.',
                    'Description, goal, and category can wait. The name step says they live on Manage after you publish. Do not stall the send to write a paragraph. An empty description is common. It is not what decides whether people join. The frame and the first WhatsApp paste decide that.',
                    'A custom slug is optional: ollabs.studio/c/your-slug. Letters and numbers, dashes for the rest. You can change it later on manage. Older links redirect, so a WhatsApp message from this afternoon keeps working. Do not treat the first auto slug as permanent if you already know the public name.',
                    'There is no signup wall on Create. If you want the campaign on every device, you can save access after publish with an email code. That is optional. Do not delay Frame, Name, Send to invent a password. Supporters still never sign in.',
                    'If you are editing an existing campaign from manage, the header becomes Edit your frame. Saves to the current name. Your link and supporters stay put. That is the same builder, pointed at a live slug, not a second draft.',
                ],
            },
            {
                title: 'Send before you polish the ring again',
                screenshot:
                    'the Send step with Share on WhatsApp as the primary action after publish',
                paragraphs: [
                    'Send is the publish screen. Share on WhatsApp is the primary action because campaigns that get a first supporter almost always get that person in the first hour. Opening WhatsApp is shorter than copy, leave the app, find the group, paste.',
                    'If the phone looks Indonesian or Tagalog, Share on Messenger is there too. For everyone, Share another way and a manage link exist. The manage URL includes a private key. Bookmark it. Do not paste the part after ?k= into the group.',
                    'A reminder: the first hour is not a marketing slogan. Of the campaigns that ever got a supporter, the median first one arrived 4.5 minutes after publish. Eighty-four percent of those first supporters arrived inside the first hour. Not one campaign got its first supporter after 24 hours. Either the link is sent now, or it is not sent.',
                    'If the window still feels tight after the first five saves, Change the frame. Keep the same URL. Ask the same group to try once more. A cleaner PNG in an existing thread beats a new slug that nobody recognizes.',
                    'When you know you will run another frame next month, claim a hub at /u/your-handle for the bio. That needs a free organizer login so the handle stays yours. It is not required for tonight\'s PNG. Publish, WhatsApp, then hub if you still have energy.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Does the PNG have to be transparent?',
                a: 'It works best that way. An opaque file can still publish if you open the photo window with the slider. The coral warning is a hint, not a lock.',
            },
            {
                q: 'Can I fix the art after people join?',
                a: 'Yes. Change the frame on manage. The link and the supporter count stay. Do not create a second campaign to reset the look.',
            },
            {
                q: 'Do I need an account to create?',
                a: 'No. Publish first. Optional email save lets you manage the same campaign from another phone.',
            },
            {
                q: 'Where do colour rings fit?',
                a: 'Simple styles are a fallback when you have no artwork yet. Custom PNG is the main path. You can replace a ring later from manage.',
            },
        ],
        cta: { href: '/create', label: 'Create a campaign' },
    },
    {
        slug: 'read-campaign-dashboard',
        title: 'How to read your campaign dashboard after you publish',
        description:
            'What views, supporters, and conversion actually mean, how to use the 14-day chart and country list, when to change the frame instead of the link, and how to keep the manage key private.',
        subtitle:
            'Manage is the private page for the person who published. It is not the public campaign. The numbers tell you whether the link left your phone, and whether the frame is the problem.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 8,
        sections: [
            {
                title: 'How you get into manage',
                screenshot:
                    'the manage dashboard header with the campaign URL, WhatsApp, Copy, and QR',
                paragraphs: [
                    'When you publish, you get a manage URL that looks like the campaign plus /manage, often with ?k= on the end. That key is proof you made the campaign. Bookmark it. The welcome email has it if you left an address. Do not share the part after ?k= in the same chat as the public /c/ link.',
                    'Once the page loads with the key, the address bar drops k= so a screenshot or a refresh is less likely to leak it. The dashboard stays private to whoever holds the link. If you lose it and you never saved an email, Recover cannot invent access. The history of that manage URL on your phone is then the only way back.',
                    'If the key is missing, manage says it needs your private manage key and asks you to use the link you saved when you created the campaign. That is not a login form. There is no password on the campaign itself.',
                    'From manage you can still Share on WhatsApp, copy the public URL, open the campaign, or show a QR to print. Those actions send people to /c/your-slug, not to the dashboard. Keep those two URLs straight in your own notes.',
                    'There is a shortcut to set up a campaign hub from manage. That is the bio page at /u/… with a Join button. It is optional. Stats below are about this one campaign, not the hub.',
                    'If you published on one phone and opened manage on another, you still need the key or a signed-in session. A public /c/ page never turns into this dashboard. There is no hidden admin button for supporters to stumble into.',
                ],
            },
            {
                title: 'Views, supporters, and conversion',
                paragraphs: [
                    'Views are people who opened the public campaign page. Supporters are people who saved or shared a framed photo. Conversion is supporters divided by views, shown as a percent, or 0% when nobody has viewed yet.',
                    'The counter is not likes. It is not inflated. A person who fitted a face and left without saving is a view, not a supporter. If you are staring at a number in the teens, you are looking at real files that left the site.',
                    'If both views and supporters are tiny, the link never left your phone. Open WhatsApp from manage and send it to one group that already cares. Most campaigns that take off get the first person in the first hour. Waiting until morning is a different experiment, and the data we have says the first supporter does not arrive the next day.',
                    'If views are high and supporters are not, the frame is usually the problem. Faces too small, type too dense, or a design that reads as a watermark. Change the frame from the same dashboard. Upload a cleaner PNG. Ask the same group to try once more. Keep the URL.',
                    'Zero supporters gets a coral nudge at the top: No supporters yet. Share now. That is not decoration. Dead campaigns tend to have almost no views, which means the paste never happened. The button is WhatsApp again, not a new slug.',
                    'Conversion can look dramatic on tiny numbers. Two saves from five views is 40%. That is a small room, not a viral page. Use conversion to compare frame A to frame B on the same link after you change the art, not to brag about a percentage from a dozen opens.',
                ],
            },
            {
                title: 'The 14-day chart and the country list',
                paragraphs: [
                    'New supporters, last 14 days is a bar per day. If the window is empty, the copy says to share your link. If there is activity, you can see whether yesterday was a spike or a drip. A one-day spike after a meeting is normal. A flat line after a big view count is the frame again.',
                    'Supporters by country uses the country on each save, when the product has it. For Ollabs overall, almost all real use is Brazil. If your own breakdown is almost all one country, write the next ask in that language. The WhatsApp paste already switches to Portuguese when the phone looks Brazilian. Use that rather than mixing English into a Portuguese group.',
                    'Country is a hint for language, not a targeting tool. There is no ad buy here. You are looking at who already opened your link. If the list is one country and the chat is in another language, you are sending the wrong sentence.',
                    'The chart does not replace the first-hour rule. A campaign that sits idle for a day rarely wakes up on its own. Explore lists public campaigns that already have supporters. It is not a discovery engine for a link you have not sent.',
                    'Do not start a second campaign to reset the graph. The people who already joined the first one will not find the second. Change the art, keep the link, send again today.',
                ],
            },
            {
                title: 'Change the frame, the title, and the slug',
                screenshot:
                    'the Frame section on manage with Change the frame next to the circular preview',
                paragraphs: [
                    'Frame on manage shows the current preview. Change the design without starting over. Your link, your supporter count, and everyone who already has the link stay exactly as they are. That button exists because organizers who disliked the art used to publish an entire second campaign and abandon the first count.',
                    'Campaign details let you edit title, description, supporter goal, and category. Title is the chat preview. Goal is optional and does not invent supporters. Category helps Explore later, once you actually have people. None of these replace sending WhatsApp.',
                    'Custom link is the slug after ollabs.studio/c/. Letters and numbers become dashes. Changing it updates the share link. Older links redirect automatically so WhatsApp shares keep working. Still tell the next group the new URL if you can. Redirects are a safety net, not a reason to rename every hour.',
                    'Save changes writes those fields. Errors render next to the button, not in an alert. If you change the slug, the address bar moves to the new /manage path. Keep the bookmark in sync.',
                    'There is no public or private toggle on this screen for "unlist." Explore only shows public campaigns with supporters and a visible frame. If you need a bio list that hides old work, that hide control lives on the hub editor, not here. Manage is one campaign.',
                ],
            },
            {
                title: 'What manage is not',
                paragraphs: [
                    'It is not a social feed. There are no comments. You will not see who saved, only that they did, plus countries in aggregate. That is enough to know whether to send again or to change the PNG.',
                    'It is not billing. Paid upgrade interest lives on the hub waitlist if you ever want it. This dashboard does not charge supporters and does not watermark their photo.',
                    'It is not the place to argue with a report. Anyone can report a campaign from the public page. Enough separate reports can hide a campaign from Explore and public lists. If that happens, the public link may stop being listed even if you still hold manage. Keep the art and the ask clean so you are not relying on a listing you never needed. WhatsApp does not use Explore.',
                    'Print the QR from manage for a door, a badge, or a holding slide. That is for people in a room. The WhatsApp paste is for people not in the room. Use both if you have an event. For a group chat only, skip the QR and send the link.',
                    'If you will run more than one frame, set up the hub from the row on this page. Join on the hub still opens whichever campaign you feature. Hide old campaigns on the hub so the list stays current. Strangers from a bio should get /u/. The group that already said yes should get /c/.',
                    'A reminder email exists for campaigns that still have zero supporters. If you get one, the fix is another WhatsApp send, not a new slug. The dashboard is already telling you the same thing with the coral box. Email is for organizers who closed the tab.',
                ],
            },
        ],
        faqs: [
            {
                q: 'What is the difference between views and supporters?',
                a: 'Views are opens of the campaign page. Supporters are people who saved or shared a framed photo. Conversion is that ratio as a percent.',
            },
            {
                q: 'Can I change the frame without losing the count?',
                a: 'Yes. Change the frame on manage. The link and the supporter number stay.',
            },
            {
                q: 'What if I lose the manage link?',
                a: 'If you saved an email at publish, use Recover. If you did not, the dashboard URL in your browser history is the only way back.',
            },
            {
                q: 'Should I share the manage URL in the group?',
                a: 'No. Share /c/your-slug. Keep ?k= and /manage for yourself.',
            },
        ],
        cta: { href: '/guides/start-a-campaign', label: 'How to start a campaign' },
    },
    {
        slug: 'keep-campaign-when-you-switch-phones',
        title: 'How to keep a campaign when you switch phones',
        description:
            'Publish without an account, bookmark the private manage key, save access with a 6 digit email code, recover a lost dashboard, and claim the campaign onto a login so My campaigns follows you.',
        subtitle:
            'Create does not require a signup. That is a feature until the phone dies. These are the three ways the same campaign stays yours.',
        author: AUTHOR,
        publishedAt: '2026-08-28',
        readingMinutes: 8,
        sections: [
            {
                title: 'You can publish with nothing but a frame',
                paragraphs: [
                    'Frame, Name, Send works without an account. That is why a captain can finish a PNG in a bus queue. Supporters never sign in either. The cost of that speed is that the site does not magically know you on the next device.',
                    'After publish you hold two different URLs. The public one is /c/your-slug. Anyone may open it, add a photo, and save. The private one is manage, with a key. Whoever has the key can change the title, the frame, and the slug. Treat the key like a spare key to a room, not like a poster.',
                    'Bookmark manage before you close the tab. Screenshot is a poor backup, because the page tries to drop k= from the address bar once the cookie is set, so a later screenshot may not include the key. The bookmark should be the original link from publish, or the copy in the welcome mail.',
                    'If you already sent WhatsApp, you are not blocked. The campaign is live. You are only blocked from editing it on a new phone. The group can still join. Fix access when you have a minute, not instead of the first send.',
                    'A hub is different. Claiming /u/your-handle needs a free organizer login so the page stays yours if you switch phones. Do not delay the first WhatsApp send to set up a bio. Publish the campaign, then save access, then hub.',
                    'If you paste the manage URL into the same group as the campaign, anyone in the thread can change the title, the slug, and the frame. There is no revoke-key button on the dashboard. Treat that thread as shared ownership. Save access to your email so you still have a path in, and stop pasting /manage into chats. Share /c/ only.',
                ],
            },
            {
                title: 'Save access with an email code',
                screenshot:
                    'the publish screen offer to save campaigns with an email and a 6 digit code',
                paragraphs: [
                    'On the send screen there is an optional Save your campaigns step. Optional, but this is how you manage the campaign from another phone. Get a 6 digit code by email. No password. Supporters still never sign in.',
                    'Enter the address, read the code, confirm. Signing in claims every campaign created with that address. If this campaign was created without an email, publish also attaches it with the owner token so either path covers you.',
                    'After that, My campaigns on a signed-in phone lists what you own. You can open manage without fishing through old WhatsApp messages. The public link does not change. The group does not need to know you signed in.',
                    'Use a mailbox you will still have next month. A throwaway inbox is how people lock themselves out of a campaign that is still circulating. Recover later asks for the same address you used here.',
                    'You can skip this on the first night. Bookmark manage instead. Come back and save access from publish or from a later login when you are not in a rush. The only failure is doing neither, then wiping the phone.',
                    'The code expires. If you wait too long on the publish screen, request another. Wrong digits show an error next to the field, not a blocking popup. You can still share WhatsApp while that box is open. Saving access is not a gate in front of the group.',
                ],
            },
            {
                title: 'Recover when the bookmark is gone',
                paragraphs: [
                    'Recover is a form at /recover. Enter the email. If that address has campaigns, a link is on its way. It works once and expires in 24 hours. The page will not tell a stranger whether the address is in the system beyond that copy, on purpose.',
                    'Only works if you gave your email when you created the campaign. If you did not, the dashboard link from your browser history is the only way back in. That sentence is on the form because it is the whole product constraint, not a support dodge.',
                    'The recover mail lands from Ollabs. Open it on the new phone, tap once, and you should be able to reach the campaigns tied to that inbox. Then bookmark manage again, or stay signed in.',
                    'If the mail never arrives, check spam, and check that you used the same spelling as publish. There is no password reset, because there is no password. The code and the recover link are the whole account.',
                    'Do not create a second campaign with a new slug as a substitute for recover. The old link is still in the group. A duplicate splits the count and looks like spam the second time it hits the same thread.',
                ],
            },
            {
                title: 'Claim a campaign you already published',
                paragraphs: [
                    'Claim attaches an existing campaign to the signed-in account. The owner token on the manage link is the proof. It covers the case sign-in alone cannot: campaigns created without an email, which is most of them.',
                    'Practical version: open manage with the key you still have, sign in, and the campaign should show under My campaigns. If you published while signed in, that attach can happen in the same session. If you published signed out, keep the manage link until you have signed in once with it.',
                    'After light login, you can also claim a bio hub featuring this campaign. That is one tap from publish when you want /u/your-handle in an Instagram bio. The hub handle has to stay yours, so that step requires the login even though Create did not.',
                    'My campaigns is the signed-in list. It is not public. It is how you find last month\'s slug without searching your camera roll for a QR. From there you still share /c/ in chats, not the manage URL.',
                    'If two people in a committee both need to edit, they need the manage link or the same signed-in mailbox. There is no separate "admin seats" product. Treat the mailbox as the committee inbox if more than one person will change the frame.',
                ],
            },
            {
                title: 'What to do tonight vs what to do this week',
                paragraphs: [
                    'Tonight: publish, WhatsApp, bookmark manage. If the first supporter has not arrived, send the link again to a different group, still today. Do not spend the hour on a hub, a category, or a custom slug.',
                    'This week: save access with email so the next phone is not a crisis. Change the frame if views arrived and saves did not. Set a hub only if you need a bio URL that will still work when this campaign is no longer the one you feature.',
                    'If you already lost the key and never left an email, you cannot reconstruct ownership from the public page. Anyone can still join the campaign. You just cannot edit the title or the PNG. Leave it. Send the existing link. Make the next campaign with email save turned on.',
                    'The organizer mobile tabs are Mine, Create, Hub. They hide on public /c/ and /u/ pages so supporters are not invited into your tools. If you do not see Mine, you are on a supporter surface, or you are not signed in.',
                    'None of this is required for the people adding a photo. They never see manage. They never see Recover. Your job on their side is still Share photo, then the link. Ownership is only your problem, and only the second time you need the dashboard.',
                    'If a colleague takes over the campaign, send them the manage bookmark or add them to the mailbox you used for the 6 digit code. Do not send them a screenshot of stats and expect them to guess the key. The public page has no hidden owner menu.',
                    'Switching phones is the common case. Switching browsers on the same phone is the same problem if you never saved email and you cleaned history. Recover will not help a blank inbox. Keep one bookmark or one inbox. That is the whole backup plan.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Do I have to sign in to publish?',
                a: 'No. Sign in is how you find the campaign again on another phone. Supporters never sign in.',
            },
            {
                q: 'What is the 6 digit code for?',
                a: 'It proves you own the email. There is no password. The code is how Save your campaigns works.',
            },
            {
                q: 'Can Recover work without an email?',
                a: 'No. Without an email, only the manage link you saved, usually in browser history, can open the dashboard.',
            },
            {
                q: 'Does claiming change the public URL?',
                a: 'No. /c/your-slug stays. Claiming attaches the campaign to your account and can feature it on a hub if you set one up.',
            },
        ],
        cta: { href: '/recover', label: 'Recover your campaigns' },
    },
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
