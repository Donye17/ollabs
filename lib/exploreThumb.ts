import { upload } from '@vercel/blob/client';

const THUMB = 256;

/**
 * Small public JPEG of the framed result for Explore thumbnails. Uploaded when
 * a supporter saves so the grid can rotate real faces from campaign_uses.
 * Failures are silent; the save still counts without a photo.
 */
export async function uploadExploreThumb(canvas: HTMLCanvasElement): Promise<string | null> {
    const off = document.createElement('canvas');
    off.width = THUMB;
    off.height = THUMB;
    const ctx = off.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(canvas, 0, 0, THUMB, THUMB);
    const blob = await new Promise<Blob | null>((resolve) => off.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob) return null;

    try {
        const uploaded = await upload(`explore-${Date.now()}.jpg`, blob, {
            access: 'public',
            handleUploadUrl: '/api/upload',
        });
        return uploaded.url;
    } catch (e) {
        console.error('explore thumb upload failed', e);
        return null;
    }
}
