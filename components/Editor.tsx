"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RefreshCcw, Image as ImageIcon, Maximize, RotateCw, Share2, User, Loader2 } from 'lucide-react';
import { CANVAS_SIZE, DISPLAY_SIZE } from '@/lib/constants';
import { FrameConfig, FrameType, Position, StickerConfig } from '@/lib/types';
import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { PublishModal } from './PublishModal';
import { authClient } from '../lib/auth-client';
import { BadgeCheck, Zap, Heart, Star, Award, Trash2 } from 'lucide-react';

// Helper for SVGs (simplified for demo - ideally this is a robust utility)
const getIconSvg = (name: string) => {
  const color = '#3b82f6'; // Default blue
  const stroke = 'white';
  // Mapping name to simplistic SVG strings for Canvas usage
  // Note: This is a hacky way to get Lucide icons into Canvas.
  // A better way is using an offscreen canvas or <img> tags converted to dataURLs.
  // For this prototype, we'll try to use a generic reliable method:
  // We can't easily get the SVG string from the React component without rendering it.
  // So for the list of stickers, we might need a map of name -> svgString.

  // Fallback: Using basic shapes if SVG parsing is too complex for this step without external libs like Canvg.
  // actually, let's use Data URLs of simple SVGs.
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
}

export const Editor: React.FC<EditorProps> = ({
  imageSrc,
  onImageSelect,
  selectedFrame,
  onReset,
  onPreviewUpdate
}) => {
  const { data: session } = authClient.useSession();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  // Stickers State
  const [stickers, setStickers] = useState<StickerConfig[]>([]);
  // Interaction State
  const [selection, setSelection] = useState<string | null>(null); // Selected Sticker ID
  const [interactionMode, setInteractionMode] = useState<'none' | 'drag' | 'scale' | 'rotate' | 'pan'>('none');
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [initialStickerState, setInitialStickerState] = useState<{ x: number, y: number, scale: number, rotation: number } | null>(null);

  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null);

  // Constants
  const HANDLE_SIZE = 10;
  const ROTATION_HANDLE_OFFSET = 30; // Distance from top of box
  const STICKER_BASE_SIZE = 48; // Base width/height of sticker svgs

  // Sync stickers from selectedFrame if present (Remix flow)
  useEffect(() => {
    if (selectedFrame.stickers) {
      setStickers(selectedFrame.stickers);
    } else {
      // Optional: Reset stickers if switching frames? 
      // Maybe not if user just changed the frame styling while keeping stickers.
      // But for a "Fresh" remix load, we want to set them.
      // We can rely on upstream not to pass stickers if it's a basic preset.
    }
  }, [selectedFrame]);

  // Load image object when source changes
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setImageObject(img);
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
    } else {
      setImageObject(null);
    }
  }, [imageSrc]);

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
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;
    const radius = CANVAS_SIZE / 2;

    // Calculate max radius for content (accounting for frame width)
    const maxRadius = radius;

    const renderer = FrameRendererFactory.getRenderer(selectedFrame.type);

    // 1. Draw Background (using Renderer's path)
    ctx.save();
    renderer.createPath(ctx, centerX, centerY, radius);
    ctx.fillStyle = '#1e293b'; // Slate 800 background
    ctx.fill();
    ctx.restore();

    // 2. Draw Image (Masked)
    if (imageObject) {
      ctx.save();
      // Apply clipping based on shape
      renderer.createPath(ctx, centerX, centerY, radius);
      ctx.clip();

      const imgWidth = imageObject.width;
      const imgHeight = imageObject.height;

      const scaleRatio = Math.max((radius * 2) / imgWidth, (radius * 2) / imgHeight);
      const drawWidth = imgWidth * scaleRatio * scale;
      const drawHeight = imgHeight * scaleRatio * scale;

      // Transform context to draw rotated image
      const imageCenterX = centerX + position.x;
      const imageCenterY = centerY + position.y;

      ctx.translate(imageCenterX, imageCenterY);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw image centered at origin (relative to translation)
      ctx.drawImage(imageObject, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

      ctx.restore();
    } else {
      // Placeholder state
      ctx.save();
      ctx.fillStyle = isDragOver ? '#3b82f6' : '#64748b';
      ctx.font = 'bold 40px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isDragOver ? '' : 'Drop Photo Here', centerX, centerY);
      ctx.restore();
    }

    // 3. Draw Frame Overlay
    if (selectedFrame.type !== FrameType.NONE) {
      renderer.drawFrame({
        ctx,
        centerX,
        centerY,
        radius,
        frame: selectedFrame
      });
    }

    // 4. Draw Stickers
    stickers.forEach(sticker => {
      const img = new Image();
      // Simple SVG data URI for now - in production we'd cache these or use a sprite sheet
      // We use a helper to get the SVG string for the icon
      img.src = getIconSvg(sticker.icon);

      ctx.save();
      ctx.translate(sticker.x + centerX, sticker.y + centerY);
      ctx.rotate((sticker.rotation * Math.PI) / 180);

      const sSize = STICKER_BASE_SIZE * sticker.scale;
      // Draw centered
      ctx.drawImage(img, -sSize / 2, -sSize / 2, sSize, sSize);

      // Draw Selection Box
      if (selection === sticker.id) {
        ctx.strokeStyle = '#3b82f6'; // Primary Blue
        ctx.lineWidth = 2;
        ctx.setLineDash([]);

        // Bounding Box
        ctx.strokeRect(-sSize / 2, -sSize / 2, sSize, sSize);

        // Corner Handles
        ctx.fillStyle = '#fff';
        const halfHandle = HANDLE_SIZE / 2 / 1.5; // Scale handle size relative to canvas

        // We actually want consistent handle size visually, but here we are in scaled/rotated context
        // To make handles constant size visually, we might need to invert scale, but let's keep it simple first
        // Or actually, handles should ignore scale? 
        // For simplicity, let's just draw them at corners.

        const corners = [
          { x: -sSize / 2, y: -sSize / 2 },
          { x: sSize / 2, y: -sSize / 2 },
          { x: sSize / 2, y: sSize / 2 },
          { x: -sSize / 2, y: sSize / 2 }
        ];

        corners.forEach(c => {
          ctx.beginPath();
          ctx.arc(c.x, c.y, 6, 0, Math.PI * 2); // 6px radius handle
          ctx.fill();
          ctx.stroke();
        });

        // Rotation Handle (Top Center + Offset)
        ctx.beginPath();
        ctx.moveTo(0, -sSize / 2);
        ctx.lineTo(0, -sSize / 2 - 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, -sSize / 2 - 20, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    });
  }, [imageObject, position, scale, rotation, selectedFrame, isDragOver, stickers, selection]);

  // Redraw and Update Preview
  useEffect(() => {
    draw();
    const timeout = setTimeout(() => {
      if (canvasRef.current) {
        onPreviewUpdate(canvasRef.current.toDataURL('image/png', 0.5));
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [draw, onPreviewUpdate]);

  // File Inputs
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };


  // Helper to get consistent mouse/touch coordinates relative to canvas
  const getMousePos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    // Scale for canvas resolution vs display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  // Helper: Rotate point around center
  const rotatePoint = (px: number, py: number, cx: number, cy: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const nx = (cos * (px - cx)) - (sin * (py - cy)) + cx;
    const ny = (sin * (px - cx)) + (cos * (py - cy)) + cy;
    return { x: nx, y: ny };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent scrolling on touch
    if ('touches' in e) {
      // e.preventDefault(); 
    }
    const { x, y } = getMousePos(e);

    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    // Check Handles for Selected Sticker FIRST
    if (selection) {
      const s = stickers.find(st => st.id === selection);
      if (s) {
        const sX = centerX + s.x;
        const sY = centerY + s.y;
        const sSize = STICKER_BASE_SIZE * s.scale;

        // We need to check transformed coordinates
        // Inverse rotate mouse pos around sticker center to check against axis-aligned box
        const localM = rotatePoint(x, y, sX, sY, -s.rotation);

        const localX = localM.x - sX;
        const localY = localM.y - sY;

        // Check Rotation Handle
        // Defined at (0, -sSize/2 - 20) with radius 10 (generous hit)
        if (Math.abs(localX) <= 10 && Math.abs(localY - (-sSize / 2 - 20)) <= 10) {
          setInteractionMode('rotate');
          setInitialStickerState({ ...s });
          return;
        }

        // Check Scale Handles (Corners) - Generic hit test for any corner
        // Corners at +/- size/2
        const half = sSize / 2;
        const corners = [
          { x: -half, y: -half }, { x: half, y: -half },
          { x: half, y: half }, { x: -half, y: half }
        ];

        for (let c of corners) {
          if (Math.abs(localX - c.x) <= 10 && Math.abs(localY - c.y) <= 10) {
            setInteractionMode('scale');
            setDragStart({ x, y }); // Keep global drag start for scale calc?
            // Better: keep track of distance from center
            setInitialStickerState({ ...s });
            return;
          }
        }
      }
    }

    // Hit Test for Sticker Bodies
    let hitStickerId: string | null = null;
    // Check in reverse order (top first)
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const sX = centerX + s.x;
      const sY = centerY + s.y;
      const sSize = STICKER_BASE_SIZE * s.scale;

      const localM = rotatePoint(x, y, sX, sY, -s.rotation);
      const localX = localM.x - sX;
      const localY = localM.y - sY;

      // Simple box test
      if (Math.abs(localX) <= sSize / 2 && Math.abs(localY) <= sSize / 2) {
        hitStickerId = s.id;
        break;
      }
    }

    if (hitStickerId) {
      setSelection(hitStickerId);
      setInteractionMode('drag');
      const s = stickers.find(st => st.id === hitStickerId)!;
      setDragStart({ x: x - s.x, y: y - s.y }); // Offset from sticker center
    } else {
      setSelection(null);
      // Pan/Move Image
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

    // Only prevent default if we are dragging
    if (e.cancelable) e.preventDefault();

    const { x, y } = getMousePos(e);
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    if (interactionMode === 'pan') {
      setPosition({ x: x - dragStart.x, y: y - dragStart.y });
    }
    else if (interactionMode === 'drag' && selection) {
      // Wait, my dragStart logic for sticker was: x - s.x (which is offset from sticker origin)
      // So new s.x should be: x - dragStart.x (if x is mouse pos relative to canvas origin)
      // But dragStart was (mouse.x - sticker.x). 
      // So sticker.x = mouse.x - dragStart.x?
      // Let's fix the dragStart logic in MouseDown to be cleaner:
      // dragStart = mouseX - stickerX. 
      // New stickerX = mouseX - dragStart. YES.
      // But wait... handleMouseDown recorded `dragStart = x - s.x`. 
      // So `s.x = x - dragStart.x`. Correct.
      const offsetX = dragStart.x;
      const offsetY = dragStart.y;
      setStickers(prev => prev.map(s =>
        s.id === selection ? { ...s, x: x - offsetX, y: y - offsetY } : s
      ));
    }
    else if (interactionMode === 'rotate' && selection) {
      setStickers(prev => prev.map(s => {
        if (s.id !== selection) return s;
        const sX = centerX + s.x;
        const sY = centerY + s.y;
        // Angle from sticker center to mouse
        const angle = Math.atan2(y - sY, x - sX) * (180 / Math.PI);
        // Snap to 45 deg? maybe later.
        // Correct logic: The handle is at -90 deg (top).
        // So we want the rotation to align the top (-90 local) to the mouse.
        // angle = mouseAngle + 90
        return { ...s, rotation: angle + 90 };
      }));
    }
    else if (interactionMode === 'scale' && selection && initialStickerState) {
      setStickers(prev => prev.map(s => {
        if (s.id !== selection) return s;
        // Scale based on distance from center
        const sX = centerX + s.x;
        const sY = centerY + s.y;
        const dist = Math.sqrt(Math.pow(x - sX, 2) + Math.pow(y - sY, 2));
        const startDist = (STICKER_BASE_SIZE * initialStickerState.scale) / 2 * Math.sqrt(2); // approximate diagonal
        // Actually better:
        // Compare current dist from center vs initial dist from center??
        // Or simpler: scale = dist / base_size * 2?
        // Let's roughly map distance to scale.
        // Edge is at size/2. Corner is at size/2 * sqrt(2).
        // So if mouse is at `dist`, then `size/2 * sqrt(2) * scale` approx `dist`.
        // `scale = dist / (size/2 * sqrt(2))`
        const baseRadius = (STICKER_BASE_SIZE / 2) * Math.sqrt(2);
        let newScale = dist / baseRadius;
        if (newScale < 0.2) newScale = 0.2;
        return { ...s, scale: newScale };
      }));
    }
  };

  const handleEnd = () => {
    setInteractionMode('none');
    setInitialStickerState(null);
  };

  // Touch wrappers to map to mouse handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => handleMouseDown(e);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => handleMouseMove(e);
  const handleTouchEnd = () => handleEnd();
  const handleTouchCancel = () => handleEnd();

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
        className={`
           relative group rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
           ${isDragOver
            ? 'scale-110 ring-8 ring-primary/50 shadow-[0_20px_50px_rgba(37,99,235,0.5)]'
            : 'scale-100 ring-4 ring-white/5 bg-slate-900/50 backdrop-blur-3xl shadow-2xl shadow-black/50'}
        `}
        style={{
          width: DISPLAY_SIZE,
          height: DISPLAY_SIZE,
          cursor: imageObject ? (interactionMode !== 'none' ? 'grabbing' : 'grab') : 'default',
          borderRadius: selectedFrame.type === FrameType.STAR || selectedFrame.type === FrameType.HEXAGON || selectedFrame.type === FrameType.HEART ? '0%' : '9999px'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onTouchCancel={handleEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title={imageObject ? "Drag to move, Scroll/Pinch to zoom" : "Drop an image here"}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
        />

        {!imageObject && !isDragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
            <Upload className="w-12 h-12 mb-3 opacity-50 text-slate-400" />
            <span className="text-sm font-bold font-heading text-slate-400 tracking-wide">Drag & Drop or Upload</span>
          </div>
        )}

        {isDragOver && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] animate-pulse" />
            <div className="absolute inset-8 rounded-full border-4 border-dashed border-white/60 animate-[spin_8s_linear_infinite]" />
            <div className="relative bg-primary text-white px-8 py-4 rounded-2xl shadow-xl shadow-primary/40 font-bold font-heading flex items-center gap-3 animate-bounce">
              <ImageIcon size={28} />
              <span className="text-lg">Drop Image</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-4 w-full px-4">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
          <div
            className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-4 px-6 rounded-xl cursor-pointer transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 font-bold font-heading select-none hover:-translate-y-0.5"
            title="Select an image from your device"
          >
            <Upload size={20} />
            <span>{imageObject ? 'Change Photo' : 'Upload Photo'}</span>
          </div>
        </label>
      </div>

      {imageObject && (
        <div className="flex gap-3 justify-center w-full px-4">
          {session && (
            <button
              onClick={async () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                setIsUpdatingProfile(true);
                try {
                  const dataUrl = canvas.toDataURL('image/png', 0.8);
                  // @ts-ignore - updateUser is available on client
                  await authClient.updateUser({
                    image: dataUrl
                  });
                  alert("Profile picture updated!");
                } catch (e) {
                  console.error(e);
                  alert("Failed to update profile picture.");
                } finally {
                  setIsUpdatingProfile(false);
                }
              }}
              disabled={isUpdatingProfile}
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3.5 px-6 rounded-xl transition-all font-bold border border-transparent hover:border-purple-400 shadow-lg shadow-purple-900/20 disabled:opacity-50 hover:-translate-y-0.5"
              title="Set as your profile picture"
            >
              {isUpdatingProfile ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
              <span>Set Profile</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-white py-3.5 px-6 rounded-xl transition-all font-bold border border-white/5 hover:border-white/10 hover:-translate-y-0.5"
            title="Download high-resolution PNG"
          >
            <Download size={20} />
            <span>Save</span>
          </button>
        </div>
      )}

      {/* Advanced Controls (Context Aware) */}
      {
        (imageObject || stickers.length > 0) && (
          <div className="w-full bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl space-y-5 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">
                {selection ? 'Adjust Decoration' : 'Adjust Base Image'}
              </h4>
              {selection && (
                <span className="text-[10px] text-primary font-bold font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Selected</span>
              )}
            </div>

            {/* Scale Control */}
            <div className="flex items-center gap-3">
              <ZoomOut size={16} className="text-slate-500" />
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={selection
                  ? (stickers.find(s => s.id === selection)?.scale || 1)
                  : scale
                }
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (selection) {
                    setStickers(prev => prev.map(s => s.id === selection ? { ...s, scale: val } : s));
                  } else {
                    setScale(val);
                  }
                }}
                className={`flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-indigo-500'}`}
                title="Scale"
              />
              <ZoomIn size={16} className="text-slate-500" />
            </div>

            {/* Rotate Control */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <RotateCw size={16} className="text-slate-500 group-hover:text-white transition-colors" />
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={selection
                  ? (stickers.find(s => s.id === selection)?.rotation || 0)
                  : rotation
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (selection) {
                    setStickers(prev => prev.map(s => s.id === selection ? { ...s, rotation: val } : s));
                  } else {
                    setRotation(val);
                  }
                }}
                className={`flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer ${selection ? 'accent-primary' : 'accent-purple-500'}`}
                title="Rotate"
              />
              <span className="text-[10px] w-8 text-right font-mono text-slate-400">
                {selection
                  ? (stickers.find(s => s.id === selection)?.rotation || 0)
                  : rotation
                }°
              </span>
            </div>

            <div className="flex gap-2 pt-3 border-t border-white/5 justify-between">
              <button
                onClick={handleAutoFit}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 border border-transparent hover:border-white/5"
                title="Auto-fit: Fit entire image inside frame"
              >
                <Maximize size={14} />
                <span>Fit to Frame</span>
              </button>

              <button
                onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); setRotation(0); }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 border border-transparent hover:border-white/5"
                title="Reset Position, Zoom, and Rotation"
              >
                <RefreshCcw size={14} />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        )
      }

      {/* Sticker Toolbar */}
      <div className="w-full max-w-lg bg-slate-900/60 p-5 rounded-2xl border border-white/5 backdrop-blur-xl">
        <h4 className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest mb-4">Add Decorations</h4>
        <div className="flex gap-4 justify-center">
          {[
            { id: 'verified', icon: BadgeCheck, label: 'Verified', color: 'text-blue-400' },
            { id: 'zap', icon: Zap, label: 'Zap', color: 'text-yellow-400' },
            { id: 'heart', icon: Heart, label: 'Heart', color: 'text-pink-400' },
            { id: 'star', icon: Star, label: 'Star', color: 'text-purple-400' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setStickers(prev => [
                  ...prev,
                  {
                    id: Date.now().toString(),
                    icon: item.id,
                    x: 0,
                    y: 0, // Center
                    scale: 1,
                    rotation: 0
                  }
                ]);
              }}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className={`p-3.5 rounded-xl bg-slate-800/80 border border-white/5 group-hover:bg-slate-700/80 transition-all ${item.color} group-hover:-translate-y-1 shadow-lg shadow-black/20`}>
                <item.icon size={24} />
              </div>
              <span className="text-[10px] text-slate-500 font-bold group-hover:text-slate-300 transition-colors uppercase tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Sticker Controls (Delete Selected) */}
        {stickers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">{stickers.length} stickers active</span>
            <button
              onClick={() => setStickers([])}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 font-bold uppercase tracking-wide px-2 py-1 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
            >
              <Trash2 size={12} /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Publish Modal Trigger (Only if image is present) */}
      {imageSrc && (
        <div className="mt-4">
          <button
            onClick={() => setIsPublishOpen(true)}
            className="text-sm text-slate-500 hover:text-white underline decoration-slate-700 hover:decoration-white transition-all"
          >
            Publish to Community Gallery
          </button>
        </div>
      )}

      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        frameConfig={{
          ...selectedFrame,
          stickers: stickers // Include stickers in the published config
        }}
      />
    </div >
  );
};
