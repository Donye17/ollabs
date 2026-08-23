/**
 * Detect whether a custom frame PNG has a meaningful transparent hole.
 *
 * Opaque uploads (JPEG logos, flattened PNGs) still "work" via the cutout
 * slider, but organizers often expect a designed transparent center. Warn
 * inline before publish; do not hard-block unless detection is rock solid.
 */

export type FrameAlphaResult = {
    /** True when the image has little/no usable transparency for a photo window. */
    opaque: boolean;
    /** Fraction of sampled pixels with alpha below the hole threshold (0–1). */
    holeRatio: number;
};

const HOLE_ALPHA = 40;
/** Below this share of transparent samples we treat the frame as opaque. */
const MIN_HOLE_RATIO = 0.02;

/**
 * Sample a downscaled bitmap. Prefer the center disc (where the photo sits)
 * so a transparent border alone does not silence the warning.
 */
export async function assessFrameTransparency(
    source: HTMLImageElement | ImageBitmap | string
): Promise<FrameAlphaResult> {
    let bitmap: ImageBitmap | null = null;
    let img: HTMLImageElement | null = null;

    try {
        if (typeof source === 'string') {
            img = await loadImage(source);
            bitmap = await createImageBitmap(img);
        } else if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
            bitmap = source;
        } else {
            bitmap = await createImageBitmap(source as HTMLImageElement);
        }

        const maxSide = 96;
        const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
        const w = Math.max(8, Math.round(bitmap.width * scale));
        const h = Math.max(8, Math.round(bitmap.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return { opaque: false, holeRatio: 1 };

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(bitmap, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        // Photo window is roughly the inner 62% by default on create.
        const r = Math.min(w, h) * 0.35;
        const r2 = r * r;

        let samples = 0;
        let holes = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const dx = x + 0.5 - cx;
                const dy = y + 0.5 - cy;
                if (dx * dx + dy * dy > r2) continue;
                const a = data[(y * w + x) * 4 + 3];
                samples += 1;
                if (a < HOLE_ALPHA) holes += 1;
            }
        }

        if (samples === 0) return { opaque: false, holeRatio: 1 };
        const holeRatio = holes / samples;
        return { opaque: holeRatio < MIN_HOLE_RATIO, holeRatio };
    } catch {
        // Network/CORS failure: do not warn falsely.
        return { opaque: false, holeRatio: 1 };
    } finally {
        if (bitmap && typeof bitmap.close === 'function') {
            try {
                bitmap.close();
            } catch { /* ignore */ }
        }
    }
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('frame image failed to load'));
        img.src = url;
    });
}
