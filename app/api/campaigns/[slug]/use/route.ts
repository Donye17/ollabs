import { pool } from '@/lib/neon';
import { NextRequest, NextResponse, after } from 'next/server';
import { firstSupporterEmail, milestoneEmail, sendEmail } from '@/lib/email';
import { countryLabel, publisherCountry } from '@/lib/geo';
import { isPublicBlobUrl } from '@/lib/publicBlobUrl';
import { clientIp, rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// Milestones worth interrupting an organizer for. Kept sparse on purpose: the
// point is to give them a reason to reshare, not to become a notification tax.
const MILESTONES = [25, 50, 100, 250, 500, 1000, 5000, 10000];

function milestoneReached(count: number, alreadyNotified: number): number | null {
    let hit: number | null = null;
    for (const m of MILESTONES) {
        if (count >= m && m > alreadyNotified) hit = m;
    }
    return hit;
}

// POST /api/campaigns/[slug]/use, a supporter applied the frame; bump the counter.
// Body (optional): { imageUrl } — a small public JPEG for Explore thumbnails.
//
// Rate limit is per-instance (see lib/rateLimit.ts). Limits are generous for a
// real supporter saving once; they blunt scripted counter inflation.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const ip = clientIp(request);
        if (!rateLimit(`use:${ip}`, 40, 10 * 60 * 1000)
            || !rateLimit(`use:${ip}:${slug}`, 20, 10 * 60 * 1000)) {
            return NextResponse.json(
                { error: 'Too many saves from this network. Try again in a few minutes.' },
                { status: 429 }
            );
        }

        const campaignRes = await pool.query(
            `SELECT id, title, owner_token, organizer_email, goal,
                    COALESCE(milestone_notified, 0) AS milestone_notified
             FROM campaigns WHERE slug = $1 AND is_public = true AND is_hidden IS NOT TRUE LIMIT 1`,
            [slug]
        );
        if (campaignRes.rows.length === 0) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        const campaign = campaignRes.rows[0];
        const campaignId = campaign.id;
        const supporterCountry = publisherCountry(request);

        let imageUrl: string | null = null;
        try {
            const body = await request.json();
            // Only Vercel Blob URLs from uploadExploreThumb. An arbitrary https
            // host would render on Explore / the home podium as if it were ours.
            if (body && isPublicBlobUrl(body.imageUrl)) imageUrl = body.imageUrl.trim();
        } catch {
            // no body is fine
        }

        const prevCountRes = await pool.query(
            `SELECT supporter_count FROM campaigns WHERE id = $1`,
            [campaignId]
        );
        const prevCount: number = prevCountRes.rows[0]?.supporter_count ?? 0;

        await pool.query(
            `INSERT INTO campaign_uses (campaign_id, user_id, image_url, supporter_country, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [campaignId, null, imageUrl, supporterCountry]
        );

        const updated = await pool.query(
            `UPDATE campaigns SET supporter_count = supporter_count + 1
             WHERE id = $1
             RETURNING supporter_count`,
            [campaignId]
        );

        const count: number = updated.rows[0].supporter_count;

        if (prevCount === 0 && supporterCountry) {
            await pool.query(
                `UPDATE campaigns SET first_supporter_country = $2 WHERE id = $1 AND first_supporter_country IS NULL`,
                [campaignId, supporterCountry]
            );
        }

        // First supporter is the highest-leverage nudge: median first join is 4.5
        // minutes after publish. Guard with first_supporter_emailed_at like milestones.
        if (prevCount === 0 && count === 1 && campaign.organizer_email) {
            after(async () => {
                try {
                    const claim = await pool.query(
                        `UPDATE campaigns SET first_supporter_emailed_at = NOW()
                         WHERE id = $1 AND first_supporter_emailed_at IS NULL
                         RETURNING id`,
                        [campaignId]
                    );
                    if (claim.rowCount === 0) return;
                    const msg = firstSupporterEmail({
                        title: campaign.title,
                        slug,
                        ownerToken: campaign.owner_token,
                        country: supporterCountry,
                        countryName: countryLabel(supporterCountry),
                    });
                    await sendEmail({ to: campaign.organizer_email, ...msg, tag: 'first_supporter' });
                } catch (e) {
                    console.error('[use] first supporter email failed', e);
                }
            });
        }

        // Milestone nudge. Guarded by milestone_notified so a burst of traffic
        // cannot send the same email twice, and never blocks the response.
        const hit = campaign.organizer_email
            ? milestoneReached(count, campaign.milestone_notified)
            : null;
        // Runs through after() for the same reason as the welcome email: a
        // floating promise would be killed when the function freezes on
        // returning the response.
        if (hit != null) {
            after(async () => {
                try {
                    const claim = await pool.query(
                        `UPDATE campaigns SET milestone_notified = $2
                         WHERE id = $1 AND COALESCE(milestone_notified, 0) < $2
                         RETURNING id`,
                        [campaignId, hit]
                    );
                    if (claim.rowCount === 0) return; // another request already sent it
                    const msg = milestoneEmail({
                        title: campaign.title,
                        slug,
                        ownerToken: campaign.owner_token,
                        count,
                        goal: campaign.goal,
                    });
                    await sendEmail({ to: campaign.organizer_email, ...msg, tag: 'milestone' });
                } catch (e) {
                    console.error('[use] milestone email failed', e);
                }
            });
        }

        return NextResponse.json({ supporter_count: count });
    } catch (error) {
        console.error('Failed to record campaign use:', error);
        return NextResponse.json({ error: 'Failed to record campaign use' }, { status: 500 });
    }
}
