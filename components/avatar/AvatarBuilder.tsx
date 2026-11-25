'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, Shuffle, Link2, Check, Loader2, Lock, LockOpen } from 'lucide-react';
import {
    DUMMYS, DEFAULT_AVATAR, type AvatarConfig, type Crop, type ExportKind,
    composeAvatar, optionsFor, randomAvatar, encodeAvatar, decodeAvatar, avatarExport,
} from '@/lib/avatar/compose';
import { track } from '@/lib/analytics';

// All user-facing copy in one place so the Portuguese pass is a translation, not a rebuild.
const COPY = {
    title: 'Make your Dummy',
    lede: 'A free avatar in seconds. No account, nothing on top of your picture.',
    shuffle: 'Shuffle',
    shuffleLocked: 'Shuffle the rest',
    download: 'Download PNG',
    downloading: 'Preparing…',
    profile: 'Profile picture',
    fullBody: 'Full body',
    transparent: 'Transparent background',
    copyLink: 'Copy edit link',
    copied: 'Link copied',
    linkHint: 'Save the link to come back and change your Dummy later.',
    frameCta: 'Put it in a campaign frame',
    downloaded: 'Saved. Set it as your profile picture anywhere.',
    colorsSkin: 'Skin tone',
    colorsHair: 'Hair color',
    colorsTop: 'Top color',
    colorsBottom: 'Bottom color',
    colorsPattern: 'Pattern color',
    accentColor: 'Accent color',
    shirtNumber: 'Shirt number',
    lock: 'Lock this when shuffling',
    unlock: 'Unlock',
    exportAs: 'Download as',
    exports: {
        profile: 'Profile picture',
        full: 'Full body',
        sticker: 'Sticker (512px, transparent)',
        story: 'Story (1080x1920)',
    } as Record<ExportKind, string>,
};

type ColorKey = 'skin' | 'hairColor' | 'color1' | 'color2' | 'hatColor';
type PartTabKey = Exclude<keyof AvatarConfig, 'number' | ColorKey | 'skin'> | 'bg';
type Tab = {
    id: string;
    label: string;
    part?: PartTabKey;
    crop: Crop;
    colors?: { key: ColorKey; label: string; palette: 'skin' | 'hair' | 'cloth' }[];
    /** Config keys that a lock on this tab keeps when shuffling. */
    locks: (keyof AvatarConfig)[];
};

const TABS: Tab[] = [
    { id: 'skin', label: 'Skin', crop: 'head', colors: [{ key: 'skin', label: COPY.colorsSkin, palette: 'skin' }], locks: ['skin'] },
    { id: 'hair', label: 'Hair', part: 'hair', crop: 'head', colors: [{ key: 'hairColor', label: COPY.colorsHair, palette: 'hair' }], locks: ['hair', 'hairColor'] },
    { id: 'eyes', label: 'Eyes', part: 'eyes', crop: 'head', locks: ['eyes'] },
    { id: 'brows', label: 'Brows', part: 'brows', crop: 'head', locks: ['brows'] },
    { id: 'mouth', label: 'Mouth', part: 'mouth', crop: 'head', locks: ['mouth'] },
    { id: 'details', label: 'Face', part: 'details', crop: 'head', locks: ['details'] },
    { id: 'facial', label: 'Beard', part: 'facial', crop: 'head', colors: [{ key: 'hairColor', label: COPY.colorsHair, palette: 'hair' }], locks: ['facial'] },
    { id: 'outfit', label: 'Outfit', part: 'outfit', crop: 'full', colors: [
        { key: 'color1', label: COPY.colorsTop, palette: 'cloth' },
        { key: 'color2', label: COPY.colorsBottom, palette: 'cloth' },
    ], locks: ['outfit', 'color1', 'color2', 'number'] },
    { id: 'pattern', label: 'Pattern', part: 'pattern', crop: 'full', colors: [{ key: 'color2', label: COPY.colorsPattern, palette: 'cloth' }], locks: ['pattern'] },
    { id: 'hat', label: 'Headwear', part: 'hat', crop: 'head', colors: [{ key: 'hatColor', label: COPY.accentColor, palette: 'cloth' }], locks: ['hat', 'hatColor'] },
    { id: 'glasses', label: 'Glasses', part: 'glasses', crop: 'head', locks: ['glasses'] },
    { id: 'accessory', label: 'Extras', part: 'accessory', crop: 'head', colors: [{ key: 'hatColor', label: COPY.accentColor, palette: 'cloth' }], locks: ['accessory'] },
    { id: 'prop', label: 'Holding', part: 'prop', crop: 'full', colors: [{ key: 'hatColor', label: COPY.accentColor, palette: 'cloth' }], locks: ['prop'] },
    { id: 'pet', label: 'Pet', part: 'pet', crop: 'full', locks: ['pet'] },
    { id: 'bg', label: 'Background', part: 'bg', crop: 'full', locks: ['bg'] },
];

const LABELS: Record<string, string> = {
    tee_jeans: 'Tee & jeans', tee_shorts: 'Tee & shorts', sweater: 'Sweater', onesie: 'Onesie', jersey: 'Football shirt',
    walrus: 'Walrus', pencil: 'Pencil', beard: 'Beard', goatee: 'Goatee', stubble: 'Stubble', none: 'None', bald: 'Bald', buzz: 'Buzz',
    swoop: 'Swoop', curly: 'Curly', bun: 'Bun', long: 'Long', worried: 'Worried', straight: 'Straight', cross: 'Cross',
    raised: 'Raised', angry: 'Angry', thick: 'Thick', dots: 'Dots', big: 'Big', happy: 'Happy', sleepy: 'Sleepy', wink: 'Wink',
    laugh: 'Laugh', hearts: 'Hearts', stars: 'Stars', side: 'Side eye', lashes: 'Lashes',
    smile: 'Smile', grin: 'Grin', flat: 'Flat', oh: 'Oh', smirk: 'Smirk', tongue: 'Tongue out', sad: 'Sad', teeth: 'Teeth', lipstick: 'Lipstick',
    freckles: 'Freckles', blush: 'Blush', beauty_mark: 'Beauty mark', face_paint: 'Face paint', bandaid: 'Plaster',
    cap: 'Cap', beanie: 'Beanie', santa: 'Santa', tiara: 'Carnival tiara', hijab: 'Hijab',
    bucket: 'Bucket hat', beret: 'Beret', headband: 'Headband', straw: 'Festa Junina hat', party: 'Party hat',
    flowers: 'Flower crown', headwrap: 'Headwrap', durag: 'Durag',
    round: 'Round', square: 'Square', shades: 'Shades', masquerade: 'Carnival mask',
    paper: 'Paper', cyan: 'Cyan', sage: 'Sage', sun: 'Sun', blush_bg: 'Blush', sunset: 'Sunset', ocean: 'Ocean',
    beach: 'Beach', city: 'City', stadium: 'Stadium',
    crop: 'Crop', afro: 'Afro', puffs: 'Puffs', bob: 'Bob', braids: 'Braids', dress: 'Dress',
    ponytail: 'Ponytail', locs: 'Locs', twists: 'Twists', mohawk: 'Mohawk', sidepart: 'Side part', pixie: 'Pixie',
    mullet: 'Mullet', balding: 'Balding', coily: 'Coily',
    hoodie: 'Hoodie', jacket: 'Jacket', overalls: 'Overalls', buttonup: 'Button-up', tank: 'Tank top', suit: 'Suit',
    flannel: 'Flannel', scrubs: 'Scrubs', chef: 'Chef',
    stripes: 'Stripes', plaid: 'Plaid',
    studs: 'Studs', hoops: 'Hoops', necklace: 'Necklace', chain: 'Chain', headphones: 'Headphones', hearing_aid: 'Hearing aid', bandana: 'Bandana',
    phone: 'Phone', coffee: 'Coffee', ball: 'Football', flag: 'Flag', sign: 'Sign', guitar: 'Guitar', balloon: 'Balloon',
    dog: 'Dog', cat: 'Cat',
};
const label = (k: string) => LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ');

const STORE_KEY = 'ollabs_avatar';

function Art({ config, crop, clipId, className }: { config: AvatarConfig; crop: Crop; clipId: string; className?: string }) {
    // Our own static art from lib/avatar/dummys.json; the only user value is the clamped shirt number.
    const html = useMemo(() => composeAvatar(config, { crop, clipId }), [config, crop, clipId]);
    return <span aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AvatarBuilder() {
    const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
    const [tab, setTab] = useState('hair');
    const [crop, setCrop] = useState<Crop>('head');
    const [exportKind, setExportKind] = useState<ExportKind>('profile');
    const [transparent, setTransparent] = useState(false);
    const [locked, setLocked] = useState<Set<string>>(new Set());
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const [copied, setCopied] = useState(false);

    // Restore from the edit link first, then from this browser.
    useEffect(() => {
        const fromUrl = decodeAvatar(new URLSearchParams(window.location.search).get('d'));
        let fromStore: AvatarConfig | null = null;
        try { fromStore = decodeAvatar(localStorage.getItem(STORE_KEY)); } catch { /* storage can be off in in-app browsers */ }
        const start = fromUrl ?? fromStore;
        if (start) setConfig(start);
    }, []);

    // Keep the address bar and storage in step, so a refresh or a copied URL keeps the avatar.
    useEffect(() => {
        const code = encodeAvatar(config);
        try { localStorage.setItem(STORE_KEY, code); } catch { /* ignore */ }
        const url = new URL(window.location.href);
        url.searchParams.set('d', code);
        window.history.replaceState(null, '', url.toString());
    }, [config]);

    const set = useCallback((key: keyof AvatarConfig, value: string) => {
        setConfig((c) => ({ ...c, [key]: value }));
        setDone(false);
    }, []);

    const active = TABS.find((t) => t.id === tab)!;
    const toggleLock = (id: string) => setLocked((s) => {
        const n = new Set(s);
        if (n.has(id)) n.delete(id); else n.add(id);
        return n;
    });

    const shuffle = () => {
        const keep = TABS.filter((t) => locked.has(t.id)).flatMap((t) => t.locks);
        setConfig((c) => randomAvatar(c, keep));
        setDone(false);
        track('avatar_shuffle', { locked: locked.size });
    };

    const download = async () => {
        setBusy(true);
        try {
            const blob = await avatarExport(config, exportKind, transparent);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `ollabs-dummy-${exportKind}-${encodeAvatar(config)}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
            setDone(true);
            track('avatar_download', { collection: DUMMYS.id, kind: exportKind, transparent });
        } catch (e) {
            console.error('[avatar] export failed', e);
        } finally {
            setBusy(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            track('avatar_copy_link', { collection: DUMMYS.id });
        } catch { /* the URL is still in the address bar */ }
    };

    const chip = (on: boolean) =>
        `shrink-0 min-h-11 px-4 rounded-full text-sm font-semibold transition-colors ${on ? 'bg-ink text-paper' : 'bg-cream text-ink border border-ink/10 hover:bg-ink/5'}`;

    const options = active.part === 'bg' ? Object.keys(DUMMYS.backgrounds) : active.part ? optionsFor(active.part) : [];

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-10 items-start">
            {/* Preview and actions */}
            <section aria-label="Your avatar" className="lg:sticky lg:top-24 space-y-4">
                <div className="rounded-3xl overflow-hidden border border-ink/10 bg-cream aspect-square max-w-[420px] mx-auto w-full">
                    <Art config={config} crop={crop} clipId="previewclip" className="block w-full h-full [&>svg]:w-full [&>svg]:h-full" />
                </div>
                <div role="group" aria-label="Crop" className="flex gap-2 justify-center">
                    <button type="button" onClick={() => setCrop('head')} className={chip(crop === 'head')} aria-pressed={crop === 'head'}>{COPY.profile}</button>
                    <button type="button" onClick={() => setCrop('full')} className={chip(crop === 'full')} aria-pressed={crop === 'full'}>{COPY.fullBody}</button>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={shuffle}
                        className="min-h-12 px-5 rounded-xl border border-ink/15 bg-cream font-semibold text-ink flex items-center gap-2 hover:bg-ink/5">
                        <Shuffle size={18} /> {locked.size ? COPY.shuffleLocked : COPY.shuffle}
                    </button>
                    <button type="button" onClick={download} disabled={busy}
                        className="flex-1 min-h-12 rounded-xl bg-ink text-paper font-semibold flex items-center justify-center gap-2 hover:bg-ink/90 disabled:opacity-60">
                        {busy ? <><Loader2 size={18} className="animate-spin" /> {COPY.downloading}</> : <><Download size={18} /> {COPY.download}</>}
                    </button>
                </div>
                <label className="flex items-center justify-between gap-3 text-sm text-ink/80 min-h-11">
                    <span className="font-semibold">{COPY.exportAs}</span>
                    <select value={exportKind} onChange={(e) => setExportKind(e.target.value as ExportKind)}
                        className="min-h-11 rounded-xl border border-ink/15 bg-cream px-3 text-ink">
                        {(Object.keys(COPY.exports) as ExportKind[]).map((k) => <option key={k} value={k}>{COPY.exports[k]}</option>)}
                    </select>
                </label>
                {exportKind !== 'sticker' && (
                    <label className="flex items-center gap-2 text-sm text-ink/80 min-h-11">
                        <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5 accent-[#026D94]" />
                        {COPY.transparent}
                    </label>
                )}
                {done && (
                    <div role="status" className="rounded-2xl bg-brand-wash p-4 space-y-2">
                        <p className="text-sm font-semibold text-ink">{COPY.downloaded}</p>
                        <Link href="/create" onClick={() => track('avatar_to_frame')} className="text-sm font-semibold text-brand-deep hover:underline">{COPY.frameCta}</Link>
                    </div>
                )}
                <div className="space-y-1">
                    <button type="button" onClick={copyLink} className="min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-brand-deep hover:underline">
                        {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? COPY.copied : COPY.copyLink}
                    </button>
                    <p className="text-xs text-muted">{COPY.linkHint}</p>
                </div>
            </section>

            {/* Pickers */}
            <section aria-label="Customize" className="space-y-5 min-w-0">
                <div role="tablist" aria-label="Parts" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {TABS.map((t) => (
                        <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`${chip(tab === t.id)} inline-flex items-center gap-1.5`}>
                            {locked.has(t.id) && <Lock size={13} aria-label="locked" />}
                            {t.label}
                        </button>
                    ))}
                </div>

                <button type="button" onClick={() => toggleLock(active.id)} aria-pressed={locked.has(active.id)}
                    className="min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-ink/80 hover:text-ink">
                    {locked.has(active.id) ? <Lock size={16} /> : <LockOpen size={16} />}
                    {locked.has(active.id) ? COPY.unlock : COPY.lock}
                </button>

                {active.colors?.map((cg) => (
                    <div key={cg.key + active.id} className="space-y-2">
                        <h2 className="text-sm font-semibold text-muted">{cg.label}</h2>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(DUMMYS.palettes[cg.palette]).map(([name, [hex]]) => {
                                const on = config[cg.key] === name;
                                return (
                                    <button key={name} type="button" aria-label={label(name)} aria-pressed={on} onClick={() => set(cg.key, name)}
                                        className={`h-11 w-11 rounded-full border-2 ${on ? 'border-ink ring-2 ring-brand ring-offset-2 ring-offset-paper' : 'border-ink/10'}`}
                                        style={{ backgroundColor: hex }} />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {active.id === 'outfit' && config.outfit === 'jersey' && (
                    <label className="flex items-center gap-3 text-sm font-semibold text-muted">
                        {COPY.shirtNumber}
                        <input type="number" inputMode="numeric" min={0} max={99} value={config.number}
                            onChange={(e) => set('number', e.target.value.replace(/\D/g, '').slice(0, 2) || '0')}
                            className="w-20 min-h-11 rounded-xl border border-ink/15 bg-cream px-3 text-ink text-base" />
                    </label>
                )}

                {active.part && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3">
                        {options.map((opt) => {
                            const on = config[active.part!] === opt;
                            const preview = { ...config, [active.part!]: opt } as AvatarConfig;
                            return (
                                <button key={opt} type="button" aria-pressed={on} onClick={() => set(active.part!, opt)}
                                    className={`rounded-2xl p-1.5 text-left transition-colors ${on ? 'bg-brand-wash ring-2 ring-ink' : 'bg-cream border border-ink/10 hover:border-ink/30'}`}>
                                    <Art config={preview} crop={active.crop} clipId={`t-${active.id}-${opt}`} className="block aspect-square rounded-xl overflow-hidden [&>svg]:w-full [&>svg]:h-full" />
                                    <span className="block px-1 pt-1.5 pb-0.5 text-xs font-semibold text-ink truncate">{label(opt)}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
