"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Download, Upload, ZoomIn, ZoomOut, RefreshCcw, Image as ImageIcon, Maximize, RotateCw, Share2 } from 'lucide-react';
import { CANVAS_SIZE, DISPLAY_SIZE } from '@/lib/constants';
import { FrameConfig, FrameType, Position } from '@/lib/types';
import { FrameRendererFactory } from './renderer/FrameRendererFactory';
import { PublishModal } from './PublishModal';
import { authClient } from '../lib/auth-client';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
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

  }, [imageObject, position, scale, rotation, selectedFrame, isDragOver]);

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

  // Drag and Pinch Logic (Canvas Interaction)
  const dragRef = useRef({ startX: 0, startY: 0, initialPosX: 0, initialPosY: 0, startDist: 0, initialScale: 1 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!imageObject) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      dragRef.current.startDist = dist;
      dragRef.current.initialScale = scale;
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      dragRef.current.startX = e.touches[0].clientX;
      dragRef.current.startY = e.touches[0].clientY;
      dragRef.current.initialPosX = position.x;
      dragRef.current.initialPosY = position.y;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageObject) return;
    setIsDragging(true);
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.initialPosX = position.x;
    dragRef.current.initialPosY = position.y;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!imageObject) return;

    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (dragRef.current.startDist > 0) {
        const scaleDiff = (dist / dragRef.current.startDist);
        const newScale = Math.min(Math.max(0.1, dragRef.current.initialScale * scaleDiff), 3);
        setScale(newScale);
      }
    } else if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      updatePosition(clientX, clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageObject) return;
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  };

  const updatePosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = CANVAS_SIZE / rect.width;

    const deltaX = (clientX - dragRef.current.startX) * ratio;
    const deltaY = (clientY - dragRef.current.startY) * ratio;

    setPosition({
      x: dragRef.current.initialPosX + deltaX,
      y: dragRef.current.initialPosY + deltaY
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
    dragRef.current.startDist = 0;
  };

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

        {imageObject && (
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-xl transition-colors font-medium border border-slate-600"
            title="Download high-resolution PNG"
          >
            <Download size={20} />
            <span>Save</span>
          </button>
        )}
      </div>

      {/* Advanced Controls (Zoom & Rotate) */}
      {imageObject && (
        <div className="w-full bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 space-y-4">

          {/* Zoom Control */}
          <div className="flex items-center gap-3">
            <ZoomOut size={16} className="text-slate-400" />
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              title={`Zoom: ${(scale * 100).toFixed(0)}%`}
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
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
              title={`Rotate: ${rotation}°`}
            />
            <span className="text-[10px] w-8 text-right font-mono text-slate-400">{rotation}°</span>
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
      )}
    </div>
  );
};
