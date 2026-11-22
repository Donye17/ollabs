// Christmas, New Year and Carnaval.
//
// Added November 2026 for the season after the Brazilian election. Brazil is
// still the largest market and these are its three biggest shared dates in the
// next ninety days; Christmas is also the largest date of the year in the
// Philippines. Kept to three pages to respect the 40-page cap.

import type { AwarenessDay } from '@/lib/days';

export const HOLIDAY_DAYS: AwarenessDay[] = [
    {
        slug: 'christmas',
        name: 'Christmas',
        kind: 'day',
        date: { type: 'fixed', month: 12, day: 25 },
        colors: [
            { name: 'Holly red', hex: '#B91C1C' },
            { name: 'Pine green', hex: '#166534' },
        ],
        category: 'community',
        audience: ['Churches', 'Schools', 'Families', 'Charity drives', 'Local businesses', 'Teams and clubs'],
        keyword: 'christmas profile picture frame',
        tagline: 'One frame for the whole parish, office or family group chat.',
        intro: [
            'Christmas is December 25. In Brazil it lands in the middle of summer and the main meal is the ceia on the night of the 24th. In the Philippines the season starts in September and runs into January, the longest Christmas in the world.',
            'A shared frame gives a church, a school, a toy drive or a family one link for the season. Everyone puts the same thing on their photo, and nothing is added on top of the picture they download.',
        ],
        background: [
            'Christmas marks the birth of Jesus and is a public holiday in Brazil, the Philippines, India and most of the Americas and Europe. For many people it is as much a family and community date as a religious one.',
            'In the Philippines, Simbang Gabi is a series of nine dawn or evening Masses from December 16 to 24. Parishes and barangays often run their own campaigns through the whole novena.',
            'In Brazil, the Correios run Papai Noel dos Correios every year: children write letters to Santa, and anyone can adopt one and deliver the gift. Schools, companies and neighbourhood groups organise around it from November.',
        ],
        howToCelebrate: [
            {
                title: 'Adopt one letter, not a cause',
                body: 'Charity at Christmas works best when it is specific. A letter from one child, one family on a parish list or one shelter wish list is easier to finish than a general donation.',
            },
            {
                title: 'Write the card you never send',
                body: 'Pick one person who made your year easier, a teacher, a neighbour, a nurse, and tell them what they did. It takes ten minutes and nobody forgets it.',
            },
            {
                title: 'Cook the dish with a story',
                body: 'Every family has one recipe that only appears in December. Ask who taught it and write it down this year, before the person who knows it is not at the table.',
            },
            {
                title: 'Put your group on your photo',
                body: 'Use your church, school or family frame so the people who scroll past know which table you are sitting at this year.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Start early',
                body: 'Toy drives and letter adoptions need weeks, not days. A frame launched in late November gives the campaign time to spread before people travel.',
            },
            {
                title: 'Say what the frame is for',
                body: 'A frame with a purpose, a drive, a Mass schedule, a fundraiser, gets shared more than a generic holiday border. Put the one thing you want people to do in the caption.',
            },
            {
                title: 'Keep it welcoming',
                body: 'Your community may include people who mark the season differently. A frame that names the parish or the drive works for everyone who wants to take part.',
            },
        ],
        campaignIdeas: [
            'A parish frame for Simbang Gabi, shared on the first night of the novena.',
            'A school frame for a letter adoption or toy drive, with the drop-off date in the caption.',
            'A company frame for the end-of-year party or the team charity drive.',
            'A family frame with the surname and the year, for the group chat and the ceia.',
            'A shop frame for the Christmas sale, used by staff on their own profiles.',
        ],
        faqs: [
            { q: 'When is Christmas?', a: 'December 25 every year. In Brazil the main celebration is usually the night of the 24th, and in the Philippines the season runs from September into January.' },
            { q: 'Can we make a frame for a toy or letter drive?', a: 'Yes. Make one frame, share one link, and put the drop-off date or the instructions in the share caption.' },
            { q: 'Do supporters need an account?', a: 'No. They open the link, add their photo and download it. No account, no watermark.' },
            { q: 'Can we reuse the frame next year?', a: 'Yes. Keep the campaign and update the year or the caption next December.' },
        ],
        relatedUseCases: ['churches', 'schools', 'fundraisers', 'companies', 'events'],
        relatedDays: ['new-year', 'philippines-bonifacio-day', 'dia-das-criancas'],
    },
    {
        slug: 'new-year',
        name: 'New Year',
        kind: 'day',
        date: { type: 'fixed', month: 1, day: 1 },
        colors: [
            // Gold first: the generated ring uses colors[0], and white vanishes on most photos.
            { name: 'Midnight gold', hex: '#CA8A04' },
            { name: 'Réveillon white', hex: '#F8FAFC' },
        ],
        category: 'community',
        audience: ['Friends and families', 'Teams and clubs', 'Churches', 'Schools', 'Local businesses', 'Event organisers'],
        keyword: 'new year profile picture frame',
        tagline: 'Start the year with the people you are starting it with.',
        intro: [
            'New Year is January 1, and for most groups the real event is the night of December 31. In Brazil it is Réveillon, and millions wear white to the beach. In the Philippines families fill the table with round fruit and jump at midnight.',
            'A frame for the year turns a group into something visible: the team that made it through, the class that graduates this year, the church that starts the year together. One link, no account for anyone you invite.',
        ],
        background: [
            'January 1 is a public holiday almost everywhere that uses the Gregorian calendar. The traditions on the night before are local, and they are what people actually remember.',
            'In Brazil, white clothes are worn for peace, and coastal cities hold huge fireworks displays, Copacabana in Rio being the best known. Many people jump seven waves at midnight, a custom tied to the orixá Iemanjá.',
            'In the Philippines, twelve round fruits on the table stand for prosperity in each month, polka dots are worn for the same reason, and children jump at midnight in the hope of growing taller.',
        ],
        howToCelebrate: [
            {
                title: 'Write down three things, not resolutions',
                body: 'Three things that went right this year, with a name attached to each. It is a better start than a list of things to fix.',
            },
            {
                title: 'Keep one tradition from where you are from',
                body: 'White clothes, seven waves, twelve grapes, round fruit. If your family is far away, keeping their custom is a way of being at their table.',
            },
            {
                title: 'Send the message before midnight',
                body: 'Networks jam at 00:00. Send the message to the people who matter at 23:30 and actually be present when the year turns.',
            },
            {
                title: 'Put the year on your photo',
                body: 'Use a frame for your team, class or group so the first photo of the year says who you are starting it with.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Use it to open a season',
                body: 'January is when sports clubs, schools and churches start a new cycle. A frame with the year and the group name works as the launch of that season.',
            },
            {
                title: 'Thank the people who stayed',
                body: 'A frame for members, volunteers or staff who were there all year lands better than a generic greeting. Say thank you in the caption.',
            },
            {
                title: 'Plan the link for the 31st',
                body: 'Publish a day or two before and send the link in the morning of December 31, before people are at the party and away from their phones.',
            },
        ],
        campaignIdeas: [
            'A team frame with the new year and the club badge, for the start of the season.',
            'A class frame for the year students graduate.',
            'A church frame for the first service of the year.',
            'A company frame thanking staff for the year that ended.',
            'A Réveillon party frame with the venue name, shared on the morning of the 31st.',
        ],
        faqs: [
            { q: 'When should we publish a New Year frame?', a: 'A day or two before December 31, and send the link that morning. Most frames get their supporters in the first hour after the link goes out.' },
            { q: 'Why do Brazilians wear white on New Year?', a: 'White is worn for peace and a fresh start, and on the coast it is also tied to offerings for Iemanjá.' },
            { q: 'Do supporters need an account?', a: 'No. They open the link, add their photo and download it.' },
        ],
        relatedUseCases: ['events', 'sports-teams', 'schools', 'churches', 'companies'],
        relatedDays: ['christmas', 'carnaval'],
    },
    {
        slug: 'carnaval',
        name: 'Carnaval',
        kind: 'season',
        date: { type: 'easter-offset', from: -50, to: -47 },
        colors: [
            { name: 'Folia purple', hex: '#7E22CE' },
            { name: 'Confetti yellow', hex: '#FACC15' },
            { name: 'Samba green', hex: '#15803D' },
        ],
        category: 'event',
        audience: ['Blocos de rua', 'Samba schools', 'Event organisers', 'Bars and venues', 'Friend groups', 'Brands'],
        keyword: 'carnaval profile picture frame',
        tagline: 'Every bloco needs a flag. This one goes on everyone\'s photo.',
        intro: [
            'Carnaval in Brazil runs from the Saturday to the Tuesday before Ash Wednesday, and the date moves with Easter. In 2027 that is February 6 to 9, with many cities partying for days either side.',
            'A bloco, a samba school or a group of friends can give everyone the same frame before the first day, so the whole group is recognisable in every photo that comes out of the week.',
        ],
        background: [
            'Carnaval takes place in the days before Lent. In Brazil it is the largest party of the year, and the Tuesday is an optional holiday in most of the country.',
            'Each city has its own Carnaval. Rio is known for the samba school parades in the Sambadrome and hundreds of street blocos. Salvador has the trios elétricos. Recife and Olinda have frevo and maracatu. São Paulo has grown one of the biggest street Carnavals in the country.',
            'Blocos de rua are open street parades, usually organised by a group of friends, a neighbourhood or a band. Many have their own name, colours and identity, which is exactly what a frame carries.',
        ],
        howToCelebrate: [
            {
                title: 'Choose your blocos before the week',
                body: 'City calendars are published weeks ahead. Pick the two or three you actually want and plan around them, instead of chasing every crowd.',
            },
            {
                title: 'Agree a meeting point and a time',
                body: 'Phones die and networks jam. Decide where the group meets if someone gets lost before you leave home.',
            },
            {
                title: 'Learn one song properly',
                body: 'Every bloco has its anthem. Knowing the words is the difference between watching the parade and being in it.',
            },
            {
                title: 'Wear your colours on your profile too',
                body: 'Use your bloco or group frame so the people who were not there can still see which crowd you were in.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Launch the frame with the date',
                body: 'Announce the parade day and route with the frame link. People share the frame and the information travels with it.',
            },
            {
                title: 'Use the bloco colours, not a generic theme',
                body: 'A frame in your own colours and name is what makes members proud to use it. Upload your logo or artwork as a transparent PNG.',
            },
            {
                title: 'Bars and venues: one frame for the whole team',
                body: 'Staff and regulars using the same frame turns the venue into a destination for the week, at no cost.',
            },
        ],
        campaignIdeas: [
            'A bloco frame with the name, the year and the parade date.',
            'A samba school frame for the members, released before the parade.',
            'A friend group frame with an inside joke the whole group will understand.',
            'A bar or venue frame for staff and regulars during the week.',
            'A city or neighbourhood frame for the local street Carnaval.',
        ],
        faqs: [
            { q: 'When is Carnaval in 2027?', a: 'The main days are Saturday February 6 to Tuesday February 9, 2027. Ash Wednesday is February 10. The date changes every year because it follows Easter.' },
            { q: 'Can our bloco use its own logo?', a: 'Yes. Upload your artwork as a transparent PNG, or pick your colours in the builder.' },
            { q: 'Do people need an account to use the frame?', a: 'No. They open the link, add their photo and download it. No account, no watermark.' },
        ],
        relatedUseCases: ['events', 'companies', 'awareness-campaigns'],
        relatedDays: ['new-year', 'independencia-do-brasil'],
    },
];
