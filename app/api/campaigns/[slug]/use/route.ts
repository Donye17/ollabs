import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { milestoneEmail, sendEmail } from '@/lib/email';

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
// Body (optional): { imageUrl } if the supporter opts in to the supporter wall.
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;

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

        let imageUrl: string | null = null;
        try {
            const body = await request.json();
            if (body && typeof body.imageUrl === 'string') imageUrl = body.imageUrl;
        } catch {
            // no body is fine
        }

        await pool.query(
            `INSERT INTO campaign_uses (campaign_id, user_id, image_url, created_at)
             VALUES ($1, $2, $3, NOW())`,
            [campaignId, null, imageUrl]
        );

        const updated = await pool.query(
            `UPDATE campaigns SET supporter_count = supporter_count + 1 WHERE id = $1 RETURNING supporter_count`,
            [campaignId]
        );

        const count: number = updated.rows[0].supporter_count;

        // Milestone nudge. Guarded by milestone_notified so a burst of traffic
        // cannot send the same email twice, and never blocks the response.
        const hit = campaign.organizer_email
            ? milestoneReached(count, campaign.milestone_notified)
            : null;
        if (hit != null) {
            pool.query(
                `UPDATE campaigns SET milestone_notified = $2
                 WHERE id = $1 AND COALESCE(milestone_notified, 0) < $2
                 RETURNING id`,
                [campaignId, hit]
            )
                .then((claim) => {
                    if (claim.rowCount === 0) return; // another request already sent it
                    const msg = milestoneEmail({
                        title: campaign.title,
                        slug,
                        ownerToken: campaign.owner_token,
                        count,
                        goal: campaign.goal,
                    });
                    return sendEmail({ to: campaign.organizer_email, ...msg });
                })
                .catch((e) => console.error('[use] milestone email failed', e));
        }

        return NextResponse.json({ supporter_count: count });
    } catch (error) {
        console.error('Failed to record campaign use:', error);
        return NextResponse.json({ error: 'Failed to record campaign use' }, { status: 500 });
    }
}
