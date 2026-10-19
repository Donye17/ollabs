/**
 * Save a framed PNG where the person expects it.
 *
 * On iPhone (including WhatsApp's in-app browser), an <a download> lands in
 * Files as a generic document, not the Photos library. The share sheet's
 * Save Image path is the only reliable way into Photos, so iOS always prefers
 * share when the browser allows it.
 */

import { downloadBlob } from '@/lib/download';
import { canShareFiles } from '@/lib/share';

export type FramedShareResult = {
    outcome: SavePhotoOutcome;
    /** The caption reached the clipboard, so the person can paste it under the photo. */
    captionCopied: boolean;
};

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
 *
 * Android can attach the campaign sentence and URL next to the PNG. iOS
 * in-app browsers reject a share that mixes files with text or url, so those
 * stay files-only and the page shows the sentence after the save.
 */
export async function saveFramedPhoto(opts: {
    blob: Blob;
    filename: string;
    title?: string;
    text?: string;
    url?: string;
    forceDownload?: boolean;
}): Promise<SavePhotoOutcome> {
    const file = pngFile(opts.blob, opts.filename);
    const canShare = canShareFiles([file]);

    if (!canShare || opts.forceDownload) {
        if (isIOS()) {
            // Never anchor-download on iOS. It becomes a stray Files entry, not Photos.
            return 'unavailable';
        }
        downloadBlob(opts.blob, file.name);
        return 'downloaded';
    }

    const shared = await sharePngFile({ file, title: opts.title, text: opts.text, url: opts.url });
    if (shared === 'shared' || shared === 'cancelled') return shared;
    if (!isIOS()) {
        downloadBlob(opts.blob, file.name);
        return 'downloaded';
    }
    return 'unavailable';
}

function canShareData(data: ShareData): boolean {
    if (typeof navigator === 'undefined') return false;
    const n = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (typeof n.share !== 'function' || typeof n.canShare !== 'function') return false;
    try {
        return n.canShare(data);
    } catch {
        return false;
    }
}

/**
 * Share the framed PNG and keep the campaign sentence with it.
 *
 * iOS in-app browsers reject a share that mixes files with text, so those
 * stay files-only. Everywhere else we try files plus text first. Either way
 * the caption is copied before the sheet opens: WhatsApp often keeps the
 * picture and throws the sentence away, and a bare image has no link back.
 * The clipboard write is started in the same turn as share(), not awaited
 * first, because an await here drops the user gesture and Safari refuses
 * the sheet.
 */
export async function shareFramedPhoto(opts: {
    blob: Blob;
    filename: string;
    title?: string;
    text: string;
    /** Campaign URL. Same value already inside text, so a target that keeps url and drops text still links back. */
    url?: string;
}): Promise<FramedShareResult> {
    const file = pngFile(opts.blob, opts.filename);
    const copyPromise: Promise<boolean> =
        typeof navigator !== 'undefined' && navigator.clipboard?.writeText
            ? navigator.clipboard.writeText(opts.text).then(() => true, () => false)
            : Promise.resolve(false);

    const finish = async (outcome: SavePhotoOutcome): Promise<FramedShareResult> => ({
        outcome,
        captionCopied: await copyPromise,
    });

    const canShare = canShareFiles([file]);
    if (!canShare) {
        if (isIOS()) return finish('unavailable');
        downloadBlob(opts.blob, file.name);
        return finish('downloaded');
    }

    const shared = await sharePngFile({ file, title: opts.title, text: opts.text, url: opts.url });
    if (shared === 'shared' || shared === 'cancelled') return finish(shared);
    if (!isIOS()) {
        downloadBlob(opts.blob, file.name);
        return finish('downloaded');
    }
    return finish('unavailable');
}

/**
 * Hand a PNG to the share sheet.
 *
 * File sharing has to be possible first. On Android we then ask canShare
 * whether files, title, text, and url can travel together. If that payload
 * is rejected, try text without url, then the file alone. iOS stays
 * files-only: mixing text or url makes WhatsApp's browser throw away the
 * whole sheet, and Save Image is the only way into Photos.
 */
async function sharePngFile(opts: {
    file: File;
    title?: string;
    text?: string;
    url?: string;
}): Promise<'shared' | 'cancelled' | 'failed'> {
    const attempts: ShareData[] = [];
    if (!isIOS() && (opts.text || opts.url)) {
        const rich: ShareData = { files: [opts.file], title: opts.title };
        if (opts.text) rich.text = opts.text;
        if (opts.url) rich.url = opts.url;
        attempts.push(rich);
        if (opts.text && opts.url) {
            attempts.push({ files: [opts.file], text: opts.text, title: opts.title });
        }
    }
    attempts.push({ files: [opts.file], title: opts.title });

    for (const data of attempts) {
        if (!canShareData(data)) continue;
        try {
            await navigator.share(data);
            return 'shared';
        } catch (e) {
            if (e instanceof Error && e.name === 'AbortError') return 'cancelled';
        }
    }
    return 'failed';
}
