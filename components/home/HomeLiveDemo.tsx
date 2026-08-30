"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { track } from '@/lib/analytics';

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
 * Variant A, tool first. Type a name, watch the /c/ slug become yours.
 * No colour rings, no grey card, no second CTA. Neutral silhouette, not a
 * real supporter photo (those were uploaded for one campaign, not marketing).
 */
export function HomeLiveDemo() {
    const [name, setName] = useState('');
    const slug = slugify(name || 'sua campanha');
    const href = name.trim()
        ? `/create?name=${encodeURIComponent(name.trim())}`
        : '/create';

    return (
        <div className="w-full">
            <div
                role="img"
                aria-label="Exemplo de foto de perfil com moldura"
                className="mx-auto rounded-full bg-brand p-[7px] frame-shadow"
                style={{ width: 150, height: 150 }}
            >
                <div className="w-full h-full rounded-full bg-cream overflow-hidden grid place-items-center" aria-hidden>
                    <svg
                        viewBox="0 0 24 24"
                        className="w-[78%] h-[78%] mt-[14%] fill-muted"
                    >
                        <circle cx="12" cy="8" r="4.2" />
                        <path d="M3.5 24c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z" />
                    </svg>
                </div>
            </div>

            <p className="mt-3 text-center font-mono text-xs text-muted truncate">
                ollabs.studio/c/<span className="text-ink font-semibold">{slug}</span>
            </p>

            <label htmlFor="home-demo-name" className="block mt-3.5 text-xs font-semibold text-muted">
                Nome da sua campanha
            </label>
            <input
                id="home-demo-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sua causa, time ou candidato"
                autoComplete="off"
                className="mt-1 w-full min-h-11 rounded-xl border border-ink/15 bg-cream px-3.5 text-sm text-ink placeholder-muted outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />

            <Link
                href={href}
                onClick={() => track('home_demo_create', { has_name: name.trim() ? 1 : 0 })}
                className="mt-3.5 min-h-11 w-full rounded-full bg-brand text-ink font-bold text-[15px] inline-flex items-center justify-center hover:brightness-105 active:brightness-95 transition-all"
            >
                Criar campanha
            </Link>
            <p className="mt-2.5 text-center text-xs text-muted">Grátis. Sem conta.</p>
        </div>
    );
}
