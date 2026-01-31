"use client";
import React from 'react';
import { FrameConfig, FrameType } from '@/lib/types';
import { Sliders, Palette, MoveHorizontal, RotateCcw, RotateCw, BoxSelect, Pipette, Hexagon } from 'lucide-react';

interface FrameCustomizerProps {
  frame: FrameConfig;
  onChange: (updatedFrame: FrameConfig) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Full range of preset colors for quick selection
const PRESET_COLORS = [
  '#ffffff', // White
  '#000000', // Black
  '#8e8e93', // Apple Gray
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#f43f5e', // Rose
];

const BORDER_STYLES = [
  { type: FrameType.SOLID, label: 'Solid' },
  { type: FrameType.DASHED, label: 'Dashed' },
  { type: FrameType.DOUBLE, label: 'Double' },
  { type: FrameType.NEON, label: 'Neon' },
  { type: FrameType.GRADIENT, label: 'Gradient' },
  { type: FrameType.MEMPHIS, label: 'Shadow' },
  { type: FrameType.STAR, label: 'Star' },
  { type: FrameType.HEART, label: 'Heart' },
  { type: FrameType.HEXAGON, label: 'Hexagon' },
];

export const FrameCustomizer: React.FC<FrameCustomizerProps> = ({
  frame,
  onChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  if (frame.type === FrameType.NONE) return null;

  const handleColorChange = (key: 'color1' | 'color2', value: string) => {
    onChange({ ...frame, [key]: value });
  };

  const handleWidthChange = (value: number) => {
    onChange({ ...frame, width: value });
  };

  const handleTypeChange = (type: FrameType) => {
    // If switching to a type that needs a secondary color but doesn't have one, provide a default
    let color2 = frame.color2;
    if (!color2 && (type === FrameType.GRADIENT || type === FrameType.NEON || type === FrameType.DOUBLE || type === FrameType.MEMPHIS || type === FrameType.HEART)) {
      color2 = '#ffffff';
    }
    onChange({ ...frame, type, color2 });
  };

  const hasSecondaryColor = frame.type === FrameType.GRADIENT ||
    frame.type === FrameType.NEON ||
    frame.type === FrameType.DOUBLE ||
    frame.type === FrameType.MEMPHIS ||
    frame.type === FrameType.HEART;

  return (
    <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 space-y-4">
      {/* Header with Undo/Redo */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-200 font-medium">
          <Sliders size={16} />
          <span>Customize</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            title="Undo last change"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            title="Redo last change"
          >
            <RotateCw size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-5">

        {/* Border Style Selection */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 flex items-center gap-1" title="Choose the style of the frame border">
            <BoxSelect size={12} /> Border Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BORDER_STYLES.map((style) => (
              <button
                key={style.type}
                onClick={() => handleTypeChange(style.type)}
                className={`
                            px-2 py-2 rounded-lg text-[11px] font-medium border transition-all
                            ${frame.type === style.type
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'}
                        `}
                title={`Change frame style to ${style.label}`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Swatches */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 flex items-center gap-1" title="Select a preset color to apply to the primary color">
              <Palette size={12} /> Quick Colors
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => handleColorChange('color1', c)}
                className="w-5 h-5 rounded-full ring-1 ring-slate-600 hover:scale-110 transition-transform relative group"
                style={{ backgroundColor: c }}
                title={`Apply color: ${c}`}
              >
                {frame.color1.toLowerCase() === c.toLowerCase() && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900 rounded-full shadow-sm ring-1 ring-white/50" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-3 space-y-3">
          {/* Color 1 */}
          <div className="flex items-center justify-between group">
            <label className="text-xs text-slate-400 flex items-center gap-2 group-hover:text-slate-300 transition-colors" title="The main color of the frame">
              <Pipette size={12} /> Primary Color
            </label>
            <div className="flex items-center gap-2">
              {/* Hex Input */}
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">#</span>
                <input
                  type="text"
                  value={frame.color1.replace('#', '')}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                      handleColorChange('color1', '#' + val);
                    }
                  }}
                  className="w-20 bg-slate-900 border border-slate-700 rounded-md py-1 pl-4 pr-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono uppercase"
                  maxLength={6}
                />
              </div>

              {/* Color Picker */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-600 group-hover:ring-blue-500 transition-all cursor-pointer" title="Click to open color spectrum">
                <input
                  type="color"
                  value={frame.color1}
                  onChange={(e) => handleColorChange('color1', e.target.value)}
                  className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-none"
                />
              </div>
            </div>
          </div>

          {/* Color 2 (Conditional) */}
          {hasSecondaryColor && (
            <div className="flex items-center justify-between group animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-xs text-slate-400 flex items-center gap-2 group-hover:text-slate-300 transition-colors" title="The secondary color for gradients, shadows, or dual effects">
                <Pipette size={12} className="text-blue-400" />
                {frame.type === FrameType.MEMPHIS ? 'Shadow Color' : 'Secondary Color'}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase">{frame.color2}</span>
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-600 group-hover:ring-blue-500 transition-all cursor-pointer" title="Click to open color picker">
                  <input
                    type="color"
                    value={frame.color2 || '#ffffff'}
                    onChange={(e) => handleColorChange('color2', e.target.value)}
                    className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Thickness Slider with Visual Feedback */}
        <div className="space-y-3 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <MoveHorizontal size={12} />
              <span className="font-medium text-slate-300">Frame Thickness</span>
            </div>
            <span className="bg-slate-700 px-2 py-0.5 rounded text-slate-200 font-mono text-[10px]">{frame.width}px</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Thin visual indicator */}
            <div className="w-5 h-5 rounded-full border border-slate-500 shrink-0" title="Thin (5px)"></div>

            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={frame.width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              title="Drag to adjust frame thickness"
            />

            {/* Thick visual indicator */}
            <div className="w-5 h-5 rounded-full border-[5px] border-slate-500 shrink-0" title="Thick (50px)"></div>
          </div>

          <div className="flex justify-between text-[10px] text-slate-600 px-1 font-medium uppercase tracking-wider">
            <span>5px</span>
            <span>50px</span>
          </div>
        </div>
      </div>
    </div>
  );
};
