"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, BarChart3, Trash2, Inbox } from 'lucide-react';

interface SavedCampaign {
    slug: string;
    title: string;
    url: string;
    manageUrl: string | null;
    createdAt: number;
}

export const MyCampaignsClient: React.FC = () => {
    const [items, setItems] = useState<SavedCampaign[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem('ollabs_my_campaigns') || '[]');
            if (Array.isArray(list)) setItems(list);
        } catch { /* ignore */ }
        setLoaded(true);
    }, []);

    const remove = (slug: string, createdAt: number) => {
        const next = items.filter((c) => !(c.slug === slug && c.createdAt === createdAt));
        setItems(next);
        try { localStorage.setItem('ollabs_my_campaigns', JSON.stringify(next)); } catch { /* ignore */ }
    };

    if (!loaded) return null;

    return (
        <div className="max-w-2xl mx-auto">
            {items.length === 0 ? (
                <div className="bg-cream border border-ink/10 rounded-2xl p-10 text-center">
                    <Inbox className="w-8 h-8 text-muted mx-auto mb-3" />
                    <p className="font-display font-bold text-lg mb-1">No campaigns yet on this device</p>
                    <p className="text-sm text-ink/70 mb-6">Campaigns you create in this browser show up here so you can find their dashboards again.</p>
                    <Link href="/create" className="inline-flex h-11 px-6 rounded-xl bg-brand text-ink font-bold items-center hover:brightness-105 transition-all">Create a campaign</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((c) => (
                        <div key={`${c.slug}-${c.createdAt}`} className="bg-cream border border-ink/10 rounded-2xl p-4 flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="font-display font-bold truncate">{c.title}</p>
                                <p className="text-xs text-muted truncate">ollabs.studio/c/{c.slug}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a href={c.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-paper border border-ink/10 hover:bg-ink/5 transition-colors" title="Open campaign">
                                    <ExternalLink size={16} className="text-ink" />
                                </a>
                                {c.manageUrl && (
                                    <a href={c.manageUrl} className="px-3 py-2 rounded-lg bg-brand text-ink font-semibold text-sm flex items-center gap-1.5 hover:brightness-105 transition-all" title="Open dashboard">
                                        <BarChart3 size={15} /> Dashboard
                                    </a>
                                )}
                                <button onClick={() => remove(c.slug, c.createdAt)} className="p-2 rounded-lg bg-paper border border-ink/10 hover:text-coral transition-colors" title="Remove from this list">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <p className="text-xs text-muted text-center pt-2">This list is stored only in this browser. Keep your dashboard links saved somewhere safe too.</p>
                </div>
            )}
        </div>
    );
};
