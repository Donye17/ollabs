
import { FrameType } from '@/lib/types';
import { IFrameRenderer, RenderContext } from './types';
import { drawCaption } from './caption';
import {
    CircleRenderer,
    StarRenderer,
    HexagonRenderer,
    HeartRenderer,
    DashedRenderer,
    GradientRenderer,
    NeonRenderer,
    DoubleRenderer,
    MemphisRenderer,
    GeometricRenderer,
    ImageFrameRenderer
} from './strategies';

class NoneRenderer extends CircleRenderer {
    drawFrame(context: RenderContext): void {
        // Do nothing
    }
}

export class FrameRendererFactory {
    private static renderers: Map<FrameType, IFrameRenderer> = new Map();

    static getRenderer(type: FrameType): IFrameRenderer {
        if (this.renderers.has(type)) {
            return this.renderers.get(type)!;
        }

        const renderer = this.createRenderer(type);
        this.renderers.set(type, renderer);
        return renderer;
    }

    // Draws the frame overlay plus any curved caption. Use this everywhere a
    // frame is rendered so the slogan shows consistently (builder, previews,
    // supporter page, and the exported PNG).
    static render(context: RenderContext): void {
        this.getRenderer(context.frame.type as FrameType).drawFrame(context);
        drawCaption(context);
    }

    private static createRenderer(type: FrameType): IFrameRenderer {
        switch (type) {
            case FrameType.NONE: return new NoneRenderer();
            case FrameType.SOLID: return new CircleRenderer();
            case FrameType.DASHED: return new DashedRenderer();
            case FrameType.GRADIENT: return new GradientRenderer();
            case FrameType.NEON: return new NeonRenderer();
            case FrameType.DOUBLE: return new DoubleRenderer();
            case FrameType.MEMPHIS: return new MemphisRenderer();
            case FrameType.GEOMETRIC: return new GeometricRenderer();
            case FrameType.STAR: return new StarRenderer();
            case FrameType.HEART: return new HeartRenderer();
            case FrameType.HEXAGON: return new HexagonRenderer();
            case FrameType.CUSTOM_IMAGE: return new ImageFrameRenderer();
            default: return new CircleRenderer();
        }
    }
}
