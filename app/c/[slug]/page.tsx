import { cache } from 'react';
import { pool } from '@/lib/neon';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { CampaignClient } from '@/components/campaign/CampaignClient';
import { parseFrameConfig } from '@/lib/parseFrameConfig';
import {
    ogLocale,
    resolveSupporterLocale,
    type Locale,
} from '@/lib/i18n/locale';
import { isPublicBlobUrl } from '@/lib/publicBlobUrl';

// Cache the rendered page for 60s per slug. Repeat visits and crawler hits are
// served from cache instead of querying Postgres every time, which keeps Neon
// compute low. Supporter counts refresh within a minute for other visitors.
export const revalidate = 60;

// Dedupe: generateMetadata and the page share one DB query per render.
const getCampaign = cache(async (slug: string) => {
    try {
        const res = await pool.query(
            `SELECT id, slug, title, description, frame_config, creator_name, supporter_count, goal, preview_url, is_public, is_hidden,
                    publisher_country, first_supporter_country
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

function campaignCountry(c: { publisher_country?: string | null; first_supporter_country?: string | null }): string | null {
    return c.publisher_country || c.first_supporter_country || null;
}

function fallbackDescription(title: string, locale: Locale): string {
    if (locale === 'pt') return `Coloque a moldura ${title} na sua foto de perfil e mostre seu apoio.`;
    return `Add the ${title} frame to your profile picture and show your support.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    let c = await getCampaign(slug);
    if (!c) {
        const dest = await resolveRedirectSlug(slug);
        if (dest) c = await getCampaign(dest);
    }
    if (!c) return { title: 'Campaign not found' };
    const locale = resolveSupporterLocale({ campaignCountry: campaignCountry(c) });
    const description = c.description || fallbackDescription(c.title, locale);

    // Prefer a stored face-in-frame composite when present (WhatsApp unfurls
    // read better with a real face). Fall back to custom frame artwork, then
    // the site card. Custom artwork alone used to win always to avoid the
    // "empty donut" bug from publishing mid-decode; composites uploaded after
    // a successful canvas render are trustworthy now.
    const frameImage = typeof c.frame_config?.imageUrl === 'string'
        && c.frame_config.imageUrl.startsWith('https://')
        ? c.frame_config.imageUrl as string
        : null;
    // preview_url is a face-in-frame composite we uploaded. Ignore anything
    // else so an old or injected off-site URL cannot become the WhatsApp card.
    const storedPreview = isPublicBlobUrl(c.preview_url) ? c.preview_url : null;
    const shareImage = storedPreview || frameImage || 'https://ollabs.studio/og.png';

    return {
        title: c.title,
        description,
        // Campaign pages are user-generated and carry almost no publisher text:
        // 55% have an empty description. AdSense inventory-value policy does not
        // allow ads on screens like this, and Search should not index them
        // either. follow:true so links out still count. This must stay
        // crawlable in robots.ts or Google never reads this tag.
        robots: { index: false, follow: true },
        openGraph: {
            title: c.title,
            description,
            locale: ogLocale(locale),
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

    const frame = parseFrameConfig(campaign.frame_config);
    if (!frame) notFound();

    const country = campaignCountry(campaign);
    // ISR caches this HTML per slug. Reading Accept-Language here would make
    // every campaign page dynamic, which we cannot do before the October spike.
    // Untagged and Brazilian campaigns are Portuguese from resolveSupporterLocale.

    return (
        <CampaignClient
            slug={campaign.slug}
            title={campaign.title}
            description={campaign.description}
            creatorName={campaign.creator_name}
            initialCount={campaign.supporter_count ?? 0}
            goal={campaign.goal ?? null}
            frame={frame}
            campaignCountry={country}
        />
    );
}
