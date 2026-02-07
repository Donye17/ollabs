import React, { useEffect, useCallback } from 'react';
import { Loader2, Upload, ImageIcon, Sparkles } from 'lucide-react';
import { FrameRendererFactory } from '../renderer/FrameRendererFactory';
import { CANVAS_SIZE, DISPLAY_SIZE } from '@/lib/constants';
import { FrameConfig, FrameType, StickerConfig, TextConfig, MotionEffect, Position } from '@/lib/types';
import { getIconSvg } from '@/lib/utils';

interface CanvasAreaProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    imageObject: HTMLImageElement | null;
    selectedFrame: FrameConfig;
    stickers: StickerConfig[];
    textLayers: TextConfig[];
    position: Position;
    scale: number;
    rotation: number;
    motionEffect: MotionEffect;
    isPlaying: boolean;
    isRecording: boolean;
    selection: string | null;
    selectedTextId: string | null;
    isDragOver: boolean;
    interactionMode: 'none' | 'drag' | 'scale' | 'rotate' | 'pan';

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

const STICKER_BASE_SIZE = 48;

export const CanvasArea: React.FC<CanvasAreaProps> = ({
    canvasRef,
    imageObject,
    selectedFrame,
    stickers,
    textLayers,
    position,
    scale,
    rotation,
    motionEffect,
    isPlaying,
    isRecording,
    selection,
    selectedTextId,
    isDragOver,
    interactionMode,
    onMouseDown, onMouseMove, onMouseUp, onMouseLeave,
    onTouchStart, onTouchMove, onTouchEnd, onTouchCancel,
    onDragOver, onDragLeave, onDrop
}) => {

    // Drawing Logic (Copied from original Editor.tsx but scoped)
    const draw = useCallback((time: number = 0) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        const centerX = CANVAS_SIZE / 2;
        const centerY = CANVAS_SIZE / 2;
        const radius = CANVAS_SIZE / 2;

        const renderer = FrameRendererFactory.getRenderer(selectedFrame.type);

        // 1. Draw Background
        ctx.save();
        renderer.createPath(ctx, centerX, centerY, radius);
        ctx.fillStyle = '#334155';
        ctx.fill();
        ctx.restore();

        // 2. Draw Image (Masked)
        if (imageObject) {
            ctx.save();
            renderer.createPath(ctx, centerX, centerY, radius);
            ctx.clip();
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
        }

        // 3. Draw Frame Overlay
        if (selectedFrame.type !== FrameType.NONE) {
            renderer.drawFrame({ ctx, centerX, centerY, radius, frame: selectedFrame });
        }

        // 4. Draw Stickers
        stickers.forEach(sticker => {
            const img = new Image();
            img.src = getIconSvg(sticker.icon);
            let effectScale = 1;
            let effectRotation = 0;
            let effectX = 0;
            let effectY = 0;
            if (motionEffect === 'pulse') {
                effectScale = 1 + Math.sin(time / 200) * 0.15;
            } else if (motionEffect === 'spin') {
                effectRotation = (time / 5) % 360;
            } else if (motionEffect === 'glitch') {
                if (Math.random() > 0.8) {
                    effectX = (Math.random() - 0.5) * 10;
                    effectY = (Math.random() - 0.5) * 10;
                }
            }
            ctx.save();
            ctx.translate(sticker.x + centerX + effectX, sticker.y + centerY + effectY);
            ctx.rotate(((sticker.rotation + effectRotation) * Math.PI) / 180);
            const sSize = STICKER_BASE_SIZE * sticker.scale * effectScale;
            ctx.drawImage(img, -sSize / 2, -sSize / 2, sSize, sSize);
            if (selection === sticker.id && !isPlaying && !isRecording) {
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.setLineDash([]);
                ctx.strokeRect(-sSize / 2, -sSize / 2, sSize, sSize);
            }
            ctx.restore();
        });

        // 5. Draw Text Layers
        textLayers.forEach(text => {
            ctx.save();
            ctx.font = `${text.fontSize}px "${text.fontFamily}", sans-serif`;
            ctx.fillStyle = text.color;
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            const radius = (CANVAS_SIZE / 2) - 20;
            const characters = text.text.split('');
            const totalAngle = ctx.measureText(text.text).width / radius;
            let startAngle = (text.rotation * Math.PI) / 180;
            if (text.align === 'center') startAngle -= totalAngle / 2;
            if (text.align === 'right') startAngle -= totalAngle;
            characters.forEach((char) => {
                const charWidth = ctx.measureText(char).width;
                const charAngle = charWidth / radius;
                const theta = startAngle + charAngle / 2;
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(theta + Math.PI / 2);
                ctx.translate(0, -radius);
                ctx.fillText(char, 0, 0);
                ctx.restore();
                startAngle += charAngle;
            });
            ctx.restore();
        });

        // Rain Effect
        if (motionEffect === 'rain') {
            ctx.save();
            ctx.strokeStyle = 'rgba(173, 216, 230, 0.5)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 20; i++) {
                const rx = ((time + i * 100) % CANVAS_SIZE);
                const ry = ((time * 2 + i * 50) % CANVAS_SIZE);
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 5, ry + 15);
                ctx.stroke();
            }
            ctx.restore();
        }
    }, [imageObject, position, scale, rotation, selectedFrame, isDragOver, stickers, selection, motionEffect, isPlaying, isRecording, textLayers, selectedTextId]);

    // Animation Loop
    const requestRef = React.useRef<number | null>(null);
    const startTimeRef = React.useRef<number>(0);

    const animate = useCallback((time: number) => {
        if (startTimeRef.current === 0) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        draw(elapsed);
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(animate);
        }
    }, [draw, isPlaying]);

    useEffect(() => {
        if (isPlaying && motionEffect !== 'none') {
            startTimeRef.current = 0;
            requestRef.current = requestAnimationFrame(animate);
        } else {
            draw(0);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, motionEffect, animate, draw]);

    return (
        <div
            className={`relative group rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isDragOver ? 'scale-110 ring-8 ring-primary/50 shadow-[0_20px_50px_rgba(37,99,235,0.5)]' : 'scale-100 bg-slate-900/50 backdrop-blur-3xl shadow-2xl shadow-black/50'}`}
            style={{
                width: DISPLAY_SIZE,
                height: DISPLAY_SIZE,
                cursor: imageObject ? (interactionMode !== 'none' ? 'grabbing' : 'grab') : 'default',
                borderRadius: selectedFrame.type === FrameType.STAR || selectedFrame.type === FrameType.HEXAGON || selectedFrame.type === FrameType.HEART ? '0%' : '9999px'
            }}
            onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchCancel}
            onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            title={imageObject ? "Drag to move, Scroll/Pinch to zoom" : "Drop an image here"}
        >
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="w-full h-full object-contain pointer-events-none drop-shadow-2xl" />
            {!imageObject && !isDragOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 pointer-events-none p-4 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center mb-4 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-300">
                        <Upload className="w-8 h-8 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-base font-bold text-zinc-300 tracking-wide mb-1">Start Creating</span>
                    <span className="text-xs text-zinc-500">Drag & Drop an image here</span>
                </div>
            )}
            {isDragOver && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] animate-pulse" />
                    <div className="relative bg-primary text-white px-8 py-4 rounded-2xl shadow-xl shadow-primary/40 font-bold font-heading flex items-center gap-3 animate-bounce">
                        <ImageIcon size={28} /> <span className="text-lg">Drop Image</span>
                    </div>
                </div>
            )}
        </div>
    );
};
