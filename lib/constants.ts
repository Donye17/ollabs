import { FrameConfig, FrameType } from '@/lib/types';

export const CANVAS_SIZE = 1024; // High res for export
export const DISPLAY_SIZE = 320; // Visual size in UI

// Curated starter templates. Ordered so the Ollabs blue ring leads.
// All use renderers that already exist (SOLID, GRADIENT, DOUBLE, DASHED).
export const AVAILABLE_FRAMES: FrameConfig[] = [
  {
    id: 'frame-ollabs-blue',
    type: FrameType.SOLID,
    name: 'Ollabs Blue',
    color1: '#01BEF6',
    width: 22,
  },
  {
    id: 'frame-bold-black',
    type: FrameType.SOLID,
    name: 'Bold Black',
    color1: '#06141F',
    width: 20,
  },
  {
    id: 'frame-clean-white',
    type: FrameType.SOLID,
    name: 'Clean White',
    color1: '#ffffff',
    width: 18,
  },
  {
    id: 'frame-coral',
    type: FrameType.SOLID,
    name: 'Coral',
    color1: '#FF5C39',
    width: 20,
  },
  {
    id: 'frame-sunshine',
    type: FrameType.SOLID,
    name: 'Sunshine',
    color1: '#FFC24B',
    width: 20,
  },
  {
    id: 'frame-emerald',
    type: FrameType.SOLID,
    name: 'Emerald',
    color1: '#10b981',
    width: 20,
  },
  {
    id: 'frame-royal',
    type: FrameType.SOLID,
    name: 'Royal',
    color1: '#4f46e5',
    width: 20,
  },
  {
    id: 'frame-awareness-pink',
    type: FrameType.SOLID,
    name: 'Awareness Pink',
    color1: '#ec4899',
    width: 20,
  },
  {
    id: 'frame-ocean-gradient',
    type: FrameType.GRADIENT,
    name: 'Ocean',
    color1: '#00c6ff',
    color2: '#0072ff',
    width: 24,
  },
  {
    id: 'frame-sunset-gradient',
    type: FrameType.GRADIENT,
    name: 'Sunset',
    color1: '#f12711',
    color2: '#f5af19',
    width: 24,
  },
  {
    id: 'frame-usa-gradient',
    type: FrameType.GRADIENT,
    name: 'Red, White, Blue',
    color1: '#b22234',
    color2: '#3c3b6e',
    width: 22,
  },
  {
    id: 'frame-gold-double',
    type: FrameType.DOUBLE,
    name: 'Gold',
    color1: '#FDB931',
    color2: '#d4af37',
    width: 20,
  },
  {
    id: 'frame-silver-double',
    type: FrameType.DOUBLE,
    name: 'Silver',
    color1: '#e5e7eb',
    color2: '#9ca3af',
    width: 20,
  },
  {
    id: 'frame-mint-stitch',
    type: FrameType.DASHED,
    name: 'Stitched Mint',
    color1: '#34d399',
    width: 15,
  },
  {
    id: 'frame-forest',
    type: FrameType.SOLID,
    name: 'Forest',
    color1: '#0E3B2E',
    width: 20,
  },
  {
    id: 'frame-none',
    type: FrameType.NONE,
    name: 'No Frame',
    color1: 'transparent',
    width: 0,
  },
];

// The frame the builder starts on.
export const DEFAULT_FRAME: FrameConfig =
  AVAILABLE_FRAMES.find((f) => f.id === 'frame-ollabs-blue') ?? AVAILABLE_FRAMES[0];
