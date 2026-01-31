import { FrameConfig } from '../../types';

export interface RenderContext {
    ctx: CanvasRenderingContext2D;
    centerX: number;
    centerY: number;
    radius: number;
    frame: FrameConfig;
}

export interface IFrameRenderer {
    /**
     * Creates the clipping path for the user image and background.
     * Must call ctx.closePath() at the end.
     */
    createPath(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number): void;

    /**
     * Draws the stylistic frame overlay (borders, effects, etc).
     */
    drawFrame(context: RenderContext): void;
}
