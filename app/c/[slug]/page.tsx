import { cache } from 'react';
import { pool } from '@/lib/neon';
import { notFound, redirect } from 'next/navigation';
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

/** Follow a renamed custom URL to the campaign's current slug. */
const resolveRedirectSlug = cache(async (slug: string): Promise<string | null> => {
    try {
        const res = await pool.query(
            `SELECT c.slug
             FROM campaign_slug_redirects r
             JOIN campaigns c ON c.id = r.campaign_id
             WHERE r.old_slug = $1
               AND c.is_public = true
               AND c.is_hidden IS NOT TRUE
             LIMIT 1`,
            [slug]
        );
        return res.rows[0]?.slug ?? null;
    } catch (e) {
        // Missing table before migration 0012 is applied — treat as no redirect.
        console.error('slug redirect lookup failed', e);
        return null;
    }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let c = await getCampaign(slug);
    if (!c) {
        const dest = await resolveRedirectSlug(slug);
        if (dest) c = await getCampaign(dest);
    }
    if (!c) return { title: 'Campaign not found' };
    const description = c.description || `Add the ${c.title} frame to your profile picture and show your support.`;

    // Share image, in priority order.
    //
    // 1. The campaign's own frame artwork, for CUSTOM_IMAGE campaigns. This is
    //    the branding the organizer actually uploaded, it stays correct when
    //    they edit the frame, and it does not depend on whatever the editor
    //    canvas happened to be showing at the moment they hit publish.
    //
    //    That last part was a real bug. ImageFrameRenderer bails out early
    //    while the uploaded PNG is still decoding, so publishing during that
    //    window stored a bare default ring as the campaign's permanent share
    //    image. Three of the twelve largest campaigns were affected, including
    //    the biggest one at 934 supporters, which had been sharing to WhatsApp
    //    as an empty blue donut.
    //
    // 2. The stored composite preview, which is still the best image for the
    //    plain geometric frame types that have no artwork of their own.
    //
    // 3. The Ollabs card, so a link is never shared with no image at all.
    const frameImage = typeof c.frame_config?.imageUrl === 'string'
        && c.frame_config.imageUrl.startsWith('https://')
        ? c.frame_config.imageUrl as string
        : null;
    const shareImage = frameImage || c.preview_url || 'https://ollabs.studio/og.png';

    return {
        title: c.title,
        description,
        openGraph: {
            title: c.title,
            description,
            url: `https://ollabs.studio/c/${c.slug}`,
            images: [{ url: shareImage, width: 1024, height: 1024, alt: c.title }],
        },
        twitter: { card: 'summary_large_image', title: c.title, description, images: [shareImage] },
        alternates: { canonical: `https://ollabs.studio/c/${c.slug}` },
    };
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const campaign = await getCampaign(slug);
    if (!campaign) {
        const dest = await resolveRedirectSlug(slug);
        // Permanent: WhatsApp and search should retire the old slug.
        if (dest && dest !== slug) redirect(`/c/${dest}`);
        notFound();
    }

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
