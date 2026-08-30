"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';

const RINGS = [
    { id: 'brand', className: 'ring-brand' },
    { id: 'ink', className: 'ring-ink' },
    { id: 'coral', className: 'ring-coral' },
    { id: 'muted', className: 'ring-muted' },
] as const;

function slugify(name: string): string {
    const base = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
    return base || 'sua-campanha';
}

/**
 * Homepage sales device: type a name, see a live /c/{slug} preview, pick a
 * ring colour, carry the name into /create. Competitor WhatsArt does this in
 * vanilla JS with invented counts. We have a real framed face to drop in.
 */
export function HomeLiveDemo({
    faceUrl,
    supporterCount,
}: {
    faceUrl: string;
    supporterCount: number;
}) {
    const [name, setName] = useState('');
    const [ring, setRing] = useState<(typeof RINGS)[number]['id']>('brand');
    const slug = slugify(name || 'sua campanha');
    const ringClass = RINGS.find((r) => r.id === ring)?.className ?? 'ring-brand';
    const cta = useMemo(() => {
        const trimmed = name.trim();
        if (!trimmed) return 'Create a campaign';
        return `Create ${trimmed}'s frame`;
    }, [name]);

    return (
        <div className="w-full max-w-sm mx-auto lg:mx-0 lg:max-w-none">
            <div className="rounded-2xl border border-ink/10 bg-cream p-4 sm:p-5">
                <p className="text-[11px] font-semibold text-muted tabular-nums mb-2 truncate">
                    ollabs.studio/c/{slug}
                </p>
                <div className="flex justify-center mb-4">
                    <div className={`rounded-full overflow-hidden ring-[10px] ${ringClass} frame-shadow`} style={{ width: 168, height: 168 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={faceUrl}
                            alt="Framed profile photo from a live campaign"
                            width={168}
                            height={168}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <label className="block text-xs font-semibold text-muted mb-1" htmlFor="home-demo-name">
                    Campaign name
                </label>
                <input
                    id="home-demo-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your cause, team, or candidate"
                    className="w-full min-h-[44px] rounded-xl border border-ink/15 bg-paper px-3 text-sm text-ink placeholder-muted outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
                <p className="text-xs text-muted mt-2 tabular-nums">
                    {supporterCount.toLocaleString()} people already using a frame like this
                </p>
                <div className="flex items-center gap-2 mt-3" role="radiogroup" aria-label="Frame colour">
                    {RINGS.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            role="radio"
                            aria-checked={ring === r.id}
                            aria-label={r.id}
                            onClick={() => setRing(r.id)}
                            className={`h-11 w-11 rounded-full ring-4 ${r.className} bg-paper ${
                                ring === r.id ? 'ring-offset-2 ring-offset-cream' : 'opacity-70'
                            }`}
                        />
                    ))}
                </div>
                <Link
                    href={`/create?name=${encodeURIComponent(name.trim())}`}
                    onClick={() => track('home_demo_create', { has_name: name.trim() ? 1 : 0 })}
                    className="mt-4 min-h-[48px] w-full rounded-xl bg-ink text-paper font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-ink/90"
                >
                    {cta}
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
