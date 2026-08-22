import type { UseCase } from '@/lib/useCases';

/** Filipino use-case landings at /tl/for/<slug>. */
export const USE_CASES_TL: UseCase[] = [
    {
        slug: 'simbahan',
        audience: 'Mga simbahan',
        h1: 'Profile picture frame para sa mga simbahan',
        subtitle: 'Pagsamahin ang kongregasyon para sa isang serye, outreach, o gawain.',
        keyword: 'twibbon para sa simbahan',
        intro: [
            'Mula sa bagong sermon series hanggang sa outreach at youth camp, mas madaling magpakita ng suporta kapag iisa ang frame ng komunidad. Gumawa ng twibbon para sa simbahan, magbahagi ng isang link, at hayaang idagdag ito ng bawat miyembro sa sariling larawan.',
            'Gamitin ang kulay o logo ng simbahan at ipadala ang link sa Messenger, group chat, at church bulletin.',
        ],
        benefits: [
            { title: 'Isang link para sa lahat', body: 'Ibahagi sa mga ministry, small group, at social page nang hindi nagpapadala ng magkakaibang file.' },
            { title: 'Madaling gamitin sa phone', body: 'Bubuksan lang ng miyembro ang link, pipili ng larawan, at ise-save ang may frame.' },
            { title: 'Tugma sa inyong pagkakakilanlan', body: 'Gamitin ang logo, kulay, o sariling artwork ng simbahan.' },
        ],
        faqs: [
            { q: 'Kailangan bang gumawa ng account ang mga miyembro?', a: 'Hindi. Bubuksan lang nila ang link, maglalagay ng larawan, at ise-save ang resulta.' },
            { q: 'Puwede bang gumawa ng bagong frame sa bawat serye?', a: 'Oo. Bawat serye o event ay maaaring magkaroon ng sariling campaign link at supporter count.' },
        ],
    },
    {
        slug: 'paaralan',
        audience: 'Mga paaralan',
        h1: 'Profile picture frame para sa mga paaralan',
        subtitle: 'School spirit, graduation, at mga gawain ng campus sa isang link.',
        keyword: 'twibbon para sa paaralan',
        intro: [
            'Kapag may foundation day, intramurals, graduation, o enrollment drive, makatutulong ang iisang profile frame para sabay-sabay na makilahok ang mga estudyante, magulang, guro, at alumni.',
            'Gumawa ng twibbon para sa paaralan gamit ang school colors o seal, saka ibahagi ang link sa mga class group at official page.',
        ],
        benefits: [
            { title: 'School colors at seal', body: 'Mag-upload ng sariling transparent PNG o pumili ng mga kulay na tugma sa paaralan.' },
            { title: 'Para sa paulit-ulit na okasyon', body: 'Gumawa ng hiwalay na campaign para sa bawat event, batch, o school year.' },
            { title: 'Kasali ang buong komunidad', body: 'Iisang link ang magagamit ng mga estudyante, faculty, magulang, at alumni.' },
        ],
        faqs: [
            { q: 'Puwede bang sumali ang mga magulang at alumni?', a: 'Oo. Sinumang may link ay maaaring maglagay ng frame sa sariling larawan.' },
            { q: 'Ina-upload ba sa server ang larawan ng estudyante?', a: 'Hindi. Pinoproseso ang larawan sa browser ng taong gumagamit nito.' },
        ],
    },
    {
        slug: 'mga-event',
        audience: 'Mga event',
        h1: 'Profile picture frame para sa mga event',
        subtitle: 'Bumuo ng excitement bago, habang, at pagkatapos ng event.',
        keyword: 'twibbon para sa event',
        intro: [
            'Kapag suot ng attendees ang frame ng event sa kanilang profile, nakikita agad ng mga kaibigan nila kung ano ang paparating. Isang campaign link lang ang kailangan para makasali ang speakers, volunteers, sponsors, at guests.',
            'Ilagay ang event branding sa frame, ibahagi ang link sa social posts, at gamitin ang QR code sa venue para makasali ang mga tao roon mismo.',
        ],
        benefits: [
            { title: 'QR na puwedeng i-print', body: 'Ilagay ang campaign QR sa posters, registration desk, slides, at event screens.' },
            { title: 'Mas madaling mag-imbita', body: 'Ang framed profile ng attendee ay nagiging natural na paanyaya sa kanilang network.' },
            { title: 'Sariling event branding', body: 'Gamitin ang logo, theme colors, at artwork ng event.' },
        ],
        faqs: [
            { q: 'Puwede ba itong gamitin habang nasa venue?', a: 'Oo. Ipakita ang QR code para mabuksan ng attendees ang frame tool sa kanilang phone.' },
            { q: 'Kailangan ba ng app?', a: 'Hindi. Gumagana ito direkta sa mobile browser.' },
        ],
    },
    {
        slug: 'komunidad',
        audience: 'Mga komunidad',
        h1: 'Profile picture frame para sa mga komunidad',
        subtitle: 'Pag-isahin ang mga miyembro at volunteer sa isang malinaw na panawagan.',
        keyword: 'twibbon para sa komunidad',
        intro: [
            'Mas madaling makita ang isang community drive kapag sabay-sabay itong ipinapakita ng mga miyembro. Gumawa ng profile frame para sa cleanup, donation drive, local project, o membership campaign at ibahagi ang isang link.',
            'Maaaring gamitin ng barangay group, nonprofit, volunteer network, o online community ang sariling kulay at logo para pare-pareho ang mensahe.',
        ],
        benefits: [
            { title: 'Mabilis ipamahagi', body: 'Isang link lang para sa Messenger, Viber, WhatsApp, at social pages.' },
            { title: 'Walang account para sumuporta', body: 'Makakasali ang mga tao nang hindi gumagawa ng profile o nag-i-install ng app.' },
            { title: 'Totoong bilang ng supporters', body: 'Makikita ng organizer kung ilang tao ang aktuwal na gumamit ng frame.' },
        ],
        faqs: [
            { q: 'Angkop ba ito sa nonprofit at volunteer groups?', a: 'Oo. Maaari kayong gumawa ng campaign para sa advocacy, donation drive, recruitment, o community event.' },
            { q: 'Puwede bang hindi ilista sa Explore ang campaign?', a: 'Oo. Piliing unlisted at ibahagi lamang ang direktang link sa inyong komunidad.' },
        ],
    },
    {
        slug: 'kamalayan',
        audience: 'Mga kampanya ng kamalayan',
        h1: 'Profile picture frame para sa awareness campaign',
        subtitle: 'Tulungan ang isang adhikain na makita sa mas maraming profile.',
        keyword: 'awareness campaign twibbon',
        intro: [
            'Ang awareness campaign ay lumalawak kapag ipinapakita ng mga tao ang mensahe sa sarili nilang profile. Gumawa ng twibbon para sa advocacy, health awareness month, solidarity drive, o public information campaign.',
            'Pumili ng tamang kulay o mag-upload ng sariling artwork, pagkatapos ay ibahagi ang campaign link sa mga partner at supporter.',
        ],
        benefits: [
            { title: 'Tugma sa inyong adhikain', body: 'Gamitin ang ribbon color, simbolo, o opisyal na campaign artwork.' },
            { title: 'Kumakalat mula tao sa tao', body: 'Pagkatapos gumawa ng larawan, madaling maibabahagi ng supporter ang campaign sa iba.' },
            { title: 'Tapat na supporter count', body: 'Bawat bilang ay mula sa taong aktuwal na gumamit ng frame.' },
        ],
        faqs: [
            { q: 'Puwede bang eksaktong kulay ng awareness ribbon ang gamitin?', a: 'Oo. Pumili ng eksaktong kulay o mag-upload ng custom frame design.' },
            { q: 'Puwede bang gamitin ng partner organizations ang parehong link?', a: 'Oo. Iisang link ang maaaring ibahagi ng lahat ng partner para sama-sama ang supporter count.' },
        ],
    },
];

export function getUseCaseTl(slug: string): UseCase | undefined {
    return USE_CASES_TL.find((u) => u.slug === slug);
}
