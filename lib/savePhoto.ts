/**
 * Save a framed PNG where the person expects it.
 *
 * On iPhone (including WhatsApp's in-app browser), an <a download> lands in
 * Files as a generic document — not the Photos library. The share sheet's
 * Save Image path is the only reliable way into Photos, so iOS always prefers
 * share when the browser allows it.
 */

import { downloadBlob } from '@/lib/download';
import { canShareFiles } from '@/lib/share';

export type SavePhotoOutcome = 'shared' | 'downloaded' | 'cancelled' | 'unavailable';

export function isIOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
    // iPadOS 13+ can report MacIntel.
    return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** Build a PNG File the share sheet and Photos app recognize. */
export function pngFile(blob: Blob, filename: string): File {
    const name = filename.toLowerCase().endsWith('.png') ? filename : `${filename}.png`;
    return new File([blob], name, { type: 'image/png', lastModified: Date.now() });
}

/**
 * Whether the UI should lead with the share sheet instead of Download.
 * Checked once on mount with a throwaway PNG probe (see canShareFiles).
 */
export function preferShareSheetForSave(): boolean {
    if (typeof navigator === 'undefined') return false;
    if (isIOS()) return true;
    try {
        const probe = pngFile(new Blob([new Uint8Array([0])], { type: 'image/png' }), 'probe.png');
        return canShareFiles([probe]);
    } catch {
        return false;
    }
}

/**
 * Save the framed photo. Share sheet on phones (Save Image → Photos); anchor
 * download on desktop. Pass forceDownload only for an explicit desktop fallback.
 */
export async function saveFramedPhoto(opts: {
    blob: Blob;
    filename: string;
    title?: string;
    forceDownload?: boolean;
}): Promise<SavePhotoOutcome> {
    const file = pngFile(opts.blob, opts.filename);
    const canShare = canShareFiles([file]);

    if (canShare && !opts.forceDownload) {
        try {
            // Files-only payload: adding text/url alongside files breaks some
            // iOS in-app browsers and they reject the whole share.
            await navigator.share({ files: [file], title: opts.title });
            return 'shared';
        } catch (e) {
            if (e instanceof Error && e.name === 'AbortError') return 'cancelled';
            if (!isIOS()) {
                downloadBlob(opts.blob, file.name);
                return 'downloaded';
            }
            return 'unavailable';
        }
    }

    if (isIOS()) {
        // Never anchor-download on iOS — it becomes a stray Files entry, not Photos.
        return 'unavailable';
    }

    downloadBlob(opts.blob, file.name);
    return 'downloaded';
}
