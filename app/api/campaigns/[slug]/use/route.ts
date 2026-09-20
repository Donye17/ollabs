import { pool } from '@/lib/neon';
import { NextRequest, NextResponse, after } from 'next/server';
import { firstSupporterEmail, milestoneEmail, sendEmail } from '@/lib/email';
import { countryLabel, publisherCountry } from '@/lib/geo';
import { clientIp, rateLimit } from '@/lib/rateLimit';
import { findVisibleCampaignBySlugOrRedirect } from '@/lib/findPublicCampaign';

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

        const campaign = await findVisibleCampaignBySlugOrRedirect(slug);
        if (!campaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }
        const campaignId = campaign.id;
        // Emails and manage links must use the live slug. The request slug may be
        // an old custom link that only exists in campaign_slug_redirects.
        const liveSlug = campaign.slug;
        const supporterCountry = publisherCountry(request);

        let imageUrl: string | null = null;
        try {
            const body = await request.json();
            if (body && typeof body.imageUrl === 'string') imageUrl = body.imageUrl;
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

        const organizerEmail = campaign.organizer_email;
        const ownerToken = campaign.owner_token ?? '';

        // First supporter is the highest-leverage nudge: median first join is 4.5
        // minutes after publish. Guard with first_supporter_emailed_at like milestones.
        if (prevCount === 0 && count === 1 && organizerEmail) {
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
                        slug: liveSlug,
                        ownerToken,
                        country: supporterCountry,
                        countryName: countryLabel(supporterCountry),
                    });
                    await sendEmail({ to: organizerEmail, ...msg, tag: 'first_supporter' });
                } catch (e) {
                    console.error('[use] first supporter email failed', e);
                }
            });
        }

        // Milestone nudge. Guarded by milestone_notified so a burst of traffic
        // cannot send the same email twice, and never blocks the response.
        const hit = organizerEmail
            ? milestoneReached(count, campaign.milestone_notified)
            : null;
        // Runs through after() for the same reason as the welcome email: a
        // floating promise would be killed when the function freezes on
        // returning the response.
        if (hit != null && organizerEmail) {
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
                        slug: liveSlug,
                        ownerToken,
                        count,
                        goal: campaign.goal,
                    });
                    await sendEmail({ to: organizerEmail, ...msg, tag: 'milestone' });
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
