"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { HeroFrameFan } from '@/components/home/HeroFrameFan';
import { track } from '@/lib/analytics';
import { useLocale } from '@/components/i18n/LocaleProvider';

function slugify(name: string, fallback: string): string {
    const base = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
    return base || fallback;
}

/**
 * Variant A, tool first. Type a name, watch the /c/ slug become yours.
 * The fan above the caption uses hero photos only, never a supporter upload.
 */
export function HomeLiveDemo() {
    const { messages } = useLocale();
    const t = messages.home;
    const [name, setName] = useState('');
    const slug = slugify(name || t.slugFallback.replace(/-/g, ' '), t.slugFallback);
    const href = name.trim()
        ? `/create?name=${encodeURIComponent(name.trim())}`
        : '/create';

    return (
        <div className="w-full">
            <HeroFrameFan label={t.exampleAlt} emptyLabel={t.fanEmptyAlt} />

            <p className="mt-3 text-center font-mono text-xs text-muted truncate">
                ollabs.studio/c/<span className="text-ink font-semibold">{slug}</span>
            </p>

            <label htmlFor="home-demo-name" className="block mt-4 font-sans text-xs font-semibold text-muted">
                {t.nameLabel}
            </label>
            <input
                id="home-demo-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                autoComplete="off"
                className="mt-1 w-full min-h-11 rounded-xl border border-ink/15 bg-cream px-3.5 font-sans text-[15px] text-ink placeholder-muted outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />

            <Link
                href={href}
                onClick={() => track('home_demo_create', { has_name: name.trim() ? 1 : 0 })}
                className="mt-3 min-h-11 w-full rounded-full bg-brand text-ink font-sans font-bold text-[15px] inline-flex items-center justify-center hover:brightness-105 active:brightness-95 transition-all"
            >
                {t.create}
            </Link>
            <p className="mt-2.5 text-center font-sans text-xs text-muted">{t.free}</p>
        </div>
    );
}
