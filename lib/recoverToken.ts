/**
 * Campaign recovery tokens are mailed as a one-time /recover/[token] link.
 *
 * The token must not be redeemed on GET. Outlook Safe Links, Slack unfurls,
 * WhatsApp previews, and other scanners fetch the URL in the email before the
 * organizer taps it. Redeeming on that fetch burned the only copy of the
 * dashboard keys and left the real click on "This link has expired".
 *
 * GET serves a confirm screen. POST /api/recover/redeem is the redemption.
 * A short replay window covers a double-tap or a refresh-then-confirm; after
 * that the manage links on the page are the durable keys, same as before.
 */

export const RECOVERY_TOKEN_RE = /^[a-f0-9]{64}$/;
export const RECOVERY_REPLAY_MINUTES = 30;

export function isRecoveryToken(value: unknown): value is string {
    return typeof value === 'string' && RECOVERY_TOKEN_RE.test(value);
}
