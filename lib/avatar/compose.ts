// Composes a Dummys avatar into one SVG string.
//
// The art lives in lib/avatar/dummys.json, generated from tools/avatar/dummys.
// Each part is an SVG fragment with color placeholders ({skin}, {hair}, {c1}...)
// drawn on a shared 1500x1500 canvas, so any combination lines up.

import collection from './dummys.json';

type Pair = [string, string];
type Collection = {
    id: string;
    name: string;
    size: number;
    headClip: string;
    sideClip: string;
    base: { limbs: string; head: string };
    palettes: { skin: Record<string, Pair>; hair: Record<string, Pair>; cloth: Record<string, Pair> };
    backgrounds: Record<string, string | null>;
    parts: Record<PartKey, Record<string, string>>;
    tallHair: string[];
    coversHair?: string[];
    ink: string;
};

export type PartKey = 'outfit' | 'brows' | 'eyes' | 'mouth' | 'facial' | 'hairBack' | 'hair' | 'hat' | 'glasses';

export const DUMMYS = collection as unknown as Collection;

export type AvatarConfig = {
    skin: string;
    hair: string;
    hairColor: string;
    brows: string;
    eyes: string;
    mouth: string;
    facial: string;
    outfit: string;
    color1: string;
    color2: string;
    hat: string;
    glasses: string;
    bg: string;
};

export const DEFAULT_AVATAR: AvatarConfig = {
    skin: 'porcelain',
    hair: 'bald',
    hairColor: 'honey',
    brows: 'worried',
    eyes: 'dots',
    mouth: 'none',
    facial: 'walrus',
    outfit: 'sweater',
    color1: 'green',
    color2: 'brown',
    hat: 'none',
    glasses: 'none',
    bg: 'paper',
};

/** Field order for the share link. Appending is safe; reordering breaks old links. */
const FIELDS: { key: keyof AvatarConfig; options: () => string[] }[] = [
    { key: 'skin', options: () => Object.keys(DUMMYS.palettes.skin) },
    { key: 'hair', options: () => Object.keys(DUMMYS.parts.hair) },
    { key: 'hairColor', options: () => Object.keys(DUMMYS.palettes.hair) },
    { key: 'brows', options: () => Object.keys(DUMMYS.parts.brows) },
    { key: 'eyes', options: () => Object.keys(DUMMYS.parts.eyes) },
    { key: 'mouth', options: () => Object.keys(DUMMYS.parts.mouth) },
    { key: 'facial', options: () => Object.keys(DUMMYS.parts.facial) },
    { key: 'outfit', options: () => Object.keys(DUMMYS.parts.outfit) },
    { key: 'color1', options: () => Object.keys(DUMMYS.palettes.cloth) },
    { key: 'color2', options: () => Object.keys(DUMMYS.palettes.cloth) },
    { key: 'hat', options: () => Object.keys(DUMMYS.parts.hat) },
    { key: 'glasses', options: () => Object.keys(DUMMYS.parts.glasses) },
    { key: 'bg', options: () => Object.keys(DUMMYS.backgrounds) },
];

export function optionsFor(key: keyof AvatarConfig): string[] {
    return FIELDS.find((f) => f.key === key)!.options();
}

/** Compact, URL-safe code: one base-36 digit per field, prefixed with the collection. */
export function encodeAvatar(c: AvatarConfig): string {
    return 'd1' + FIELDS.map((f) => Math.max(0, f.options().indexOf(c[f.key])).toString(36)).join('');
}

export function decodeAvatar(code: string | null | undefined): AvatarConfig | null {
    if (!code || !code.startsWith('d1')) return null;
    const digits = code.slice(2);
    const out = { ...DEFAULT_AVATAR };
    FIELDS.forEach((f, i) => {
        const ch = digits[i];
        if (!ch) return;
        const opt = f.options()[parseInt(ch, 36)];
        if (opt) out[f.key] = opt;
    });
    return out;
}

function pick<T>(xs: T[]): T {
    return xs[Math.floor(Math.random() * xs.length)];
}

/** A random but sensible avatar: hats are rarer, and facial hair only sometimes. */
export function randomAvatar(): AvatarConfig {
    const o = (k: keyof AvatarConfig) => optionsFor(k);
    return {
        skin: pick(o('skin')),
        hair: pick(o('hair')),
        hairColor: pick(o('hairColor')),
        brows: pick(o('brows').filter((b) => b !== 'none')),
        eyes: pick(o('eyes')),
        mouth: pick(o('mouth').filter((m) => m !== 'none')),
        facial: Math.random() < 0.3 ? pick(o('facial').filter((f) => f !== 'none')) : 'none',
        outfit: pick(o('outfit')),
        color1: pick(o('color1')),
        color2: pick(o('color2')),
        hat: Math.random() < 0.25 ? pick(o('hat').filter((h) => h !== 'none')) : 'none',
        glasses: Math.random() < 0.25 ? pick(o('glasses').filter((g) => g !== 'none')) : 'none',
        bg: pick(o('bg').filter((b) => b !== 'none')),
    };
}

/** Square crops of the 1500 canvas: the whole figure, or head and shoulders for a profile picture. */
export const CROPS = {
    // Square, with headroom above the canvas: buns, curls and hats reach past y=0.
    full: '-40 -80 1580 1580',
    head: '310 -60 980 980',
} as const;
export type Crop = keyof typeof CROPS;

export function composeAvatar(c: AvatarConfig, opts: { crop?: Crop; transparent?: boolean; clipId?: string } = {}): string {
    const { parts, palettes, backgrounds } = DUMMYS;
    const [skin, skinsh] = palettes.skin[c.skin] ?? palettes.skin.porcelain;
    const [hair, hairsh] = palettes.hair[c.hairColor] ?? palettes.hair.brown;
    const [c1, c1sh] = palettes.cloth[c.color1] ?? palettes.cloth.green;
    const [c2, c2sh] = palettes.cloth[c.color2] ?? palettes.cloth.brown;
    const hatOn = c.hat !== 'none';
    // Headwear like a hijab covers the hair entirely. Other hats sit where tall
    // hair would be, so tall styles fall back to a buzz cut underneath.
    const covers = (DUMMYS.coversHair ?? []).includes(c.hat);
    const tall = hatOn && DUMMYS.tallHair.includes(c.hair);
    const hairFront = covers ? '' : tall ? 'buzz' : c.hair;
    const hairBack = covers || tall ? '' : parts.hairBack[c.hair] ?? '';
    const bg = opts.transparent ? null : backgrounds[c.bg];
    const clipId = opts.clipId ?? 'headclip';

    const body = [
        bg ? `<rect x="-200" y="-200" width="1900" height="1900" fill="${bg}"/>` : '',
        hairBack,
        DUMMYS.base.limbs,
        parts.outfit[c.outfit] ?? '',
        DUMMYS.base.head,
        parts.brows[c.brows] ?? '',
        parts.eyes[c.eyes] ?? '',
        parts.mouth[c.mouth] ?? '',
        parts.facial[c.facial] ?? '',
        parts.hair[hairFront] ?? '',
        parts.hat[c.hat] ?? '',
        (parts.glasses[c.glasses] ?? '').replace('{eyes_again}', parts.eyes[c.eyes] ?? ''),
    ]
        .join('')
        .replace(/url\(#headclip\)/g, `url(#${clipId})`)
        .replace(/url\(#sideclip\)/g, `url(#${clipId}-s)`)
        .replace(/url\(#leftclip\)/g, `url(#${clipId}-l)`);

    const colors: Record<string, string> = {
        '{skin}': skin, '{skinsh}': skinsh, '{hair}': hair, '{hairsh}': hairsh,
        '{c1}': c1, '{c1sh}': c1sh, '{c2}': c2, '{c2sh}': c2sh, '{ink}': DUMMYS.ink,
    };
    const filled = body.replace(/\{(skin|skinsh|hair|hairsh|c1|c1sh|c2|c2sh|ink)\}/g, (m) => colors[m]);

    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CROPS[opts.crop ?? 'full']}">` +
        `<defs><clipPath id="${clipId}"><path d="${DUMMYS.headClip}"/></clipPath>` +
        `<clipPath id="${clipId}-s"><path d="${DUMMYS.sideClip}"/></clipPath>` +
        `<clipPath id="${clipId}-l"><rect x="-200" y="-200" width="705" height="1900"/></clipPath></defs>${filled}</svg>`
    );
}

/** Renders the avatar to a PNG blob in the browser. */
export async function avatarPng(c: AvatarConfig, crop: Crop, transparent: boolean, size = 1080): Promise<Blob> {
    const svg = composeAvatar(c, { crop, transparent, clipId: 'exportclip' });
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try {
        const img = new Image();
        img.decoding = 'async';
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('avatar image failed to load'));
            img.src = url;
        });
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no canvas');
        ctx.drawImage(img, 0, 0, size, size);
        return await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png export failed'))), 'image/png'),
        );
    } finally {
        URL.revokeObjectURL(url);
    }
}
