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
  const [selection, setSelection] = useState<{ type: 'image' } | { type: 'sticker', id: string }>({ type: 'image' });
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null);

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
      ctx.scale(sticker.scale, sticker.scale);
      // Draw centered
      ctx.drawImage(img, -24, -24, 48, 48); // Base size 48px

      // Selection Ring
      if (selection.type === 'sticker' && (selection as any).id === sticker.id) {
        ctx.strokeStyle = '#3b82f6'; // Blue
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent scrolling on touch
    if ('touches' in e) {
      // e.preventDefault(); 
    }
    const { x, y } = getMousePos(e);

    // Hit Test for Stickers (Top-most first)
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    // Check stickers in reverse (drawn top on top)
    let hitStickerId: string | null = null;
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const sX = centerX + s.x;
      const sY = centerY + s.y;
      const radius = (24 * s.scale) + 10; // Hit area
      const dist = Math.sqrt(Math.pow(x - sX, 2) + Math.pow(y - sY, 2));

      if (dist <= radius) {
        hitStickerId = s.id;
        break;
      }
    }

    setIsDragging(true);

    if (hitStickerId) {
      setSelection({ type: 'sticker', id: hitStickerId });
      const s = stickers.find(st => st.id === hitStickerId)!;
      setDragStart({ x: x - s.x, y: y - s.y });
    } else {
      // Fallback to Image
      setSelection({ type: 'image' });
      setDragStart({ x: x - position.x, y: y - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    // Only prevent default if we are dragging
    if (e.cancelable) e.preventDefault();

    const { x, y } = getMousePos(e);

    if (selection.type === 'sticker') {
      const newX = x - dragStart.x;
      const newY = y - dragStart.y;
      setStickers(prev => prev.map(s =>
        s.id === (selection as any).id ? { ...s, x: newX, y: newY } : s
      ));
    } else if (imageObject) {
      const newX = x - dragStart.x;
      const newY = y - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Touch wrappers to map to mouse handlers
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
        className={`
           relative group rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
           ${isDragOver
            ? 'scale-110 ring-8 ring-blue-500 shadow-[0_20px_50px_rgba(59,130,246,0.5)]'
            : 'scale-100 ring-4 ring-slate-800 bg-slate-900'}
        `}
        style={{
          width: DISPLAY_SIZE,
          height: DISPLAY_SIZE,
          cursor: imageObject ? (isDragging ? 'grabbing' : 'grab') : 'default',
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
          className="w-full h-full object-contain pointer-events-none"
        />

        {!imageObject && !isDragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
            <Upload className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Drag & Drop or Upload</span>
          </div>
        )}

        {isDragOver && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[2px] animate-pulse" />
            <div className="absolute inset-8 rounded-full border-4 border-dashed border-white/60 animate-[spin_8s_linear_infinite]" />
            <div className="relative bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl shadow-blue-900/40 font-bold flex items-center gap-2 animate-bounce">
              <ImageIcon size={24} />
              <span>Drop Image</span>
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
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-900/20 font-medium select-none"
            title="Select an image from your device"
          >
            <Upload size={20} />
            <span>{imageObject ? 'Change Photo' : 'Upload Photo'}</span>
          </div>
        </label>
      </div>

      {imageObject && (
        <div className="flex gap-3 justify-center w-full">
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
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white py-3 px-6 rounded-xl transition-colors font-medium border border-purple-500 shadow-lg shadow-purple-900/20 disabled:opacity-50"
              title="Set as your profile picture"
            >
              {isUpdatingProfile ? <Loader2 size={20} className="animate-spin" /> : <User size={20} />}
              <span>Set Profile</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors font-medium border border-slate-600"
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
          <div className="w-full bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 space-y-4 transition-colors duration-300">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {selection.type === 'sticker' ? 'Adjust Decoration' : 'Adjust Base Image'}
              </h4>
              {selection.type === 'sticker' && (
                <span className="text-[10px] text-blue-400 font-mono bg-blue-400/10 px-2 py-0.5 rounded">Selected</span>
              )}
            </div>

            {/* Scale Control */}
            <div className="flex items-center gap-3">
              <ZoomOut size={16} className="text-slate-400" />
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={selection.type === 'sticker'
                  ? (stickers.find(s => s.id === (selection as any).id)?.scale || 1)
                  : scale
                }
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (selection.type === 'sticker') {
                    setStickers(prev => prev.map(s => s.id === (selection as any).id ? { ...s, scale: val } : s));
                  } else {
                    setScale(val);
                  }
                }}
                className={`flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer ${selection.type === 'sticker' ? 'accent-blue-500' : 'accent-indigo-500'}`}
                title="Scale"
              />
              <ZoomIn size={16} className="text-slate-400" />
            </div>

            {/* Rotate Control */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <RotateCw size={16} className="text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={selection.type === 'sticker'
                  ? (stickers.find(s => s.id === (selection as any).id)?.rotation || 0)
                  : rotation
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (selection.type === 'sticker') {
                    setStickers(prev => prev.map(s => s.id === (selection as any).id ? { ...s, rotation: val } : s));
                  } else {
                    setRotation(val);
                  }
                }}
                className={`flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer ${selection.type === 'sticker' ? 'accent-blue-500' : 'accent-purple-500'}`}
                title="Rotate"
              />
              <span className="text-[10px] w-8 text-right font-mono text-slate-400">
                {selection.type === 'sticker'
                  ? (stickers.find(s => s.id === (selection as any).id)?.rotation || 0)
                  : rotation
                }°
              </span>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-700/50 justify-between">
              <button
                onClick={handleAutoFit}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700 rounded-lg text-xs text-slate-400 hover:text-white transition-colors bg-slate-700/30"
                title="Auto-fit: Fit entire image inside frame"
              >
                <Maximize size={14} />
                <span>Fit to Frame</span>
              </button>

              <button
                onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); setRotation(0); }}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700 rounded-lg text-xs text-slate-400 hover:text-white transition-colors bg-slate-700/30"
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
      <div className="w-full max-w-lg bg-slate-900/80 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-md">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Add Decorations</h4>
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
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-3 rounded-xl bg-slate-800 border border-slate-700 group-hover:bg-slate-700 transition-colors ${item.color}`}>
                <item.icon size={24} />
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Sticker Controls (Delete Selected) */}
        {stickers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-500">{stickers.length} stickers active</span>
            <button
              onClick={() => setStickers([])}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear All
            </button>
          </div>
        )}
      </div>
    </div >
  );
};
