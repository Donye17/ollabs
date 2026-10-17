import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { ExploreClient, ExploreCampaign, ExploreSort } from '@/components/ExploreClient';
import { pool } from '@/lib/neon';
import { CATEGORY_KEYS } from '@/lib/categories';
import { visibleFrameSql } from '@/lib/frameValidity';
import { SUPPORTER_PHOTOS_LATERAL, parseSupporterPhotos } from '@/lib/supporterPhotosSql';
import { parseFrameConfig } from '@/lib/parseFrameConfig';
import { getMessages } from '@/lib/i18n/messages';
import { LOCALE_COOKIE, resolveLocale } from '@/lib/i18n/locale';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const jar = await cookies();
    const locale = resolveLocale({ cookie: jar.get(LOCALE_COOKIE)?.value ?? null });
    const title = getMessages(locale).explore.title;
    return {
        title,
        description: 'Browse live profile-picture frame campaigns for causes, teams, events, and more. Add one to your photo, or make your own for free.',
        alternates: { canonical: 'https://ollabs.studio/explore' },
        openGraph: { type: 'website', url: 'https://ollabs.studio/explore', title, description: 'Browse live profile-picture frame campaigns and add one to your photo.', siteName: 'Ollabs', images: ['/og.png'] },
        twitter: { card: 'summary_large_image', images: ['/og.png'] },
    };
}

type Sort = 'popular' | 'trending' | 'newest';

const EXPLORE_SELECT = `c.slug, c.title, c.frame_config, c.preview_url, c.publisher_country,
    COALESCE(sp.supporter_photos, ARRAY[]::text[]) AS supporter_photos`;

async function getCampaigns(
    sort: Sort,
    category: string | null,
    visitorCountry: string | null
): Promise<ExploreCampaign[]> {
    // category is validated against the fixed allowlist before reaching here, so it is safe to inline.
    const catClause = category ? ` AND c.category = '${category}'` : '';
    // Explore is for social proof, not publish-day discovery. Require real traction so
    // empty campaigns (and spam that never gets shared) stay off the grid. Direct /c
    // links and hubs are unaffected.
    const MIN_SUPPORTERS = 5;
    const where = `WHERE c.is_public = true AND c.is_hidden IS NOT TRUE AND ${visibleFrameSql('c')} AND COALESCE(c.supporter_count, 0) >= ${MIN_SUPPORTERS}${catClause}`;
    // Soft geo boost: same-country publishers float slightly without hiding others.
    const geoBoost = visitorCountry
        ? `CASE WHEN c.publisher_country = '${visitorCountry.replace(/[^A-Z]/g, '')}' THEN 1 ELSE 0 END`
        : '0::int';
    let query: string;
    if (sort === 'newest') {
        query = `SELECT ${EXPLORE_SELECT}, c.supporter_count
            FROM campaigns c
            ${SUPPORTER_PHOTOS_LATERAL}
            ${where}
            ORDER BY ${geoBoost} DESC, c.created_at DESC
            LIMIT 60`;
    } else if (sort === 'trending') {
        query = `SELECT ${EXPLORE_SELECT}, c.supporter_count
            FROM campaigns c
            LEFT JOIN (
                SELECT campaign_id, COUNT(*)::int AS recent
                FROM campaign_uses
                WHERE created_at >= now() - interval '7 days'
                GROUP BY campaign_id
            ) r ON r.campaign_id = c.id
            ${SUPPORTER_PHOTOS_LATERAL}
            ${where}
            ORDER BY ${geoBoost} DESC, COALESCE(r.recent, 0) DESC, c.supporter_count DESC NULLS LAST, c.created_at DESC
            LIMIT 60`;
    } else {
        // Popular = real downloads × recency feel, with a soft country bias.
        query = `SELECT ${EXPLORE_SELECT},
                        COALESCE(u.real_uses, 0)::int AS supporter_count
                 FROM campaigns c
                 LEFT JOIN (
                     SELECT campaign_id, COUNT(*)::int AS real_uses
                     FROM campaign_uses
                     GROUP BY campaign_id
                 ) u ON u.campaign_id = c.id
                 ${SUPPORTER_PHOTOS_LATERAL}
                 ${where}
                 ORDER BY ${geoBoost} DESC, COALESCE(u.real_uses, 0) DESC, c.created_at DESC
                 LIMIT 60`;
    }
    try {
        const res = await pool.query(query);
        return res.rows.flatMap((r) => {
            const frame = parseFrameConfig(r.frame_config);
            if (!frame) return [];
            return [{
                slug: r.slug,
                title: r.title,
                supporterCount: r.supporter_count ?? 0,
                frame,
                supporterPhotos: parseSupporterPhotos(r.supporter_photos),
            }];
        });
    } catch (e) {
        console.error('Failed to load explore campaigns', e);
        return [];
    }
}

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ sort?: string; category?: string }> }) {
    const sp = await searchParams;
    const sort: ExploreSort = sp.sort === 'newest' ? 'newest' : sp.sort === 'trending' ? 'trending' : 'popular';
    const category = sp.category && CATEGORY_KEYS.includes(sp.category) ? sp.category : null;
    const hdrs = await headers();
    const rawCountry = (hdrs.get('x-vercel-ip-country') || hdrs.get('cf-ipcountry') || '').toUpperCase();
    const visitorCountry = /^[A-Z]{2}$/.test(rawCountry) && rawCountry !== 'XX' ? rawCountry : null;
    const campaigns = await getCampaigns(sort, category, visitorCountry);

    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <ExploreClient campaigns={campaigns} sort={sort} category={category} />
            <SiteFooter />
        </main>
    );
}

