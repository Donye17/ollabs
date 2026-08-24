import { FrameType } from '@/lib/types';
import { IFrameRenderer, RenderContext } from './types';
import { CANVAS_SIZE } from '@/lib/constants';

// --- Overlay image cache, keyed by URL rather than held on a renderer ---
//
// FrameRendererFactory caches one renderer per frame type and hands that same
// instance to every preview on the page. Anything a renderer stores on `this`
// is therefore shared by all of them. When ImageFrameRenderer kept the current
// image in an instance field, two campaigns with different overlays would each
// see the other's URL there, decide their own image was stale, reload it, fire
// onImageLoad, re-render, and knock the other one out again. That is the loop
// that never settles and never paints — the homepage carousel and the Explore
// grid both hit it as soon as more than one custom-image frame is on screen.
//
// Keying by URL puts the state on the image, where it belongs, and turns the
// contention into sharing: the second preview of the same overlay reuses the
// first one's decode instead of restarting it.
const overlayImages = new Map<string, HTMLImageElement>();

// Callbacks waiting on a URL that is still in flight. Fired once and cleared,
// so a render pass that finds a loaded image never schedules another one.
const overlayWaiters = new Map<string, Set<() => void>>();

// Cut-out composites cost an offscreen canvas each, so they are capped. Explore
// can show 60 campaigns and an uncapped map would pin that much canvas memory
// on a phone for the rest of the session.
const COMPOSITE_CACHE_LIMIT = 24;
const composites = new Map<string, HTMLCanvasElement>();

function rememberComposite(key: string, canvas: HTMLCanvasElement): void {
    if (composites.size >= COMPOSITE_CACHE_LIMIT) {
        const oldest = composites.keys().next().value;
        if (oldest !== undefined) composites.delete(oldest);
    }
    composites.set(key, canvas);
}

// Returns the shared image for a URL, starting the load on first request.
// `onLoad` is registered only while the image is genuinely still loading, which
// is what keeps the caller's re-render from becoming a treadmill.
function loadOverlay(url: string, onLoad?: () => void): HTMLImageElement {
    const existing = overlayImages.get(url);
    if (existing) {
        if (!existing.complete && onLoad) overlayWaiters.get(url)?.add(onLoad);
        return existing;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const waiting = new Set<() => void>();
    if (onLoad) waiting.add(onLoad);
    overlayWaiters.set(url, waiting);

    const flush = () => {
        const listeners = overlayWaiters.get(url);
        overlayWaiters.delete(url);
        listeners?.forEach((fn) => fn());
    };
    img.onload = flush;
    // A failed image stays in the cache as a complete, zero-width entry. Every
    // later draw skips it without registering a waiter, so a broken URL costs
    // one failed request rather than an endless retry loop.
    img.onerror = flush;

    img.src = url;
    overlayImages.set(url, img);
    return img;
}

/**
 * Warm the shared overlay cache before Explore/home thumbs paint. Without this
 * the first screen flashes a gray silhouette until each custom PNG finishes
 * decoding. Call with the eager window only (first ~8), not the full grid.
 */
export function prefetchFrameOverlays(imageUrls: (string | null | undefined)[]): void {
    if (typeof window === 'undefined') return;
    for (const url of imageUrls) {
        if (typeof url === 'string' && url.trim()) loadOverlay(url.trim());
    }
}

// --- Base Helper for standard shapes ---
abstract class BaseShapeRenderer implements IFrameRenderer {
    abstract createPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void;

    drawFrame(context: RenderContext): void {
        const { ctx, centerX, centerY, radius, frame } = context;

        ctx.save();
        const scale = radius / (CANVAS_SIZE / 2);
        const lineWidth = frame.width * 2 * scale;
        const strokeRadius = radius - (lineWidth / 2);

        this.createPath(ctx, centerX, centerY, strokeRadius);

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Default stroke style
        ctx.strokeStyle = frame.color1;

        // Apply shared styles (Gradients, Textures, Dashes)
        this.applyStyle(context);

        ctx.stroke();
        ctx.restore();
    }

    // Hook for subclasses to apply specific styles
    protected applyStyle(context: RenderContext): void {
        const { ctx, frame, radius, centerX, centerY } = context;

        // 1. Texture Priority (Custom Image)
        //
        // Shares the same URL-keyed cache as ImageFrameRenderer. It used to keep
        // a separate static map whose onload did nothing, so a textured frame
        // stayed unpainted until something else happened to trigger a redraw.
        // Passing onImageLoad through means it paints itself when it arrives.
        if (frame.imageUrl) {
            const img = loadOverlay(frame.imageUrl, context.onImageLoad);

            if (img.complete && img.naturalWidth > 0) {
                const pattern = ctx.createPattern(img, 'no-repeat');
                if (pattern) {
                    const diameter = radius * 2;
                    // Scale logic same as ImageFrameRenderer
                    const scaleX = diameter / img.width;
                    const scaleY = diameter / img.height;
                    const scale = Math.max(scaleX, scaleY);

                    const matrix = new DOMMatrix();
                    const x = centerX - radius;
                    const y = centerY - radius;

                    matrix.translateSelf(x, y);
                    matrix.scaleSelf(scale, scale);
                    pattern.setTransform(matrix);

                    ctx.strokeStyle = pattern;
                    return; // Texture overrides colors
                }
            }
            // Not loaded yet (or failed): fall through and stroke frame.color1
            // as the placeholder, exactly as before.
        }
    }
}

// --- Shape Specific Implementations ---

export class CircleRenderer extends BaseShapeRenderer {
    createPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.closePath();
    }
}

export class StarRenderer extends BaseShapeRenderer {
    createPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
        const spikes = 5;
        const outerRadius = r;
        const innerRadius = r / 2;
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }
}

export class HexagonRenderer extends BaseShapeRenderer {
    createPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
        const sides = 6;
        ctx.beginPath();
        ctx.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(0));
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(cx + r * Math.cos(i * 2 * Math.PI / sides), cy + r * Math.sin(i * 2 * Math.PI / sides));
        }
        ctx.closePath();
    }
}

export class HeartRenderer extends BaseShapeRenderer {
    createPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
        const size = r;
        ctx.beginPath();
        ctx.moveTo(cx, cy - size * 0.3);
        ctx.bezierCurveTo(
            cx - size * 0.5, cy - size * 1.0,
            cx - size * 1.2, cy - size * 0.2,
            cx, cy + size * 0.9
        );
        ctx.bezierCurveTo(
            cx + size * 1.2, cy - size * 0.2,
            cx + size * 0.5, cy - size * 1.0,
            cx, cy - size * 0.3
        );
        ctx.closePath();
    }

    protected applyStyle(context: RenderContext): void {
        const { ctx, radius, frame } = context;
        if (frame.color2) {
            const gradient = ctx.createLinearGradient(0, 0, radius * 2, radius * 2); // Approximate coverage
            gradient.addColorStop(0, frame.color1);
            gradient.addColorStop(1, frame.color2);
            ctx.strokeStyle = gradient;
        }
    }
}

// --- Style Specific Overrides (extending CircleRenderer for now as most are circles) ---

export class DashedRenderer extends CircleRenderer {
    protected applyStyle(context: RenderContext): void {
        const { ctx, frame, radius } = context;
        const scale = radius / (CANVAS_SIZE / 2);
        const lineWidth = frame.width * 2 * scale;
        ctx.setLineDash([lineWidth * 2, lineWidth]);
    }
}

export class GradientRenderer extends CircleRenderer {
    protected applyStyle(context: RenderContext): void {
        const { ctx, radius, frame } = context;
        if (frame.color2) {
            // Gradient across the whole canvas size usually
            const gradient = ctx.createLinearGradient(0, 0, radius * 2, radius * 2);
            gradient.addColorStop(0, frame.color1);
            gradient.addColorStop(1, frame.color2);
            ctx.strokeStyle = gradient;
        }
    }
}

export class NeonRenderer extends CircleRenderer {
    drawFrame(context: RenderContext): void {
        const { ctx, centerX, centerY, radius, frame } = context;
        if (!frame.color2) return super.drawFrame(context);

        const scale = radius / (CANVAS_SIZE / 2);
        const lineWidth = frame.width * 2 * scale;
        const strokeRadius = radius - (lineWidth / 2);

        // Glow
        ctx.save();
        ctx.shadowColor = frame.color1;
        ctx.shadowBlur = 40;
        this.createPath(ctx, centerX, centerY, strokeRadius);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = frame.color2;
        ctx.stroke();
        ctx.restore();

        // Inner Light
        ctx.save();
        this.createPath(ctx, centerX, centerY, strokeRadius);
        ctx.lineWidth = lineWidth / 4;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
        ctx.restore();
    }
}

export class DoubleRenderer extends CircleRenderer {
    drawFrame(context: RenderContext): void {
        const { ctx, centerX, centerY, radius, frame } = context;
        const scale = radius / (CANVAS_SIZE / 2);
        const lineWidth = frame.width * 2 * scale;
        const strokeRadius = radius - (lineWidth / 2);

        // Outer
        ctx.save();
        this.createPath(ctx, centerX, centerY, strokeRadius);
        ctx.lineWidth = lineWidth / 2;
        ctx.strokeStyle = frame.color1;
        ctx.stroke();
        ctx.restore();

        // Inner
        if (frame.color2) {
            ctx.save();
            this.createPath(ctx, centerX, centerY, radius - lineWidth * 1.5);
            ctx.lineWidth = lineWidth / 3;
            ctx.strokeStyle = frame.color2;
            ctx.stroke();
            ctx.restore();
        }
    }
}

export class MemphisRenderer extends CircleRenderer {
    drawFrame(context: RenderContext): void {
        const { ctx, centerX, centerY, radius, frame } = context;
        const scale = radius / (CANVAS_SIZE / 2);
        const lineWidth = frame.width * 2 * scale;
        const strokeRadius = radius - (lineWidth / 2);

        if (frame.color2) {
            // Shadow
            ctx.save();
            const offset = lineWidth * 0.5;
            this.createPath(ctx, centerX + offset, centerY + offset, strokeRadius);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = frame.color2;
            ctx.stroke();
            ctx.restore();
        }

        // Main
        ctx.save();
        this.createPath(ctx, centerX, centerY, strokeRadius);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = frame.color1;
        ctx.stroke();
        ctx.restore();
    }
}

export class GeometricRenderer extends CircleRenderer {
    drawFrame(context: RenderContext): void {
        const { ctx, centerX, centerY, radius, frame } = context;
        const scale = radius / (CANVAS_SIZE / 2);
        const lineWidth = frame.width * 2 * scale;

        // Inner Ring
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - (lineWidth * 1.5), 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = frame.color1;
        ctx.stroke();
        ctx.restore();

        // Dots
        const count = 36;
        const angleStep = (Math.PI * 2) / count;
        ctx.save();
        ctx.fillStyle = frame.color1;
        for (let i = 0; i < count; i++) {
            const angle = i * angleStep;
            const x = centerX + Math.cos(angle) * (radius - lineWidth / 2);
            const y = centerY + Math.sin(angle) * (radius - lineWidth / 2);

            ctx.beginPath();
            ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// Stateless by requirement: see the note on the overlay cache above, and the
// invariant documented in FrameRendererFactory. Every preview on the page runs
// through the same instance of this class.
export class ImageFrameRenderer extends CircleRenderer {
    drawFrame(context: RenderContext): void {
        const { ctx, frame, centerX, centerY, radius, onImageLoad } = context;

        if (!frame.imageUrl) {
            super.drawFrame(context);
            return;
        }

        const img = loadOverlay(frame.imageUrl, onImageLoad);
        if (!img.complete || img.naturalWidth === 0) return;

        const cutout = frame.cutoutScale ?? 0;

        // Clip the overlay to the circle so rectangular uploads never spill into the corners.
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        if (cutout > 0) {
            const d = Math.max(2, Math.round(radius * 2));
            const key = `${frame.imageUrl}|${d}|${cutout}`;
            let composited = composites.get(key);
            if (!composited) {
                const off = document.createElement('canvas');
                off.width = d;
                off.height = d;
                const octx = off.getContext('2d');
                if (octx) {
                    octx.drawImage(img, 0, 0, d, d);
                    octx.globalCompositeOperation = 'destination-out';
                    octx.beginPath();
                    octx.arc(d / 2, d / 2, (d / 2) * cutout, 0, Math.PI * 2);
                    octx.closePath();
                    octx.fill();
                    composited = off;
                    rememberComposite(key, off);
                }
            }
            if (composited) {
                ctx.drawImage(composited, centerX - radius, centerY - radius, radius * 2, radius * 2);
            }
        } else {
            ctx.drawImage(img, centerX - radius, centerY - radius, radius * 2, radius * 2);
        }

        ctx.restore();
    }
}
