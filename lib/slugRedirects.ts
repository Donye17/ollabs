/**
 * Whether a campaign_slug_redirects row blocks a rename onto that old_slug.
 *
 * /c/[slug] serves a live campaign first, then follows a redirect. A name that
 * only exists as someone else's redirect is still their shared link (WhatsApp,
 * posters, bios). Claiming it used to delete that row after the live UPDATE,
 * so supporters who still opened the old custom URL got the new campaign's
 * frame. Taking back a name we ourselves redirected is allowed.
 */
export function slugRedirectBlocksRename(
    redirectCampaignId: string | null | undefined,
    requesterCampaignId: string
): boolean {
    if (!redirectCampaignId) return false;
    return String(redirectCampaignId) !== String(requesterCampaignId);
}
