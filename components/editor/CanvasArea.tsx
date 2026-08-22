import React, { useEffect, useCallback, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { FrameRendererFactory } from '../renderer/FrameRendererFactory';
import { CANVAS_SIZE, DISPLAY_SIZE } from '@/lib/constants';
import { FrameConfig, FrameType, Position } from '@/lib/types';

interface CanvasAreaProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    imageObject: HTMLImageElement | null;
    selectedFrame: FrameConfig;
    position: Position;
    scale: number;
    rotation: number;
    isDragOver: boolean;
    interactionMode: 'none' | 'pan';

    // Event Handlers
    onMouseDown: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    canvasRef,
    imageObject,
    selectedFrame,
    position,
    scale,
    rotation,
    isDragOver,
    interactionMode,
    onMouseDown, onMouseMove, onMouseUp, onMouseLeave,
    onTouchStart, onTouchMove, onTouchEnd, onTouchCancel,
    onDragOver, onDragLeave, onDrop
}) => {
    const [imgTick, setImgTick] = useState(0);

    // Drawing Logic (Copied from original Editor.tsx but scoped)
    //
    // This used to take an elapsed-time argument and be driven by a
    // requestAnimationFrame loop for the motion effects. With those gone the
    // canvas only ever needs repainting when something in the deps changes, so
    // the loop is gone and the effect below is the single repaint path.
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;
        const radius = CANVAS_SIZE / 2;

        const renderer = FrameRendererFactory.getRenderer(selectedFrame.type);

        // 1. Draw Background
        ctx.save();
        renderer.createPath(ctx, centerX, centerY, radius);
        ctx.fillStyle = '#EAE6DC';
        ctx.fill();
        ctx.restore();

        // 2. Draw Image, then mask with an anti-aliased path fill (destination-in)
        // for a smooth edge instead of a hard clip().
        if (imageObject) {
            ctx.save();
            const imgWidth = imageObject.width;
            const imgHeight = imageObject.height;
            const scaleRatio = Math.max((radius * 2) / imgWidth, (radius * 2) / imgHeight);
            const drawWidth = imgWidth * scaleRatio * scale;
            const drawHeight = imgHeight * scaleRatio * scale;
            const imageCenterX = centerX + position.x;
            const imageCenterY = centerY + position.y;
            ctx.translate(imageCenterX, imageCenterY);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(imageObject, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();

            ctx.save();
            ctx.globalCompositeOperation = 'destination-in';
            renderer.createPath(ctx, centerX, centerY, radius);
            ctx.fill();
            ctx.restore();
        }

        // 3. Draw Frame Overlay (plus curved caption)
        FrameRendererFactory.render({ ctx, centerX, centerY, radius, frame: selectedFrame, onImageLoad: () => setImgTick((t) => t + 1) });
    }, [canvasRef, imageObject, position, scale, rotation, selectedFrame]);

    // The only repaint path: runs on mount, on any drawing input changing, and
    // again when a custom frame image finishes loading.
    useEffect(() => { draw(); }, [imgTick, draw]);

    return (
        <div
            className={`relative group rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isDragOver ? 'scale-110 ring-8 ring-primary/50 shadow-[0_20px_50px_rgba(37,99,235,0.5)]' : 'scale-100 bg-cream backdrop-blur-3xl shadow-2xl shadow-black/50'}`}
            style={{
                width: DISPLAY_SIZE,
                height: DISPLAY_SIZE,
                // Without this the browser claims a vertical drag for scrolling
                // before onTouchMove's preventDefault can run, so dragging a photo
                // on a phone scrolled the builder page instead of moving the photo.
                // 'none' rather than 'pan-x': both axes belong to the pan.
                touchAction: 'none',
                cursor: imageObject ? (interactionMode !== 'none' ? 'grabbing' : 'grab') : 'default',
                borderRadius: selectedFrame.type === FrameType.STAR || selectedFrame.type === FrameType.HEXAGON || selectedFrame.type === FrameType.HEART ? '0%' : '9999px'
            }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            title={imageObject ? "Drag to move, Scroll/Pinch to zoom" : "Tap to add a photo"}
        >
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="w-full h-full object-contain pointer-events-none drop-shadow-2xl" />
            {!imageObject && !isDragOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted pointer-events-none p-4 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-cream border-2 border-dashed border-ink/10 flex items-center justify-center mb-4 group-hover:border-brand/50 group-hover:bg-brand/10 transition-all duration-300">
                        <Upload className="w-8 h-8 text-muted group-hover:text-brand transition-colors" />
                    </div>
                    <span className="text-base font-bold text-ink/80 tracking-wide mb-1">Start creating</span>
                    <span className="text-xs text-muted md:hidden">Tap to add a photo</span>
                    <span className="text-xs text-muted hidden md:inline">Click or drag a photo here</span>
                </div>
            )}
            {isDragOver && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] animate-pulse" />
                    <div className="relative bg-primary text-ink px-8 py-4 rounded-2xl shadow-xl shadow-primary/40 font-bold font-heading flex items-center gap-3 animate-bounce">
                        <ImageIcon size={28} /> <span className="text-lg">Drop image</span>
                    </div>
                </div>
            )}
        </div>
    );
};
