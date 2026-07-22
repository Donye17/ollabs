"use client";
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { FramePreview } from '@/components/FramePreview';
import { FrameConfig } from '@/lib/types';

export interface ExploreCampaign {
    slug: string;
    title: string;
    supporterCount: number;
    frame: FrameConfig;
}

export const ExploreClient: React.FC<{ campaigns: ExploreCampaign[] }> = ({ campaigns }) => {
    const [q, setQ] = useState('');

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return campaigns;
        return campaigns.filter((c) => c.title.toLowerCase().includes(term));
    }, [q, campaigns]);

    return (
        <div>
            <div className="max-w-md mx-auto mb-10">
                <div className="flex items-center gap-2 bg-cream border border-ink/10 rounded-xl px-4 focus-within:ring-2 focus-within:ring-brand/40 focus-within:border-brand transition-all">
                    <Search size={18} className="text-muted shrink-0" />
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search campaigns"
                        className="flex-1 bg-transparent py-3 text-ink placeholder-muted outline-none"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-muted">No campaigns match that search.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {filtered.map((c) => (
                        <Link key={c.slug} href={`/c/${c.slug}`} className="group flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
                            <FramePreview frame={c.frame} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full" />
                            <div className="text-center">
                                <p className="text-sm font-semibold text-ink group-hover:text-brand-deep transition-colors line-clamp-1">{c.title}</p>
                                <p className="text-xs text-muted">{c.supporterCount.toLocaleString()} supporting</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};
