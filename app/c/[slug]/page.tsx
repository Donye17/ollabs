import { cache } from 'react';
import { pool } from '@/lib/neon';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CampaignClient } from '@/components/campaign/CampaignClient';
import { FrameConfig } from '@/lib/types';

// Cache the rendered page for 60s per slug. Repeat visits and crawler hits are
// served from cache instead of querying Postgres every time, which keeps Neon
// compute low. Supporter counts refresh within a minute for other visitors.
export const revalidate = 60;

// Dedupe: generateMetadata and the page share one DB query per render.
const getCampaign = cache(async (slug: string) => {
    try {
        const res = await pool.query(
            `SELECT id, slug, title, description, frame_config, creator_name, supporter_count, goal, preview_url, is_public, is_hidden
             FROM campaigns WHERE slug = $1 LIMIT 1`,
            [slug]
        );
        const c = res.rows[0];
        if (!c || c.is_public === false || c.is_hidden === true) return null;
        return c;
    } catch (e) {
        console.error('Failed to load campaign', e);
        return null;
    }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const c = await getCampaign(slug);
    if (!c) return { title: 'Campaign not found' };
    const description = c.description || `Add the ${c.title} frame to your profile picture and show your support.`;
    return {
        title: c.title,
        description,
        openGraph: {
            title: c.title,
            description,
            url: `https://ollabs.studio/c/${c.slug}`,
            images: c.preview_url ? [{ url: c.preview_url, width: 1024, height: 1024, alt: c.title }] : undefined,
        },
        twitter: { card: 'summary_large_image', title: c.title, description, images: c.preview_url ? [c.preview_url] : undefined },
    };
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const campaign = await getCampaign(slug);
    if (!campaign) notFound();

    const frame: FrameConfig = typeof campaign.frame_config === 'string'
        ? JSON.parse(campaign.frame_config)
        : campaign.frame_config;

    return (
        <CampaignClient
            slug={campaign.slug}
            title={campaign.title}
            description={campaign.description}
            creatorName={campaign.creator_name}
            initialCount={campaign.supporter_count ?? 0}
            goal={campaign.goal ?? null}
            frame={frame}
        />
    );
}
