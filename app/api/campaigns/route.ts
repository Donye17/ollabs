import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { CATEGORY_KEYS } from '@/lib/categories';
import { hasVisibleFrame, visibleFrameSql } from '@/lib/frameValidity';
import { campaignLiveEmail, isValidEmail, normalizeEmail, sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function slugify(input: string): string {
    const base = (input || '')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);
    return base || 'campaign';
}

function randomSuffix(len = 4): string {
    return Math.random().toString(36).slice(2, 2 + len);
}

function ownerToken(): string {
    return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, '');
}

// GET /api/campaigns, list public campaigns, newest first
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const result = await pool.query(
            `SELECT c.id, c.slug, c.title, c.description, c.frame_config, c.creator_name, c.supporter_count, c.created_at
             FROM campaigns c
             WHERE c.is_public = true AND c.is_hidden IS NOT TRUE AND ${visibleFrameSql('c')}
             ORDER BY c.created_at DESC
             LIMIT $1`,
            [limit]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Failed to list campaigns:', error);
        return NextResponse.json({ error: 'Failed to list campaigns' }, { status: 500 });
    }
}

// POST /api/campaigns, create a campaign (anonymous-first; attaches creator if signed in)
export async function POST(request: NextRequest) {
    try {
        // Best-effort abuse throttle: 12 new campaigns per 10 minutes per client.
        if (!rateLimit(`create:${clientIp(request)}`, 12, 10 * 60 * 1000)) {
            return NextResponse.json({ error: 'You are creating campaigns too fast. Please wait a minute and try again.' }, { status: 429 });
        }

        const body = await request.json();
        const { title, description, frameConfig, isPublic, previewUrl, goal, category, organizerEmail } = body;
        const categoryValue = typeof category === 'string' && CATEGORY_KEYS.includes(category) ? category : null;

        // Optional, and it stays optional. Creating a campaign never requires an
        // account; this is purely so the organizer can get back in later.
        let emailValue: string | null = null;
        if (organizerEmail != null && organizerEmail !== '') {
            if (!isValidEmail(organizerEmail)) {
                return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 });
            }
            emailValue = normalizeEmail(organizerEmail);
        }

        if (!title || !frameConfig) {
            return NextResponse.json({ error: 'title and frameConfig are required' }, { status: 400 });
        }

        // A config can be well-formed and still render nothing on top of the photo.
        // Publishing one of those gives every supporter their own photo back, unchanged.
        if (!hasVisibleFrame(frameConfig)) {
            return NextResponse.json(
                { error: 'This campaign has no frame on it yet. Pick a border style or upload your frame image, then publish.' },
                { status: 400 }
            );
        }

        // Optional supporter goal.
        let goalValue: number | null = null;
        if (goal != null && goal !== '') {
            const g = Math.floor(Number(goal));
            if (!Number.isFinite(g) || g < 1 || g > 100_000_000) {
                return NextResponse.json({ error: 'Goal must be a number between 1 and 100,000,000.' }, { status: 400 });
            }
            goalValue = g;
        }

        // Input caps to keep payloads sane and block junk.
        if (typeof title !== 'string' || title.length > 120) {
            return NextResponse.json({ error: 'Title is too long (max 120 characters).' }, { status: 400 });
        }
        if (description != null && (typeof description !== 'string' || description.length > 400)) {
            return NextResponse.json({ error: 'Description is too long (max 400 characters).' }, { status: 400 });
        }
        const frameJson = JSON.stringify(frameConfig);
        if (frameJson.length > 200_000) {
            return NextResponse.json({ error: 'Frame data is too large.' }, { status: 400 });
        }

        // Anonymous-first: campaigns are created without an account.
        const creatorId = null;
        const creatorName = 'Anonymous';

        const baseSlug = slugify(title);
        const token = ownerToken();

        let campaign = null;
        for (let attempt = 0; attempt < 5; attempt++) {
            const slug = `${baseSlug}-${randomSuffix()}`;
            try {
                const result = await pool.query(
                    `INSERT INTO campaigns (slug, title, description, frame_config, creator_id, creator_name, is_public, preview_url, owner_token, goal, category, organizer_email, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
                     RETURNING id, slug, title, supporter_count, owner_token, created_at`,
                    [slug, title, description ?? null, frameJson, creatorId, creatorName, isPublic !== false, previewUrl ?? null, token, goalValue, categoryValue, emailValue]
                );
                campaign = result.rows[0];
                break;
            } catch (e: any) {
                // 23505 = unique_violation on slug; retry with a fresh suffix
                if (e?.code === '23505') continue;
                throw e;
            }
        }

        if (!campaign) {
            return NextResponse.json({ error: 'Could not generate a unique link, please try again' }, { status: 409 });
        }

        // Fire the "your campaign is live" email. Never let a mail failure fail
        // the create; the organizer already has their link in the response.
        if (emailValue) {
            const msg = campaignLiveEmail({
                title: campaign.title,
                slug: campaign.slug,
                ownerToken: campaign.owner_token,
            });
            sendEmail({ to: emailValue, ...msg })
                .then((ok) => {
                    if (ok) {
                        return pool.query(
                            `UPDATE campaigns SET email_sent_at = NOW() WHERE id = $1`,
                            [campaign.id]
                        );
                    }
                })
                .catch((e) => console.error('[campaigns] welcome email failed', e));
        }

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Failed to create campaign:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
