import { RenderContext } from './types';

// Relative luminance of a hex color, used to pick a legible halo.
function isLight(hex: string): boolean {
    const m = hex.replace('#', '');
    if (m.length < 6) return true;
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return lum > 0.6;
}

// Draws a single line of text along a circular arc, upright and centered.
function drawArcText(
    ctx: CanvasRenderingContext2D,
    text: string,
    cx: number,
    cy: number,
    radius: number,
    fontSize: number,
    bottom: boolean,
) {
    const spacing = fontSize * 0.08;
    const widths = text.split('').map((c) => ctx.measureText(c).width);
    const arcWidth = widths.reduce((a, w) => a + w + spacing, 0);
    const totalAngle = arcWidth / radius;

    ctx.save();
    ctx.translate(cx, cy);

    if (!bottom) {
        // Top arc, letters left to right, centered at the top of the circle.
        // With translate(0, -radius), angle 0 sits at the top; letters fan out from center.
        let angle = -totalAngle / 2;
        for (let i = 0; i < text.length; i++) {
            const w = widths[i];
            angle += (w / 2 + spacing / 2) / radius;
            ctx.save();
            ctx.rotate(angle);
            ctx.translate(0, -radius);
            drawGlyph(ctx, text[i]);
            ctx.restore();
            angle += (w / 2 + spacing / 2) / radius;
        }
    } else {
        // Bottom arc, letters left to right, upright.
        // With translate(0, radius), angle 0 sits at the bottom; go from +half to -half.
        // No extra flip: at the bottom the glyph is already upright (its top points up).
        let angle = totalAngle / 2;
        for (let i = 0; i < text.length; i++) {
            const w = widths[i];
            angle -= (w / 2 + spacing / 2) / radius;
            ctx.save();
            ctx.rotate(angle);
            ctx.translate(0, radius);
            drawGlyph(ctx, text[i]);
            ctx.restore();
            angle -= (w / 2 + spacing / 2) / radius;
        }
    }

    ctx.restore();
}

function drawGlyph(ctx: CanvasRenderingContext2D, ch: string) {
    if (ctx.lineWidth > 0) ctx.strokeText(ch, 0, 0);
    ctx.fillText(ch, 0, 0);
}

// Renders frame.caption as curved text hugging the ring.
export function drawCaption(context: RenderContext): void {
    const { ctx, centerX, centerY, radius, frame } = context;
    const cap = frame.caption;
    if (!cap || !cap.text || !cap.text.trim()) return;

    const text = cap.text.trim().slice(0, 42);
    const bottom = cap.position !== 'top';
    const sizeMult = Math.max(0.6, Math.min(1.6, cap.size ?? 1));
    const fontSize = radius * 0.1 * sizeMult;
    const textRadius = radius - fontSize * 0.82;
    const color = cap.color || '#ffffff';

    ctx.save();
    ctx.font = `800 ${fontSize}px "Bricolage Grotesque", Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    // Contrasting halo so the slogan is legible over any ring color.
    ctx.lineJoin = 'round';
    ctx.lineWidth = fontSize * 0.16;
    ctx.strokeStyle = isLight(color) ? 'rgba(6,20,31,0.45)' : 'rgba(255,255,255,0.55)';

    drawArcText(ctx, text, centerX, centerY, textRadius, fontSize, bottom);
    ctx.restore();
}
