import { FrameType } from '../../types';
import { IFrameRenderer, RenderContext } from './types';

// --- Base Helper for standard shapes ---
abstract class BaseShapeRenderer implements IFrameRenderer {
    abstract createPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void;

    drawFrame(context: RenderContext): void {
        const { ctx, centerX, centerY, radius, frame } = context;

        ctx.save();
        const lineWidth = frame.width * 2;
        const strokeRadius = radius - (lineWidth / 2);

        // Define path for the stroke
        this.createPath(ctx, centerX, centerY, strokeRadius);

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = frame.color1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        this.applyStyle(context);

        ctx.stroke();
        ctx.restore();
    }

    // Hook for subclasses to apply specific styles (dash, gradient, shadow) before stroke
    protected applyStyle(context: RenderContext): void {
        // Default is solid color1, already set in drawFrame
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
        const { ctx, frame } = context;
        const lineWidth = frame.width * 2;
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

        const lineWidth = frame.width * 2;
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
        const lineWidth = frame.width * 2;
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
        const lineWidth = frame.width * 2;
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
        const lineWidth = frame.width * 2;

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
