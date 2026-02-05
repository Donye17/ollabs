"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RefreshCcw, Image as ImageIcon, Maximize, RotateCw, Share2, User, Loader2, Sparkles } from 'lucide-react';
import { upload } from '@vercel/blob/client';
// @ts-ignore
import ColorThief from 'colorthief';

// Helper
const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');

import GIF from 'gif.js';
import { CANVAS_SIZE, DISPLAY_SIZE } from '@/lib/constants';
import { FrameConfig, FrameType, Position, StickerConfig, MotionEffect, TextConfig } from '@/lib/types';
import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { PublishModal } from './PublishModal';
import { authClient } from '../lib/auth-client';

// Helper for SVGs
const getIconSvg = (name: string) => {
  const svgs: Record<string, string> = {
    'verified': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%233b82f6" stroke="white" stroke-width="2"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    'zap': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23eab308" stroke="white" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    'heart': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%23ec4899" stroke="white" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    'star': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="%238b5cf6" stroke="white" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  };
  return svgs[name] || svgs['verified'];
};

interface EditorProps {
  imageSrc: string | null;
  onImageSelect: (file: File) => void;
  selectedFrame: FrameConfig;
  onReset: () => void;
  onPreviewUpdate: (dataUrl: string) => void;

  // Lifted State Props
  stickers: StickerConfig[];
  onStickersChange: (stickers: StickerConfig[]) => void;
  textLayers: TextConfig[];
  onTextLayersChange: (layers: TextConfig[]) => void;
  motionEffect: MotionEffect;
  isPlaying: boolean;

  // Interaction State (Shared)
  selection: string | null;
  onSelectSticker: (id: string | null) => void;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;

  // Export Ref
  // Export Ref
  editorRef?: React.RefObject<{ exportGif: () => void; getDominantColors: () => Promise<string[]> } | null>;

  // Background Removal
  onRemoveBackground?: () => void;
  isRemovingBackground?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  imageSrc,
  onImageSelect,
  selectedFrame,
  onReset,
  onPreviewUpdate,
  stickers,
  onStickersChange,
  textLayers,
  onTextLayersChange,
  motionEffect,
  isPlaying,
  selection,
  onSelectSticker,
  selectedTextId,
  onSelectText,
  editorRef,
  onRemoveBackground,
  isRemovingBackground
}) => {
  const { data: session } = authClient.useSession();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const [isRecording, setIsRecording] = useState(false);
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Interaction State
  const [interactionMode, setInteractionMode] = useState<'none' | 'drag' | 'scale' | 'rotate' | 'pan'>('none');
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [initialStickerState, setInitialStickerState] = useState<{ x: number, y: number, scale: number, rotation: number } | null>(null);

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null);

  // Constants
  const STICKER_BASE_SIZE = 48; // Base width/height of sticker svgs

  // ... inside component

  // Load image object when source changes
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Enable CORS for analysis
      img.src = imageSrc;
      img.onload = () => {
        setImageObject(img);
        // ... (rest of onload)
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
    } else {
      setImageObject(null);
    }
  }, [imageSrc]);

  // ... inside useImperativeHandle
  React.useImperativeHandle(editorRef, () => ({
    exportGif: handleExportGif,
    getDominantColors: () => {
      return new Promise<string[]>((resolve, reject) => {
        if (!imageObject) {
          reject("No image loaded");
          return;
        }
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(imageObject, 3); // Get top 3
          if (palette && palette.length > 0) {
            const hexPalette = palette.map((rgb: number[]) => rgbToHex(rgb[0], rgb[1], rgb[2]));
            resolve(hexPalette);
          } else {
            reject("No colors found");
          }
        } catch (e) {
          console.error("ColorThief failed", e);
          // Fallback or reject
          reject(e);
        }
      });
    }
  }));

  // Handle Auto Fit
  const handleAutoFit = () => {
    if (!imageObject) return;
    const radius = CANVAS_SIZE / 2;
    const coverRatio = Math.max((radius * 2) / imageObject.width, (radius * 2) / imageObject.height);
    const containRatio = Math.min((radius * 2) / imageObject.width, (radius * 2) / imageObject.height);
    const newScale = containRatio / coverRatio;
    setScale(newScale);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Main drawing logic
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

      // Force curved text always
      // Force curved text always
      // Radius calculation: Center text on the frame ring (approx 15-20px from edge depending on frame)
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

  // Export GIF
  const handleExportGif = async () => {
    setIsRecording(true);
    onSelectSticker(null);
    onSelectText(null);
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      workerScript: '/gif.worker.js',
    });
    const FPS = 30;
    const DURATION_SEC = 2;
    const TOTAL_FRAMES = FPS * DURATION_SEC;
    const TIME_PER_FRAME = 1000 / FPS;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      draw(i * TIME_PER_FRAME);
      const canvas = canvasRef.current;
      if (canvas) {
        gif.addFrame(canvas, { copy: true, delay: TIME_PER_FRAME });
      }
      await new Promise(r => setTimeout(r, 0));
    }
    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `ollabs-motion-${Date.now()}.gif`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsRecording(false);
      draw(0);
    });
    gif.render();
  };

  React.useImperativeHandle(editorRef, () => ({
    exportGif: handleExportGif,
    getDominantColors: () => {
      return new Promise<string[]>((resolve, reject) => {
        if (!imageObject) {
          reject("No image loaded");
          return;
        }
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(imageObject, 3);
          if (palette && palette.length > 0) {
            // @ts-ignore
            const hexPalette = palette.map((rgb: number[]) => rgbToHex(rgb[0], rgb[1], rgb[2]));
            resolve(hexPalette);
          } else {
            reject("No colors found");
          }
        } catch (e) {
          reject(e);
        }
      });
    }
  }));

  // Static preview update
  useEffect(() => {
    if (!isPlaying) {
      draw(0);
      const timeout = setTimeout(() => {
        if (canvasRef.current) {
          onPreviewUpdate(canvasRef.current.toDataURL('image/png', 0.5));
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [draw, isPlaying, onPreviewUpdate]);

  // Event Handlers
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) onImageSelect(file);
  };

  const getMousePos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const rotatePoint = (px: number, py: number, cx: number, cy: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: (cos * (px - cx)) - (sin * (py - cy)) + cx,
      y: (sin * (px - cx)) + (cos * (py - cy)) + cy
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const { x, y } = getMousePos(e);
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    if (selection) {
      const s = stickers.find(st => st.id === selection);
      if (s) {
        const sX = centerX + s.x;
        const sY = centerY + s.y;
        const sSize = STICKER_BASE_SIZE * s.scale;
        const localM = rotatePoint(x, y, sX, sY, -s.rotation);
        const localX = localM.x - sX;
        const localY = localM.y - sY;

        if (Math.abs(localX) <= 10 && Math.abs(localY - (-sSize / 2 - 20)) <= 10) {
          setInteractionMode('rotate');
          setInitialStickerState({ ...s });
          return;
        }
        const half = sSize / 2;
        const corners = [{ x: -half, y: -half }, { x: half, y: -half }, { x: half, y: half }, { x: -half, y: half }];
        for (let c of corners) {
          if (Math.abs(localX - c.x) <= 10 && Math.abs(localY - c.y) <= 10) {
            setInteractionMode('scale');
            setDragStart({ x, y });
            setInitialStickerState({ ...s });
            return;
          }
        }
      }
    }

    let hitStickerId: string | null = null;
    let hitTextId: string | null = null;
    const ctx = canvasRef.current?.getContext('2d');

    for (let i = textLayers.length - 1; i >= 0; i--) {
      const t = textLayers[i];
      const tX = centerX + t.x;
      const tY = centerY + t.y;
      const localM = rotatePoint(x, y, tX, tY, -t.rotation);
      const localX = localM.x - tX;
      const localY = localM.y - tY;
      if (ctx) {
        ctx.font = `${t.fontSize}px "${t.fontFamily}", sans-serif`;
        const metrics = ctx.measureText(t.text);
        const width = metrics.width;
        const height = t.fontSize;
        let xStart = 0;
        if (t.align === 'center') xStart = -width / 2;
        if (t.align === 'right') xStart = -width;
        if (localX >= xStart && localX <= xStart + width && localY >= -height / 2 && localY <= height / 2) {
          hitTextId = t.id;
          break;
        }
      }
    }

    if (hitTextId) {
      onSelectText(hitTextId);
      onSelectSticker(null);
      setInteractionMode('drag');
      const t = textLayers.find(tl => tl.id === hitTextId)!;
      setDragStart({ x: x - t.x, y: y - t.y });
      return;
    }

    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const sX = centerX + s.x;
      const sY = centerY + s.y;
      const sSize = STICKER_BASE_SIZE * s.scale;
      const localM = rotatePoint(x, y, sX, sY, -s.rotation);
      const localX = localM.x - sX;
      const localY = localM.y - sY;
      if (Math.abs(localX) <= sSize / 2 && Math.abs(localY) <= sSize / 2) {
        hitStickerId = s.id;
        break;
      }
    }

    if (hitStickerId) {
      onSelectSticker(hitStickerId);
      onSelectText(null);
      setInteractionMode('drag');
      const s = stickers.find(st => st.id === hitStickerId)!;
      setDragStart({ x: x - s.x, y: y - s.y });
    } else {
      onSelectSticker(null);
      onSelectText(null);
      if (imageObject) {
        setInteractionMode('pan');
        setDragStart({ x: x - position.x, y: y - position.y });
      } else {
        setInteractionMode('none');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (interactionMode === 'none') return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getMousePos(e);
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    if (interactionMode === 'pan') {
      setPosition({ x: x - dragStart.x, y: y - dragStart.y });
    } else if (interactionMode === 'drag') {
      if (selection) {
        onStickersChange(stickers.map(s => s.id === selection ? { ...s, x: x - dragStart.x, y: y - dragStart.y } : s));
      } else if (selectedTextId) {
        onTextLayersChange(textLayers.map(t => t.id === selectedTextId ? { ...t, x: x - dragStart.x, y: y - dragStart.y } : t));
      }
    } else if (interactionMode === 'rotate' && selection) {
      onStickersChange(stickers.map(s => {
        if (s.id !== selection) return s;
        const sX = centerX + s.x;
        const sY = centerY + s.y;
        const angle = Math.atan2(y - sY, x - sX) * (180 / Math.PI);
        return { ...s, rotation: angle + 90 };
      }));
    } else if (interactionMode === 'scale' && selection && initialStickerState) {
      onStickersChange(stickers.map(s => {
        if (s.id !== selection) return s;
        const sX = centerX + s.x;
        const sY = centerY + s.y;
        const dist = Math.sqrt(Math.pow(x - sX, 2) + Math.pow(y - sY, 2));
        const baseRadius = (STICKER_BASE_SIZE / 2) * Math.sqrt(2);
        let newScale = dist / baseRadius;
        if (newScale < 0.2) newScale = 0.2;
        return { ...s, scale: newScale };
      }));
    }
  };

  const handleEnd = () => { setInteractionMode('none'); setInitialStickerState(null); };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => handleMouseDown(e);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => handleMouseMove(e);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `ollabs-frame-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
      {/* Canvas Container */}
      <div
        className={`relative group rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isDragOver ? 'scale-110 ring-8 ring-primary/50 shadow-[0_20px_50px_rgba(37,99,235,0.5)]' : 'scale-100 bg-slate-900/50 backdrop-blur-3xl shadow-2xl shadow-black/50'}`}
        style={{
          width: DISPLAY_SIZE,
          height: DISPLAY_SIZE,
          cursor: imageObject ? (interactionMode !== 'none' ? 'grabbing' : 'grab') : 'default',
          borderRadius: selectedFrame.type === FrameType.STAR || selectedFrame.type === FrameType.HEXAGON || selectedFrame.type === FrameType.HEART ? '0%' : '9999px'
        }}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleEnd} onTouchCancel={handleEnd}
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        title={imageObject ? "Drag to move, Scroll/Pinch to zoom" : "Drop an image here"}
      >
        <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} className="w-full h-full object-contain pointer-events-none drop-shadow-2xl" />
        {!imageObject && !isDragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
            <Upload className="w-12 h-12 mb-3 opacity-50 text-slate-400" />
            <span className="text-sm font-bold font-heading text-slate-400 tracking-wide">Drag & Drop or Upload</span>
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

      {/* Controls Bar: Upload, Set Profile, Download */}
      <div className="flex items-center gap-4 w-full px-4">
        <label className="flex-1">
          <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
          <div className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-4 px-6 rounded-xl cursor-pointer transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 font-bold font-heading select-none hover:-translate-y-0.5">
            <Upload size={20} /> <span>{imageObject ? 'Change Photo' : 'Upload Photo'}</span>
          </div>
        </label>
      </div>

      {imageObject && (
        <div className="flex gap-3 justify-center w-full px-4">
          {session && (
            <button onClick={async () => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              setIsUpdatingProfile(true);
              try {
                // 1. Convert Canvas to Blob
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.8));
                if (!blob) throw new Error("Canvas conversion failed");

                // 2. Upload to Vercel Blob (Cloud Storage)
                const { url } = await upload(`profile-${Date.now()}.png`, blob, {
                  access: 'public',
                  handleUploadUrl: '/api/upload',
                });

                // 3. Update User Profile with the Cloud URL (DB stores string, not base64)
                // @ts-ignore
                await authClient.updateUser({ image: url });

                alert("Profile picture updated!");
              } catch (e) {
                console.error("Upload failed", e);
                alert("Failed to update profile picture. Ensure you are logged in.");
              } finally {
                setIsUpdatingProfile(false);
              }
            }}
              disabled={isUpdatingProfile}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3.5 px-6 rounded-xl transition-all font-bold border border-transparent hover:border-purple-400 shadow-lg shadow-purple-900/20 disabled:opacity-50 hover:-translate-y-0.5">
              {isUpdatingProfile ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
              <span>Set Profile</span>
            </button>
          )}
          <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-white py-3.5 px-6 rounded-xl transition-all font-bold border border-white/5 hover:border-white/10 hover:-translate-y-0.5">
            <Download size={20} /> <span>Save</span>
          </button>
        </div>
      )}

      {/* Advanced Controls (Scale/Rotate for Selection or Image) */}
      {(imageObject || stickers.length > 0) && (
        <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl space-y-5 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">{selection ? 'Adjust Decoration' : 'Adjust Base Image'}</h4>
            {selection && <span className="text-[10px] text-primary font-bold font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Selected</span>}
          </div>

          {/* Magic Tools */}
          {!selection && imageObject && onRemoveBackground && (
            <button
              onClick={onRemoveBackground}
              disabled={isRemovingBackground}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 hover:border-violet-500/50 hover:from-violet-600/30 hover:to-fuchsia-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isRemovingBackground ? (
                <Loader2 size={16} className="animate-spin text-violet-300" />
              ) : (
                <Sparkles size={16} className="text-violet-300 group-hover:text-white transition-colors" />
              )}
              <span className="text-xs font-bold text-violet-200 group-hover:text-white">Magic Remove Background</span>
            </button>
          )}
          {/* Scale Control */}
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-500" />
            <input type="range" min="0.1" max="3" step="0.1"
              value={selection ? (stickers.find(s => s.id === selection)?.scale || 1) : scale}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (selection) {
                  onStickersChange(stickers.map(s => s.id === selection ? { ...s, scale: val } : s));
                } else {
                  setScale(val);
                }
              }}
              className={`flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-indigo-500'}`} />
            <ZoomIn size={16} className="text-slate-500" />
          </div>
          {/* Rotate Control */}
          <div className="flex items-center gap-3">
            <div className="relative group"><RotateCw size={16} className="text-slate-500 group-hover:text-white transition-colors" /></div>
            <input type="range" min="-180" max="180" step="1"
              value={selection ? (stickers.find(s => s.id === selection)?.rotation || 0) : rotation}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (selection) {
                  onStickersChange(stickers.map(s => s.id === selection ? { ...s, rotation: val } : s));
                } else {
                  setRotation(val);
                }
              }}
              className={`flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-purple-500'}`} />
            <span className="text-[10px] w-8 text-right font-mono text-slate-400">{selection ? (stickers.find(s => s.id === selection)?.rotation || 0) : rotation}°</span>
          </div>
          <div className="flex gap-2 pt-3 border-t border-white/5 justify-between">
            <button onClick={handleAutoFit} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 border border-transparent hover:border-white/5">
              <Maximize size={14} /> <span>Fit to Frame</span>
            </button>
            <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); setRotation(0); }} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 border border-transparent hover:border-white/5">
              <RefreshCcw size={14} /> <span>Reset All</span>
            </button>
          </div>
        </div>
      )}

      {/* Publish Modal Trigger */}
      {imageSrc && (
        <div className="mt-4">
          <button onClick={() => setIsPublishOpen(true)} className="text-sm text-slate-500 hover:text-white underline decoration-slate-700 hover:decoration-white transition-all">Publish to Community Gallery</button>
        </div>
      )}
      <PublishModal isOpen={isPublishOpen} onClose={() => setIsPublishOpen(false)} frameConfig={{ ...selectedFrame, stickers: stickers }} />
    </div>
  );
};
