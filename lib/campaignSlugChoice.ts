/** Live row wins; otherwise the redirect target. */
export function preferLiveCampaign<T>(live: T | null | undefined, viaRedirect: T | null | undefined): T | null {
    return live ?? viaRedirect ?? null;
}
