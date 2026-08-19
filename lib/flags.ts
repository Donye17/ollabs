import { FrameConfig, FrameType } from '@/lib/types';

// Country flag frames.
//
// The artwork came out of the old `frames` table, which migration 0008 drops.
// scripts/export-frames.mjs decodes each one to public/frames/<slug>.png, so
// this module only carries the copy and the metadata around them.
//
// Every page needs a reason to exist beyond the image. Thirty pages that differ
// only by a country name is exactly the thin-content pile Google ignores, so
// each entry carries its own national day and its own two lines about what the
// flag actually means.
//
// Brazil is written in Portuguese. It is the one page whose audience is already
// here: 96.7% of traffic is Brazilian. The rest stay English until there is a
// reason to translate them.

export interface Flag {
    /** URL segment: /flags/<slug> */
    slug: string;
    /** File written by the export script, derived from the old frame name. */
    file: string;
    country: string;
    demonym: string;
    /** Set when the page copy is not English. Drives the html lang attribute. */
    lang?: 'pt-BR';
    title: string;
    description: string;
    heading: string;
    intro: string[];
    /** Null where a country genuinely has no official national day. */
    nationalDay: string | null;
    keywords: string[];
}

export const FLAGS: Flag[] = [
    {
        slug: 'brazil',
        file: '/frames/brazil-flag.png',
        country: 'Brasil',
        demonym: 'brasileira',
        lang: 'pt-BR',
        title: 'Moldura da Bandeira do Brasil para Foto de Perfil',
        description: 'Coloque a bandeira do Brasil na sua foto de perfil de graça. Sem cadastro, sem anúncio e sem marca d\'água. Funciona no Instagram, WhatsApp, Facebook e X.',
        heading: 'Moldura da bandeira do Brasil',
        intro: [
            'O verde e o amarelo vêm das casas de Bragança e Habsburgo, o losango e a esfera azul chegaram depois, e as 27 estrelas representam os estados e o Distrito Federal, dispostas como o céu do Rio na madrugada de 15 de novembro de 1889.',
            'Use a moldura para o Sete de Setembro, para jogo da Seleção ou para qualquer momento em que a bandeira faça sentido. Basta enviar a foto, ajustar o enquadramento e baixar. Nada é publicado e a sua foto não sai do seu aparelho.',
        ],
        nationalDay: 'Independência do Brasil, 7 de setembro',
        keywords: ['moldura bandeira do brasil', 'foto de perfil brasil', 'moldura brasil', 'bandeira do brasil png', 'moldura para foto'],
    },
    {
        slug: 'usa',
        file: '/frames/usa-flag.png',
        country: 'the United States',
        demonym: 'American',
        title: 'USA Flag Profile Picture Frame',
        description: 'Add the American flag to your profile picture for free. No signup, no ads, no watermark. Works on Instagram, Facebook, X and LinkedIn.',
        heading: 'USA flag frame',
        intro: [
            'Thirteen stripes for the original colonies and fifty stars for the states, a design that has been amended twenty-seven times and last changed in 1960 when Hawaii joined.',
            'Good for the Fourth of July, Memorial Day, Veterans Day, or an Olympics run. Upload a photo, drag to frame it, download. Nothing gets posted anywhere.',
        ],
        nationalDay: 'Independence Day, 4 July',
        keywords: ['usa flag profile picture', 'american flag frame', 'us flag pfp', 'fourth of july profile picture'],
    },
    {
        slug: 'uk',
        file: '/frames/uk-flag.png',
        country: 'the United Kingdom',
        demonym: 'British',
        title: 'UK Flag Profile Picture Frame',
        description: 'Add the Union Jack to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'UK flag frame',
        intro: [
            'The Union Jack layers the crosses of St George, St Andrew and St Patrick, which is why the white diagonals sit off-centre and why hanging it upside down is a genuine mistake rather than a myth.',
            'The United Kingdom has no official national day, so this one gets used for coronations, jubilees, tournaments and Remembrance more than for any fixed date.',
        ],
        nationalDay: null,
        keywords: ['uk flag profile picture', 'union jack frame', 'british flag pfp'],
    },
    {
        slug: 'canada',
        file: '/frames/canada-flag.png',
        country: 'Canada',
        demonym: 'Canadian',
        title: 'Canada Flag Profile Picture Frame',
        description: 'Add the Canadian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Canada flag frame',
        intro: [
            'The Maple Leaf is young as flags go, raised for the first time in 1965 after a debate so heated it ran for months in Parliament. The eleven points on the leaf mean nothing in particular; they simply held up best in a wind tunnel.',
            'Popular around Canada Day and any hockey tournament. Upload, adjust, download.',
        ],
        nationalDay: 'Canada Day, 1 July',
        keywords: ['canada flag profile picture', 'canadian flag frame', 'maple leaf pfp'],
    },
    {
        slug: 'mexico',
        file: '/frames/mexico-flag.png',
        country: 'Mexico',
        demonym: 'Mexican',
        title: 'Mexico Flag Profile Picture Frame',
        description: 'Add the Mexican flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Mexico flag frame',
        intro: [
            'The eagle on the cactus devouring a serpent is the founding vision of Tenochtitlan, which makes this one of the few national flags whose centrepiece is a specific mythological scene rather than an abstract emblem.',
            'Used most around 16 September and the Grito, and every World Cup. Upload a photo and download it framed.',
        ],
        nationalDay: 'Independence Day, 16 September',
        keywords: ['mexico flag profile picture', 'bandera de mexico foto de perfil', 'mexican flag frame'],
    },
    {
        slug: 'argentina',
        file: '/frames/argentina-flag.png',
        country: 'Argentina',
        demonym: 'Argentine',
        title: 'Argentina Flag Profile Picture Frame',
        description: 'Add the Argentine flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Argentina flag frame',
        intro: [
            'Light blue and white were chosen by Manuel Belgrano in 1812, and the Sol de Mayo in the centre is a representation of Inti, the Incan sun, with alternating straight and wavy rays.',
            'Comes out for 9 July, for Copa América and for anything involving the Seleción. Upload, frame, download.',
        ],
        nationalDay: 'Independence Day, 9 July',
        keywords: ['argentina flag profile picture', 'bandera argentina foto de perfil', 'argentine flag frame'],
    },
    {
        slug: 'france',
        file: '/frames/france-flag.png',
        country: 'France',
        demonym: 'French',
        title: 'France Flag Profile Picture Frame',
        description: 'Add the French flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'France flag frame',
        intro: [
            'The tricolore puts the white of the monarchy between the blue and red of Paris, a compromise from 1794 that outlived the thing it was compromising about.',
            'Used for 14 July, for the Six Nations and for moments of national solidarity. Upload a photo and download it framed.',
        ],
        nationalDay: 'Bastille Day, 14 July',
        keywords: ['france flag profile picture', 'drapeau francais photo de profil', 'french flag frame'],
    },
    {
        slug: 'germany',
        file: '/frames/germany-flag.png',
        country: 'Germany',
        demonym: 'German',
        title: 'Germany Flag Profile Picture Frame',
        description: 'Add the German flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Germany flag frame',
        intro: [
            'Black, red and gold trace back to the uniforms of the Lützow Free Corps and were carried by the 1848 revolutionaries long before they belonged to any German state.',
            'Used around German Unity Day and every major tournament. Upload, adjust the crop, download.',
        ],
        nationalDay: 'German Unity Day, 3 October',
        keywords: ['germany flag profile picture', 'deutschland flagge profilbild', 'german flag frame'],
    },
    {
        slug: 'italy',
        file: '/frames/italy-flag.png',
        country: 'Italy',
        demonym: 'Italian',
        title: 'Italy Flag Profile Picture Frame',
        description: 'Add the Italian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Italy flag frame',
        intro: [
            'Il Tricolore was first flown in Reggio Emilia in 1797, borrowing the French arrangement and swapping blue for green, reportedly after the green of the Milanese civic guard.',
            'Used for Republic Day on 2 June and for the Azzurri. Upload a photo and download it framed.',
        ],
        nationalDay: 'Republic Day, 2 June',
        keywords: ['italy flag profile picture', 'bandiera italiana foto profilo', 'italian flag frame'],
    },
    {
        slug: 'spain',
        file: '/frames/spain-flag.png',
        country: 'Spain',
        demonym: 'Spanish',
        title: 'Spain Flag Profile Picture Frame',
        description: 'Add the Spanish flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Spain flag frame',
        intro: [
            'The red and yellow bands were picked by Charles III in 1785 for a practical reason: he wanted a naval ensign visible from a long way off, and the existing white Bourbon flags were indistinguishable at sea.',
            'Used around the Fiesta Nacional on 12 October and for La Roja. Upload, frame, download.',
        ],
        nationalDay: 'Fiesta Nacional, 12 October',
        keywords: ['spain flag profile picture', 'bandera de españa foto de perfil', 'spanish flag frame'],
    },
    {
        slug: 'poland',
        file: '/frames/poland-flag.png',
        country: 'Poland',
        demonym: 'Polish',
        title: 'Poland Flag Profile Picture Frame',
        description: 'Add the Polish flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Poland flag frame',
        intro: [
            'White above red, taken from the white eagle on a red field that has been the Polish arms since the thirteenth century. The order matters: reversed, it is Monaco or Indonesia.',
            'Used most around Independence Day on 11 November. Upload a photo and download it framed.',
        ],
        nationalDay: 'Independence Day, 11 November',
        keywords: ['poland flag profile picture', 'flaga polski zdjecie profilowe', 'polish flag frame'],
    },
    {
        slug: 'ukraine',
        file: '/frames/ukraine-flag.png',
        country: 'Ukraine',
        demonym: 'Ukrainian',
        title: 'Ukraine Flag Profile Picture Frame',
        description: 'Add the Ukrainian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Ukraine flag frame',
        intro: [
            'Blue over yellow, read almost universally as sky above ripe wheat. It was banned under Soviet rule and restored in 1991, which is part of why it carries the weight it does.',
            'Used for Independence Day on 24 August and as a standing show of solidarity. Upload, adjust, download.',
        ],
        nationalDay: 'Independence Day, 24 August',
        keywords: ['ukraine flag profile picture', 'ukrainian flag frame', 'ukraine pfp', 'stand with ukraine profile picture'],
    },
    {
        slug: 'russia',
        file: '/frames/russia-flag.png',
        country: 'Russia',
        demonym: 'Russian',
        title: 'Russia Flag Profile Picture Frame',
        description: 'Add the Russian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Russia flag frame',
        intro: [
            'The white, blue and red tricolour dates to Peter the Great, who took the arrangement from the Dutch ensign while studying shipbuilding in Amsterdam.',
            'Used around Russia Day on 12 June. Upload a photo and download it framed.',
        ],
        nationalDay: 'Russia Day, 12 June',
        keywords: ['russia flag profile picture', 'russian flag frame'],
    },
    {
        slug: 'turkey',
        file: '/frames/turkey-flag.png',
        country: 'Türkiye',
        demonym: 'Turkish',
        title: 'Turkey Flag Profile Picture Frame',
        description: 'Add the Turkish flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Turkey flag frame',
        intro: [
            'The crescent and star on red were carried by the Ottoman Empire and kept by the Republic in 1923 with the proportions fixed by law, down to the exact diameter of the crescent.',
            'Used most around Republic Day on 29 October. Upload, frame, download.',
        ],
        nationalDay: 'Republic Day, 29 October',
        keywords: ['turkey flag profile picture', 'türk bayrağı profil fotoğrafı', 'turkish flag frame'],
    },
    {
        slug: 'india',
        file: '/frames/india-flag.png',
        country: 'India',
        demonym: 'Indian',
        title: 'India Flag Profile Picture Frame',
        description: 'Add the Indian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'India flag frame',
        intro: [
            'Saffron, white and green with the Ashoka Chakra at the centre, its twenty-four spokes taken from the Lion Capital at Sarnath. The wheel replaced the spinning wheel of the earlier Congress flag in 1947.',
            'Used for Independence Day on 15 August and Republic Day on 26 January. Upload a photo and download it framed.',
        ],
        nationalDay: 'Independence Day, 15 August',
        keywords: ['india flag profile picture', 'indian flag frame', 'tiranga dp', 'har ghar tiranga profile picture'],
    },
    {
        slug: 'pakistan',
        file: '/frames/pakistan-flag.png',
        country: 'Pakistan',
        demonym: 'Pakistani',
        title: 'Pakistan Flag Profile Picture Frame',
        description: 'Add the Pakistani flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Pakistan flag frame',
        intro: [
            'The green field with crescent and star carries a white band at the hoist that is there deliberately to represent the country\'s religious minorities, which few national flags do explicitly.',
            'Used around Independence Day on 14 August. Upload, adjust, download.',
        ],
        nationalDay: 'Independence Day, 14 August',
        keywords: ['pakistan flag profile picture', 'pakistani flag frame', 'azadi mubarak dp'],
    },
    {
        slug: 'bangladesh',
        file: '/frames/bangladesh-flag.png',
        country: 'Bangladesh',
        demonym: 'Bangladeshi',
        title: 'Bangladesh Flag Profile Picture Frame',
        description: 'Add the Bangladeshi flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Bangladesh flag frame',
        intro: [
            'A red disc on bottle green, with the disc set slightly toward the hoist so that it appears centred when the flag is flying rather than lying flat.',
            'Used for Independence Day on 26 March and Victory Day on 16 December. Upload a photo and download it framed.',
        ],
        nationalDay: 'Independence Day, 26 March',
        keywords: ['bangladesh flag profile picture', 'bangladeshi flag frame'],
    },
    {
        slug: 'china',
        file: '/frames/china-flag.png',
        country: 'China',
        demonym: 'Chinese',
        title: 'China Flag Profile Picture Frame',
        description: 'Add the Chinese flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'China flag frame',
        intro: [
            'One large star with four smaller ones arranged so that each of the small stars points its tip toward the centre of the large one, a detail specified precisely in the original 1949 design brief.',
            'Used around National Day on 1 October. Upload, frame, download.',
        ],
        nationalDay: 'National Day, 1 October',
        keywords: ['china flag profile picture', 'chinese flag frame'],
    },
    {
        slug: 'japan',
        file: '/frames/japan-flag.png',
        country: 'Japan',
        demonym: 'Japanese',
        title: 'Japan Flag Profile Picture Frame',
        description: 'Add the Japanese flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Japan flag frame',
        intro: [
            'The Hinomaru is about as spare as a flag gets: a crimson disc on white, in use for centuries but only given legal definition in 1999.',
            'Used around National Foundation Day and for the Olympics. Upload a photo and download it framed.',
        ],
        nationalDay: 'National Foundation Day, 11 February',
        keywords: ['japan flag profile picture', 'japanese flag frame', 'hinomaru pfp'],
    },
    {
        slug: 'south-korea',
        file: '/frames/south-korea-flag.png',
        country: 'South Korea',
        demonym: 'Korean',
        title: 'South Korea Flag Profile Picture Frame',
        description: 'Add the South Korean flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'South Korea flag frame',
        intro: [
            'The Taegukgi puts the red and blue taeguk at the centre with four trigrams from the I Ching in the corners, standing for heaven, earth, water and fire.',
            'Used around National Foundation Day on 3 October and Liberation Day on 15 August. Upload, adjust, download.',
        ],
        nationalDay: 'National Foundation Day, 3 October',
        keywords: ['south korea flag profile picture', 'korean flag frame', 'taegukgi pfp'],
    },
    {
        slug: 'vietnam',
        file: '/frames/vietnam-flag.png',
        country: 'Vietnam',
        demonym: 'Vietnamese',
        title: 'Vietnam Flag Profile Picture Frame',
        description: 'Add the Vietnamese flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Vietnam flag frame',
        intro: [
            'A single gold star on red, the five points standing for the workers, peasants, soldiers, intellectuals and traders who made up the national front.',
            'Used around National Day on 2 September. Upload a photo and download it framed.',
        ],
        nationalDay: 'National Day, 2 September',
        keywords: ['vietnam flag profile picture', 'vietnamese flag frame', 'co do sao vang'],
    },
    {
        slug: 'thailand',
        file: '/frames/thailand-flag.png',
        country: 'Thailand',
        demonym: 'Thai',
        title: 'Thailand Flag Profile Picture Frame',
        description: 'Add the Thai flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Thailand flag frame',
        intro: [
            'Five bands standing for nation, religion and monarchy. The blue centre stripe was added in 1917, partly to align Thailand visually with its First World War allies.',
            'Used around National Day on 5 December. Upload, frame, download.',
        ],
        nationalDay: 'National Day, 5 December',
        keywords: ['thailand flag profile picture', 'thai flag frame'],
    },
    {
        slug: 'indonesia',
        file: '/frames/indonesia-flag.png',
        country: 'Indonesia',
        demonym: 'Indonesian',
        title: 'Indonesia Flag Profile Picture Frame',
        description: 'Add the Indonesian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Indonesia flag frame',
        intro: [
            'Red above white, the Sang Saka Merah Putih, drawn from the banners of the Majapahit empire and near identical to Monaco\'s, which differs only in proportion.',
            'Used heavily around Independence Day on 17 August. Upload a photo and download it framed.',
        ],
        nationalDay: 'Independence Day, 17 August',
        keywords: ['indonesia flag profile picture', 'bendera indonesia foto profil', 'twibbon merah putih'],
    },
    {
        slug: 'philippines',
        file: '/frames/philippines-flag.png',
        country: 'the Philippines',
        demonym: 'Filipino',
        title: 'Philippines Flag Profile Picture Frame',
        description: 'Add the Philippine flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Philippines flag frame',
        intro: [
            'The only national flag flown differently in wartime: blue on top in peace, red on top in war. The sun\'s eight rays stand for the first provinces to revolt against Spain.',
            'Used around Independence Day on 12 June. Upload, adjust, download.',
        ],
        nationalDay: 'Independence Day, 12 June',
        keywords: ['philippines flag profile picture', 'philippine flag frame', 'filipino flag pfp'],
    },
    {
        slug: 'australia',
        file: '/frames/australia-flag.png',
        country: 'Australia',
        demonym: 'Australian',
        title: 'Australia Flag Profile Picture Frame',
        description: 'Add the Australian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Australia flag frame',
        intro: [
            'The Union Jack in the canton, the seven-pointed Commonwealth Star below it, and the Southern Cross on the fly, chosen through a public competition in 1901 with five winners who split the prize.',
            'Used around Australia Day and for the cricket. Upload a photo and download it framed.',
        ],
        nationalDay: 'Australia Day, 26 January',
        keywords: ['australia flag profile picture', 'australian flag frame', 'aussie flag pfp'],
    },
    {
        slug: 'nigeria',
        file: '/frames/nigeria-flag.png',
        country: 'Nigeria',
        demonym: 'Nigerian',
        title: 'Nigeria Flag Profile Picture Frame',
        description: 'Add the Nigerian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Nigeria flag frame',
        intro: [
            'Green, white, green, designed by a student, Michael Taiwo Akinkunmi, who entered a national competition in 1959. His original had a red sun in the middle; the judges removed it.',
            'Used around Independence Day on 1 October. Upload, frame, download.',
        ],
        nationalDay: 'Independence Day, 1 October',
        keywords: ['nigeria flag profile picture', 'nigerian flag frame', 'naija flag dp'],
    },
    {
        slug: 'south-africa',
        file: '/frames/south-africa-flag.png',
        country: 'South Africa',
        demonym: 'South African',
        title: 'South Africa Flag Profile Picture Frame',
        description: 'Add the South African flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'South Africa flag frame',
        intro: [
            'Six colours and a horizontal Y, designed in a week in 1994 and intended to read as convergence. It is the only national flag currently using six colours without a seal or crest.',
            'Used around Freedom Day on 27 April and Heritage Day. Upload a photo and download it framed.',
        ],
        nationalDay: 'Freedom Day, 27 April',
        keywords: ['south africa flag profile picture', 'south african flag frame'],
    },
    {
        slug: 'egypt',
        file: '/frames/egypt-flag.png',
        country: 'Egypt',
        demonym: 'Egyptian',
        title: 'Egypt Flag Profile Picture Frame',
        description: 'Add the Egyptian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Egypt flag frame',
        intro: [
            'Red, white and black with the Eagle of Saladin at the centre. The three bands became the template for much of the region after 1952, which is why several Arab flags share them.',
            'Used around Revolution Day on 23 July. Upload, adjust, download.',
        ],
        nationalDay: 'Revolution Day, 23 July',
        keywords: ['egypt flag profile picture', 'egyptian flag frame'],
    },
    {
        slug: 'saudi-arabia',
        file: '/frames/saudi-arabia-flag.png',
        country: 'Saudi Arabia',
        demonym: 'Saudi',
        title: 'Saudi Arabia Flag Profile Picture Frame',
        description: 'Add the Saudi flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Saudi Arabia flag frame',
        intro: [
            'The shahada above a sword on green. Because the inscription is sacred, the flag is never flown at half mast and is printed on both sides so the text reads correctly from either direction.',
            'Used around Saudi National Day on 23 September. Upload a photo and download it framed.',
        ],
        nationalDay: 'Saudi National Day, 23 September',
        keywords: ['saudi arabia flag profile picture', 'saudi flag frame'],
    },
    {
        slug: 'iran',
        file: '/frames/iran-flag.png',
        country: 'Iran',
        demonym: 'Iranian',
        title: 'Iran Flag Profile Picture Frame',
        description: 'Add the Iranian flag to your profile picture for free. No signup, no ads, no watermark.',
        heading: 'Iran flag frame',
        intro: [
            'Green, white and red with the emblem at the centre, and the takbir repeated twenty-two times in stylised Kufic script along the inner edges of the bands.',
            'Upload a photo, adjust the crop, download. Nothing is published and the photo stays on your device.',
        ],
        nationalDay: 'Islamic Republic Day, 1 April',
        keywords: ['iran flag profile picture', 'iranian flag frame'],
    },
];

export function getFlag(slug: string): Flag | undefined {
    return FLAGS.find((f) => f.slug === slug);
}

/**
 * The frame config a flag page hands to the tool.
 *
 * CUSTOM_IMAGE with zero width, matching how day pages resolve override
 * artwork: the PNG is a ring overlay, so there is no border to draw underneath.
 */
export function resolveFlagFrame(flag: Flag): FrameConfig {
    return {
        id: `flag-${flag.slug}`,
        type: FrameType.CUSTOM_IMAGE,
        name: `${flag.country} flag`,
        color1: 'transparent',
        width: 0,
        imageUrl: flag.file,
        cutoutScale: 0,
    };
}
