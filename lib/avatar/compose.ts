// Composes a Dummys avatar into one SVG string.
//
// The art lives in lib/avatar/dummys.json, generated from tools/avatar/dummys.
// Each part is an SVG fragment with color placeholders ({skin}, {hair}, {c1}...)
// drawn on a shared 1500x1500 canvas, so any combination lines up.
// The layer order is data too (collection.layers), so new slots need no code here.

import collection from './dummys.json';

type Pair = [string, string];
type Collection = {
    id: string;
    name: string;
    size: number;
    headClip: string;
    sideClip: string;
    base: Record<string, string>;
    palettes: { skin: Record<string, Pair>; hair: Record<string, Pair>; cloth: Record<string, Pair> };
    backgrounds: Record<string, string | null>;
    parts: Record<PartKey, Record<string, string>>;
    layers: string[];
    tops: Record<string, [string, string]>;
    tallHair: string[];
    coversHair?: string[];
    hatKeepsHair?: string[];
    ink: string;
};

export type PartKey =
    | 'outfit' | 'brows' | 'eyes' | 'mouth' | 'facial' | 'hairBack' | 'hair' | 'hat' | 'glasses'
    | 'details' | 'pattern' | 'accessory' | 'prop' | 'pet';

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
    hatColor: string;
    details: string;
    pattern: string;
    accessory: string;
    prop: string;
    pet: string;
    /** Shirt number on the football shirt, 0 to 99. */
    number: string;
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
    hatColor: 'red',
    details: 'none',
    pattern: 'none',
    accessory: 'none',
    prop: 'none',
    pet: 'none',
    number: '10',
};

type OptionKey = Exclude<keyof AvatarConfig, 'number'>;

/** Field order for the share link. Appending is safe; reordering breaks old links. */
const FIELDS: { key: OptionKey; options: () => string[] }[] = [
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
    { key: 'hatColor', options: () => Object.keys(DUMMYS.palettes.cloth) },
    // second batch
    { key: 'details', options: () => Object.keys(DUMMYS.parts.details) },
    { key: 'pattern', options: () => Object.keys(DUMMYS.parts.pattern) },
    { key: 'accessory', options: () => Object.keys(DUMMYS.parts.accessory) },
    { key: 'prop', options: () => Object.keys(DUMMYS.parts.prop) },
    { key: 'pet', options: () => Object.keys(DUMMYS.parts.pet) },
];

export function optionsFor(key: OptionKey): string[] {
    return FIELDS.find((f) => f.key === key)!.options();
}

function clampNumber(n: string): string {
    const v = parseInt(n, 10);
    return Number.isFinite(v) ? String(Math.min(99, Math.max(0, v))) : '10';
}

/**
 * Share code, version 2: 'd2', the shirt number as two digits, then two base-36 digits
 * per field (up to 1296 options each). Version-1 codes ('d1', one digit per field) still decode.
 */
export function encodeAvatar(c: AvatarConfig): string {
    const num = clampNumber(c.number).padStart(2, '0');
    return 'd2' + num + FIELDS.map((f) => Math.max(0, f.options().indexOf(c[f.key])).toString(36).padStart(2, '0')).join('');
}

export function decodeAvatar(code: string | null | undefined): AvatarConfig | null {
    if (!code) return null;
    const out = { ...DEFAULT_AVATAR };
    let width: number;
    let digits: string;
    if (code.startsWith('d2')) {
        if (!/^\d\d$/.test(code.slice(2, 4))) return null;
        out.number = String(parseInt(code.slice(2, 4), 10));
        digits = code.slice(4);
        width = 2;
    } else if (code.startsWith('d1')) {
        digits = code.slice(2);
        width = 1;
    } else {
        return null;
    }
    FIELDS.forEach((f, i) => {
        const chunk = digits.slice(i * width, i * width + width);
        if (chunk.length !== width) return;
        const opt = f.options()[parseInt(chunk, 36)];
        if (opt) out[f.key] = opt;
    });
    return out;
}

function pick<T>(xs: T[]): T {
    return xs[Math.floor(Math.random() * xs.length)];
}

function sometimes(key: OptionKey, chance: number): string {
    return Math.random() < chance ? pick(optionsFor(key).filter((v) => v !== 'none')) : 'none';
}

/**
 * A random but sensible avatar. Keys in `keep` are copied from `from` instead
 * (lock and shuffle). Hats, props and pets are rarer than faces.
 */
export function randomAvatar(from: AvatarConfig = DEFAULT_AVATAR, keep: Iterable<keyof AvatarConfig> = []): AvatarConfig {
    const o = (k: OptionKey) => optionsFor(k);
    const fresh: AvatarConfig = {
        skin: pick(o('skin')),
        hair: pick(o('hair')),
        hairColor: pick(o('hairColor')),
        brows: pick(o('brows').filter((b) => b !== 'none')),
        eyes: pick(o('eyes')),
        mouth: pick(o('mouth').filter((m) => m !== 'none')),
        facial: sometimes('facial', 0.3),
        outfit: pick(o('outfit')),
        color1: pick(o('color1')),
        color2: pick(o('color2')),
        hat: sometimes('hat', 0.25),
        glasses: sometimes('glasses', 0.25),
        bg: pick(o('bg').filter((b) => b !== 'none')),
        hatColor: pick(o('hatColor')),
        details: sometimes('details', 0.3),
        pattern: sometimes('pattern', 0.2),
        accessory: sometimes('accessory', 0.3),
        prop: sometimes('prop', 0.15),
        pet: sometimes('pet', 0.15),
        number: String(1 + Math.floor(Math.random() * 99)),
    };
    for (const k of keep) (fresh[k] as string) = from[k];
    return fresh;
}

/** Square crops of the 1500 canvas: the whole figure, or head and shoulders for a profile picture. */
export const CROPS = {
    // Square, with headroom above the canvas: buns, curls and hats reach past y=0.
    full: '-40 -80 1580 1580',
    head: '310 -60 980 980',
} as const;
export type Crop = keyof typeof CROPS;

const SPLIT = '<!--L-->';
const PLACEHOLDER = /\{(skin|skinsh|hair|hairsh|c1|c1sh|c2|c2sh|c3|c3sh|ink)\}/g;

export function composeAvatar(c: AvatarConfig, opts: { crop?: Crop; transparent?: boolean; clipId?: string; size?: number } = {}): string {
    const { parts, palettes, backgrounds } = DUMMYS;
    const [skin, skinsh] = palettes.skin[c.skin] ?? palettes.skin.porcelain;
    const [hair, hairsh] = palettes.hair[c.hairColor] ?? palettes.hair.brown;
    const [c1, c1sh] = palettes.cloth[c.color1] ?? palettes.cloth.green;
    const [c2, c2sh] = palettes.cloth[c.color2] ?? palettes.cloth.brown;
    const [c3, c3sh] = palettes.cloth[c.hatColor] ?? palettes.cloth.red;
    // Headwear like a hijab covers the hair entirely. Most other hats sit where tall
    // hair would be, so tall styles fall back to a buzz cut underneath; headbands
    // and flower crowns sit at the hairline and keep the hair as it is.
    const hatOn = c.hat !== 'none' && !(DUMMYS.hatKeepsHair ?? []).includes(c.hat);
    const covers = (DUMMYS.coversHair ?? []).includes(c.hat);
    const tall = hatOn && DUMMYS.tallHair.includes(c.hair);
    const hairFront = covers ? '' : tall ? 'buzz' : c.hair;
    const clipId = opts.clipId ?? 'headclip';
    const value = (name: string) => (c as unknown as Record<string, string>)[name] ?? 'none';

    const layers = DUMMYS.layers.map((tok) => {
        if (tok === 'bg') {
            const bg = opts.transparent ? null : backgrounds[c.bg];
            if (!bg) return '';
            return bg.startsWith('<') ? bg : `<rect x="-200" y="-200" width="1900" height="1900" fill="${bg}"/>`;
        }
        if (tok.startsWith('base.')) return DUMMYS.base[tok.slice(5)] ?? '';
        if (tok === 'hairBack') return covers || tall ? '' : parts.hairBack[c.hair] ?? '';
        if (tok === 'hair') return parts.hair[hairFront] ?? '';
        if (tok === 'pattern') {
            const pat = parts.pattern[c.pattern] ?? '';
            const top = DUMMYS.tops[c.outfit];
            return pat && top ? `<g clip-path="url(#topclip)">${pat}<path d="${top[1]}" fill="#000" opacity="0.16"/></g>` : '';
        }
        const [name, seg] = tok.split('@');
        let frag = parts[name as PartKey]?.[value(name)] ?? '';
        if (seg !== undefined) frag = frag.split(SPLIT)[Number(seg)] ?? '';
        if (name === 'glasses') frag = frag.replace('{eyes_again}', parts.eyes[c.eyes] ?? '');
        return frag;
    });

    const colors: Record<string, string> = {
        '{skin}': skin, '{skinsh}': skinsh, '{hair}': hair, '{hairsh}': hairsh,
        '{c1}': c1, '{c1sh}': c1sh, '{c2}': c2, '{c2sh}': c2sh, '{c3}': c3, '{c3sh}': c3sh, '{ink}': DUMMYS.ink,
    };
    const filled = layers
        .join('')
        .replace(/\{num\}/g, clampNumber(c.number))
        .replace(/url\(#headclip\)/g, `url(#${clipId})`)
        .replace(/url\(#sideclip\)/g, `url(#${clipId}-s)`)
        .replace(/url\(#leftclip\)/g, `url(#${clipId}-l)`)
        .replace(/url\(#topclip\)/g, `url(#${clipId}-t)`)
        .replace(PLACEHOLDER, (m) => colors[m]);

    const top = DUMMYS.tops[c.outfit]?.[0] ?? '';
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${CROPS[opts.crop ?? 'full']}"` +
        (opts.size ? ` width="${opts.size}" height="${opts.size}">` : '>') +
        `<defs><clipPath id="${clipId}"><path d="${DUMMYS.headClip}"/></clipPath>` +
        `<clipPath id="${clipId}-s"><path d="${DUMMYS.sideClip}"/></clipPath>` +
        `<clipPath id="${clipId}-l"><rect x="-200" y="-200" width="705" height="1900"/></clipPath>` +
        `<clipPath id="${clipId}-t"><path d="${top}"/></clipPath></defs>${filled}</svg>`
    );
}

/** Export presets: what each one is for, its size and how the avatar sits in it. */
export const EXPORTS = {
    profile: { crop: 'head' as Crop, w: 1080, h: 1080 },
    full: { crop: 'full' as Crop, w: 1080, h: 1080 },
    // WhatsApp stickers are 512x512 with a transparent background.
    sticker: { crop: 'head' as Crop, w: 512, h: 512, transparent: true },
    // Instagram and WhatsApp stories.
    story: { crop: 'full' as Crop, w: 1080, h: 1920 },
} as const;
export type ExportKind = keyof typeof EXPORTS;

async function svgImage(svg: string): Promise<HTMLImageElement> {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try {
        const img = new Image();
        img.decoding = 'async';
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('avatar image failed to load'));
            img.src = url;
        });
        return img;
    } finally {
        // The decoded image keeps its pixels after the URL is revoked.
        setTimeout(() => URL.revokeObjectURL(url), 0);
    }
}

/** Renders the avatar to a PNG blob in the browser for one of the export presets. */
export async function avatarExport(c: AvatarConfig, kind: ExportKind, transparent = false): Promise<Blob> {
    const preset = EXPORTS[kind];
    const clear = transparent || ('transparent' in preset && preset.transparent);
    const canvas = document.createElement('canvas');
    canvas.width = preset.w;
    canvas.height = preset.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    const img = await svgImage(composeAvatar(c, { crop: preset.crop, transparent: clear, clipId: 'exportclip', size: preset.w }));
    const y = (preset.h - preset.w) / 2;
    if (y > 0 && !clear) {
        // Tall formats: stretch the background's top and bottom rows to fill above and below the square.
        ctx.drawImage(img, 0, 0, preset.w, 1, 0, 0, preset.w, y + 1);
        ctx.drawImage(img, 0, preset.w - 1, preset.w, 1, 0, y + preset.w - 1, preset.w, y + 1);
    }
    ctx.drawImage(img, 0, y, preset.w, preset.w);
    return await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png export failed'))), 'image/png'),
    );
}

/** Kept for existing callers: square PNG of a crop. */
export async function avatarPng(c: AvatarConfig, crop: Crop, transparent: boolean, size = 1080): Promise<Blob> {
    void size;
    return avatarExport(c, crop === 'head' ? 'profile' : 'full', transparent);
}
