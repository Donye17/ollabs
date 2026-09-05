/**
 * Admin hide/unhide must key off campaigns.id.
 *
 * campaign_reports.slug is the URL at report time. After a custom-link
 * rename that string can be missing from campaigns, or reused by a
 * different campaign. Hiding WHERE slug = report.slug then 404s, or
 * worse, sets is_hidden on the innocent new owner of the old name.
 */

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseAdminCampaignId(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const id = value.trim();
    return UUID_RE.test(id) ? id : null;
}
