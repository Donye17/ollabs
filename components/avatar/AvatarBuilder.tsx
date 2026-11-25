'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, Shuffle, Link2, Check, Loader2 } from 'lucide-react';
import {
    DUMMYS, DEFAULT_AVATAR, type AvatarConfig, type Crop,
    composeAvatar, optionsFor, randomAvatar, encodeAvatar, decodeAvatar, avatarPng,
} from '@/lib/avatar/compose';
import { track } from '@/lib/analytics';

// All user-facing copy in one place so the Portuguese pass is a translation, not a rebuild.
const COPY = {
    title: 'Make your Dummy',
    lede: 'A free avatar in seconds. No account, nothing on top of your picture.',
    shuffle: 'Shuffle',
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
    headwearColor: 'Hijab and cap color',
};

type Tab = { id: string; label: string; part?: keyof AvatarConfig; crop: Crop; colors?: { key: keyof AvatarConfig; label: string; palette: 'skin' | 'hair' | 'cloth' }[] };

const TABS: Tab[] = [
    { id: 'skin', label: 'Skin', crop: 'head', colors: [{ key: 'skin', label: COPY.colorsSkin, palette: 'skin' }] },
    { id: 'hair', label: 'Hair', part: 'hair', crop: 'head', colors: [{ key: 'hairColor', label: COPY.colorsHair, palette: 'hair' }] },
    { id: 'eyes', label: 'Eyes', part: 'eyes', crop: 'head' },
    { id: 'brows', label: 'Brows', part: 'brows', crop: 'head' },
    { id: 'mouth', label: 'Mouth', part: 'mouth', crop: 'head' },
    { id: 'facial', label: 'Beard', part: 'facial', crop: 'head', colors: [{ key: 'hairColor', label: COPY.colorsHair, palette: 'hair' }] },
    { id: 'outfit', label: 'Outfit', part: 'outfit', crop: 'full', colors: [
        { key: 'color1', label: COPY.colorsTop, palette: 'cloth' },
        { key: 'color2', label: COPY.colorsBottom, palette: 'cloth' },
    ] },
    { id: 'hat', label: 'Headwear', part: 'hat', crop: 'head', colors: [{ key: 'color1', label: COPY.headwearColor, palette: 'cloth' }] },
    { id: 'glasses', label: 'Glasses', part: 'glasses', crop: 'head' },
    { id: 'bg', label: 'Background', part: 'bg', crop: 'full' },
];

const LABELS: Record<string, string> = {
    tee_jeans: 'Tee & jeans', tee_shorts: 'Tee & shorts', sweater: 'Sweater', onesie: 'Onesie', jersey: 'Football shirt',
    walrus: 'Walrus', pencil: 'Pencil', beard: 'Beard', goatee: 'Goatee', none: 'None', bald: 'Bald', buzz: 'Buzz',
    swoop: 'Swoop', curly: 'Curly', bun: 'Bun', long: 'Long', worried: 'Worried', straight: 'Straight', cross: 'Cross',
    raised: 'Raised', dots: 'Dots', big: 'Big', happy: 'Happy', sleepy: 'Sleepy', wink: 'Wink', smile: 'Smile',
    grin: 'Grin', flat: 'Flat', oh: 'Oh', smirk: 'Smirk', cap: 'Cap', beanie: 'Beanie', santa: 'Santa', tiara: 'Carnival tiara',
    round: 'Round', square: 'Square', shades: 'Shades', masquerade: 'Carnival mask',
    paper: 'Paper', cyan: 'Cyan', sage: 'Sage', sun: 'Sun', blush: 'Blush',
    crop: 'Crop', afro: 'Afro', puffs: 'Puffs', bob: 'Bob', braids: 'Braids', hijab: 'Hijab', dress: 'Dress',
};
const label = (k: string) => LABELS[k] ?? k.charAt(0).toUpperCase() + k.slice(1);

const STORE_KEY = 'ollabs_avatar';

function Art({ config, crop, clipId, className }: { config: AvatarConfig; crop: Crop; clipId: string; className?: string }) {
    // Our own static art from lib/avatar/dummys.json; no user input reaches this markup.
    const html = useMemo(() => composeAvatar(config, { crop, clipId }), [config, crop, clipId]);
    return <span aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AvatarBuilder() {
    const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
    const [tab, setTab] = useState('hair');
    const [crop, setCrop] = useState<Crop>('head');
    const [transparent, setTransparent] = useState(false);
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

    const download = async () => {
        setBusy(true);
        try {
            const blob = await avatarPng(config, crop, transparent);
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `ollabs-dummy-${encodeAvatar(config)}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
            setDone(true);
            track('avatar_download', { collection: DUMMYS.id, crop, transparent });
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
                    <button type="button" onClick={() => { setConfig(randomAvatar()); setDone(false); track('avatar_shuffle'); }}
                        className="min-h-12 px-5 rounded-xl border border-ink/15 bg-cream font-semibold text-ink flex items-center gap-2 hover:bg-ink/5">
                        <Shuffle size={18} /> {COPY.shuffle}
                    </button>
                    <button type="button" onClick={download} disabled={busy}
                        className="flex-1 min-h-12 rounded-xl bg-ink text-paper font-semibold flex items-center justify-center gap-2 hover:bg-ink/90 disabled:opacity-60">
                        {busy ? <><Loader2 size={18} className="animate-spin" /> {COPY.downloading}</> : <><Download size={18} /> {COPY.download}</>}
                    </button>
                </div>
                <label className="flex items-center gap-2 text-sm text-ink/80 min-h-11">
                    <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="h-5 w-5 accent-[#026D94]" />
                    {COPY.transparent}
                </label>
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
                        <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={chip(tab === t.id)}>
                            {t.label}
                        </button>
                    ))}
                </div>

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

                {active.part && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3">
                        {optionsFor(active.part).map((opt) => {
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
