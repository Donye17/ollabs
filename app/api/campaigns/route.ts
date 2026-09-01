import { pool } from '@/lib/neon';
import { NextRequest, NextResponse, after } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { CATEGORY_KEYS } from '@/lib/categories';
import { hasVisibleFrame, visibleFrameSql } from '@/lib/frameValidity';
import { campaignLiveEmail, isValidEmail, normalizeEmail, sendEmail } from '@/lib/email';
import { getDay } from '@/lib/days';
import { getSessionOrganizer } from '@/lib/auth';
import { publisherCountry } from '@/lib/geo';
import { hashOwnerToken } from '@/lib/ownerToken';
import { isPublicBlobUrl } from '@/lib/publicBlobUrl';

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
        const { title, description, frameConfig, isPublic, previewUrl, goal, category, organizerEmail, daySlug } = body;
        // Only a real day, so this cannot be used to stash arbitrary strings.
        const dayValue = typeof daySlug === 'string' && getDay(daySlug) ? daySlug : null;
        const categoryValue = typeof category === 'string' && CATEGORY_KEYS.includes(category) ? category : null;
        const rawReferrer = body.referrerSlug ?? body.from ?? request.nextUrl.searchParams.get('from');
        const referrerValue = typeof rawReferrer === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawReferrer) && rawReferrer.length <= 80
            ? rawReferrer
            : null;

        // Optional, and it stays optional. Creating a campaign never requires an
        // account; this is purely so the organizer can get back in later.
        let emailValue: string | null = null;
        if (organizerEmail != null && organizerEmail !== '') {
            if (!isValidEmail(organizerEmail)) {
                return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 });
            }
            emailValue = normalizeEmail(organizerEmail);
        }

        // If an organizer happens to be signed in, attach the campaign to their
        // account and fall back to their address for the welcome email. Being
        // signed out changes nothing: creating stays fully anonymous.
        const organizer = await getSessionOrganizer(request);
        if (organizer && !emailValue) emailValue = organizer.email;

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

        // WhatsApp unfurls this as the campaign card. Only blob uploads, so a
        // raw POST cannot point the OG image at an arbitrary host.
        let previewValue: string | null = null;
        if (previewUrl != null && previewUrl !== '') {
            if (!isPublicBlobUrl(previewUrl)) {
                return NextResponse.json({ error: 'Preview image must be an uploaded file.' }, { status: 400 });
            }
            previewValue = previewUrl.trim();
        }

        // Anonymous-first: campaigns are created without an account. creator_id
        // is set only when the creator already had a session open.
        const creatorId = organizer?.id ?? null;
        const creatorName = 'Anonymous';
        const country = publisherCountry(request);

        const baseSlug = slugify(title);
        const token = ownerToken();
        // Hash at rest for lookups; plaintext stays for manage emails + dual-read
        // until old campaigns are backfilled (see lib/ownerToken.ts).
        const tokenHash = await hashOwnerToken(token);

        let campaign = null;
        for (let attempt = 0; attempt < 5; attempt++) {
            const slug = `${baseSlug}-${randomSuffix()}`;
            try {
                const result = await pool.query(
                    `INSERT INTO campaigns (slug, title, description, frame_config, creator_id, creator_name, is_public, preview_url, owner_token, owner_token_hash, goal, category, organizer_email, day_slug, publisher_country, referrer_slug, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
                     RETURNING id, slug, title, supporter_count, owner_token, created_at, publisher_country`,
                    [slug, title, description ?? null, frameJson, creatorId, creatorName, isPublic !== false, previewValue, token, tokenHash, goalValue, categoryValue, emailValue, dayValue, country, referrerValue]
                );
                campaign = result.rows[0];
                break;
            } catch (e: any) {
                // 23505 = unique_violation on slug; retry with a fresh suffix
                if (e?.code === '23505') continue;
                // Column may be missing on a stale preview; fall back without hash.
                if (e?.code === '42703' && String(e?.message || '').includes('owner_token_hash')) {
                    const result = await pool.query(
                        `INSERT INTO campaigns (slug, title, description, frame_config, creator_id, creator_name, is_public, preview_url, owner_token, goal, category, organizer_email, day_slug, publisher_country, referrer_slug, created_at)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
                         RETURNING id, slug, title, supporter_count, owner_token, created_at, publisher_country`,
                        [slug, title, description ?? null, frameJson, creatorId, creatorName, isPublic !== false, previewValue, token, goalValue, categoryValue, emailValue, dayValue, country, referrerValue]
                    );
                    campaign = result.rows[0];
                    break;
                }
                throw e;
            }
        }

        if (!campaign) {
            return NextResponse.json({ error: 'Could not generate a unique link, please try again' }, { status: 409 });
        }

        // Send the "your campaign is live" email after the response, so a slow
        // or failing mail provider never delays or fails the create. This has
        // to go through after() rather than a bare floating promise: on
        // serverless the function is frozen the moment the response is
        // returned, and unawaited work is killed before it runs.
        if (emailValue) {
            const to = emailValue;
            after(async () => {
                try {
                    const msg = campaignLiveEmail({
                        title: campaign.title,
                        slug: campaign.slug,
                        ownerToken: campaign.owner_token,
                    });
                    const ok = await sendEmail({ to, ...msg, tag: 'campaign_live' });
                    if (ok) {
                        await pool.query(
                            `UPDATE campaigns SET email_sent_at = NOW() WHERE id = $1`,
                            [campaign.id]
                        );
                    }
                } catch (e) {
                    console.error('[campaigns] welcome email failed', e);
                }
            });
        }

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error('Failed to create campaign:', error);
        return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
    }
}
