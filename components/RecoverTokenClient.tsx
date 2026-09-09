"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BarChart3, ExternalLink, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { ORGANIZER_PRIMARY_BTN } from '@/lib/mobileNav';

type CampaignRow = {
    slug: string;
    title: string;
    owner_token: string;
    supporter_count: number;
    created_at: string;
};

/**
 * Confirm-then-redeem. The mailed URL is a GET; scanners fetch that. The
 * dashboard keys only leave the server after a real tap on this button.
 */
export function RecoverTokenClient({ token }: { token: string }) {
    const [state, setState] = useState<'confirm' | 'loading' | 'ok' | 'expired'>('confirm');
    const [rows, setRows] = useState<CampaignRow[]>([]);
    const [error, setError] = useState<string | null>(null);

    const redeem = async () => {
        if (state === 'loading') return;
        setError(null);
        setState('loading');
        try {
            const res = await fetch('/api/recover/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data?.ok || !Array.isArray(data.campaigns)) {
                setState('expired');
                return;
            }
            setRows(data.campaigns);
            setState('ok');
        } catch {
            setError('Could not reach the server. Check your connection and try again.');
            setState('confirm');
        }
    };

    if (state === 'expired') {
        return (
            <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
                <AlertCircle className="w-8 h-8 text-muted mx-auto mb-3" />
                <p className="text-sm text-ink/70 mb-6">
                    Request a fresh link and we will email it straight over.
                </p>
                <Link
                    href="/recover"
                    className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all"
                >
                    Send a new link
                </Link>
            </div>
        );
    }

    if (state === 'ok') {
        if (rows.length === 0) {
            return (
                <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
                    <p className="text-sm text-ink/70">
                        No campaigns are attached to this email anymore.
                    </p>
                </div>
            );
        }
        return (
            <div className="space-y-3">
                {rows.map((c) => (
                    <div
                        key={c.slug}
                        className="bg-cream border border-ink/10 rounded-2xl p-4 flex items-center gap-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="font-display font-bold truncate">{c.title}</p>
                            <p className="text-xs text-muted truncate">
                                ollabs.studio/c/{c.slug} · {c.supporter_count.toLocaleString()} supporter
                                {c.supporter_count === 1 ? '' : 's'}
                            </p>
                        </div>
                        <Link
                            href={`/c/${c.slug}`}
                            className="h-10 w-10 rounded-xl border border-ink/15 flex items-center justify-center hover:bg-paper transition-colors"
                            title="Open campaign"
                        >
                            <ExternalLink size={16} />
                        </Link>
                        <Link
                            href={`/c/${c.slug}/manage?k=${c.owner_token}`}
                            className="h-10 px-4 rounded-xl bg-brand text-ink font-bold text-sm flex items-center gap-2 hover:brightness-105 transition-all"
                        >
                            <BarChart3 size={16} />
                            Dashboard
                        </Link>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
            <KeyRound className="w-8 h-8 text-brand-deep mx-auto mb-3" />
            <p className="text-sm text-ink/70 mb-6">
                This opens the private dashboard links for every campaign on this email.
                Email apps often load the page before you tap, so nothing is unlocked until you confirm.
            </p>
            {error && (
                <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5 mb-4 text-left">
                    {error}
                </p>
            )}
            <button
                type="button"
                onClick={redeem}
                disabled={state === 'loading'}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 ${ORGANIZER_PRIMARY_BTN}`}
            >
                {state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                {state === 'loading' ? 'Opening' : 'Open my campaigns'}
            </button>
        </div>
    );
}
