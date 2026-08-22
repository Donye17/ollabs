"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Pencil, Trash2, Inbox, LogIn, LogOut, Loader2, Users } from 'lucide-react';

interface SavedCampaign {
    slug: string;
    title: string;
    url: string;
    manageUrl: string | null;
    createdAt: number;
}

interface AccountCampaign {
    slug: string;
    title: string;
    owner_token: string;
    supporter_count: number | null;
    view_count: number | null;
    created_at: string;
}

interface Row {
    slug: string;
    title: string;
    url: string;
    manageUrl: string | null;
    supporters: number | null;
    /** Present only for rows that live in this browser but not on the account. */
    localCreatedAt?: number;
}

const LOCAL_KEY = 'ollabs_my_campaigns';

export const MyCampaignsClient: React.FC = () => {
    const [local, setLocal] = useState<SavedCampaign[]>([]);
    const [account, setAccount] = useState<AccountCampaign[] | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    const loadAccount = useCallback(async () => {
        try {
            const res = await fetch('/api/organizer/campaigns');
            if (res.status === 401) {
                setAccount(null);
                setEmail(null);
                return;
            }
            const data = await res.json().catch(() => ({}));
            setAccount(Array.isArray(data?.campaigns) ? data.campaigns : []);
            setEmail(typeof data?.email === 'string' ? data.email : null);
        } catch {
            setAccount(null);
        }
    }, []);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
            if (Array.isArray(list)) setLocal(list);
        } catch { /* ignore */ }
        loadAccount().finally(() => setLoaded(true));
    }, [loadAccount]);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ollabs.studio';
    const signedIn = account !== null;

    const accountRows: Row[] = useMemo(
        () =>
            (account || []).map((c) => ({
                slug: c.slug,
                title: c.title,
                url: `${origin}/c/${c.slug}`,
                manageUrl: `${origin}/c/${c.slug}/manage?k=${c.owner_token}`,
                supporters: c.supporter_count,
            })),
        [account, origin]
    );

    // Campaigns this browser remembers that are not on the account. Older
    // campaigns, or ones made before signing in. There is no "add to account"
    // button by design: campaigns join an account when they are created, not as
    // a cleanup job afterwards. These stay listed so the dashboard links work.
    const localOnly: Row[] = useMemo(() => {
        const known = new Set(accountRows.map((r) => r.slug));
        return local
            .filter((c) => !known.has(c.slug))
            .map((c) => ({
                slug: c.slug,
                title: c.title,
                url: c.url,
                manageUrl: c.manageUrl,
                supporters: null,
                localCreatedAt: c.createdAt,
            }));
    }, [local, accountRows]);

    const removeLocal = (slug: string, createdAt?: number) => {
        const next = local.filter((c) => !(c.slug === slug && c.createdAt === createdAt));
        setLocal(next);
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    };

    const signOut = async () => {
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
        setAccount(null);
        setEmail(null);
    };

    if (!loaded) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 text-muted py-10">
                <Loader2 size={18} className="animate-spin" /> Loading your campaigns...
            </div>
        );
    }

    const nothingAnywhere = accountRows.length === 0 && localOnly.length === 0;

    return (
        <div className="max-w-2xl mx-auto">
            {signedIn && (
                <div className="flex items-center justify-between gap-3 mb-4 px-1">
                    <p className="text-xs text-muted truncate">
                        Signed in as <span className="font-semibold text-ink">{email}</span>
                    </p>
                    <button onClick={signOut} className="text-xs font-bold text-muted hover:text-brand-deep flex items-center gap-1.5 shrink-0 transition-colors">
                        <LogOut size={13} /> Sign out
                    </button>
                </div>
            )}

            {signedIn && (
                <Link
                    href="/hub"
                    className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-brand/25 bg-brand/10 px-4 py-3.5 hover:bg-brand/15 transition-colors"
                >
                    <div className="min-w-0">
                        <p className="font-display font-bold text-[15px]">Your campaign hub</p>
                        <p className="text-xs text-ink/70 truncate">
                            Claim /u/… — Support button, bio, and other links
                        </p>
                    </div>
                    <span className="text-xs font-bold text-brand-deep shrink-0">Edit</span>
                </Link>
            )}

            {nothingAnywhere ? (
                <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
                    <Inbox className="w-8 h-8 text-muted mx-auto mb-3" />
                    <p className="font-display font-bold text-lg mb-1">
                        {signedIn ? 'No campaigns on this account yet' : 'No campaigns yet on this device'}
                    </p>
                    <p className="text-sm text-ink/70 mb-6">
                        {signedIn
                            ? 'Anything you create from now on lands here, on every device you sign in from.'
                            : 'Campaigns you create in this browser show up here so you can find their dashboards again.'}
                    </p>
                    <Link href="/create" className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all">Create a campaign</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {accountRows.map((c) => (
                        <CampaignRow key={`acct-${c.slug}`} row={c} />
                    ))}

                    {localOnly.length > 0 && accountRows.length > 0 && (
                        <p className="text-xs font-bold uppercase tracking-wider text-muted pt-4 px-1">Only in this browser</p>
                    )}

                    {localOnly.map((c) => (
                        <CampaignRow
                            key={`local-${c.slug}-${c.localCreatedAt}`}
                            row={c}
                            onRemove={() => removeLocal(c.slug, c.localCreatedAt)}
                        />
                    ))}

                    {localOnly.length > 0 && (
                        <p className="text-xs text-muted text-center pt-2 leading-relaxed">
                            Campaigns in this section live only in this browser. Keep their dashboard links saved
                            somewhere safe.
                        </p>
                    )}
                </div>
            )}

            {!signedIn && (
                <div className="mt-5 bg-cream border border-ink/10 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <LogIn size={18} className="text-brand-deep mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <p className="font-display font-bold mb-1">Already have an account?</p>
                            <p className="text-sm text-ink/70 mb-4">
                                Sign in with a code and every campaign you saved to it shows up here, on any device.
                                New campaigns join your account as you create them. Supporters never sign in.
                            </p>
                            <Link href="/login" className="inline-flex h-10 px-5 rounded-xl bg-brand text-ink font-bold text-sm items-center hover:brightness-105 transition-all">
                                Sign in with a code
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CampaignRow: React.FC<{ row: Row; onRemove?: () => void }> = ({ row, onRemove }) => (
    <div className="bg-cream border border-ink/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="min-w-0 flex-1">
            <p className="font-display font-bold truncate">{row.title}</p>
            <p className="text-xs text-muted truncate flex items-center gap-2">
                <span className="truncate">ollabs.studio/c/{row.slug}</span>
                {row.supporters != null && (
                    <span className="inline-flex items-center gap-1 shrink-0">
                        <Users size={11} /> {row.supporters.toLocaleString()}
                    </span>
                )}
            </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <a href={row.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-paper border border-ink/10 hover:bg-ink/5 transition-colors" title="Open campaign">
                <ExternalLink size={16} className="text-ink" />
            </a>
            {row.manageUrl && (
                <a href={row.manageUrl} className="px-3 py-2 rounded-lg bg-brand text-ink font-semibold text-sm flex items-center gap-1.5 hover:brightness-105 transition-all" title="Edit this campaign and see its stats">
                    <Pencil size={15} /> Manage
                </a>
            )}
            {onRemove && (
                <button onClick={onRemove} className="p-2 rounded-lg bg-paper border border-ink/10 hover:text-coral transition-colors" title="Remove from this list">
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    </div>
);
