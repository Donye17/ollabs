import { FrameConfig, FrameType } from '@/lib/types';

export const CANVAS_SIZE = 1024; // High res for export
export const DISPLAY_SIZE = 320; // Visual size in UI

export const AVAILABLE_FRAMES: FrameConfig[] = [
  {
    id: 'frame-none',
    type: FrameType.NONE,
    name: 'No Frame',
    color1: 'transparent',
    width: 0,
  },
  {
    id: 'frame-white-thin',
    type: FrameType.SOLID,
    name: 'Minimal White',
    color1: '#ffffff',
    width: 15,
  },
  {
    id: 'frame-gray-sleek',
    type: FrameType.SOLID,
    name: 'Apple Gray',
    color1: '#8e8e93', // Apple system gray
    width: 20,
  },
  {
    id: 'frame-blue-gradient',
    type: FrameType.GRADIENT,
    name: 'Ocean Gradient',
    color1: '#00c6ff',
    color2: '#0072ff',
    width: 25,
  },
  {
    id: 'frame-sunset-gradient',
    type: FrameType.GRADIENT,
    name: 'Sunset Gradient',
    color1: '#f12711',
    color2: '#f5af19',
    width: 25,
  },
  {
    id: 'frame-neon-purple',
    type: FrameType.NEON,
    name: 'Cyberpunk',
    color1: '#d946ef',
    color2: '#8b5cf6',
    width: 10,
  },
  {
    id: 'frame-gold-double',
    type: FrameType.DOUBLE,
    name: 'Luxury Gold',
    color1: '#FDB931',
    color2: '#d4af37',
    width: 20,
  },
  {
    id: 'frame-dashed-mint',
    type: FrameType.DASHED,
    name: 'Stitched Mint',
    color1: '#34d399',
    width: 15,
  },
  {
    id: 'frame-memphis-pop',
    type: FrameType.MEMPHIS,
    name: 'Memphis Pop',
    color1: '#facc15', // Yellow
    color2: '#3b82f6', // Blue Shadow
    width: 20,
  },
  {
    id: 'frame-geometric-dots',
    type: FrameType.GEOMETRIC,
    name: 'Modern Dots',
    color1: '#f43f5e',
    width: 18,
  },
  {
    id: 'frame-star-gold',
    type: FrameType.STAR,
    name: 'Super Star',
    color1: '#fbbf24', // Amber 400
    width: 20,
  },
  {
    id: 'frame-heart-pink',
    type: FrameType.HEART,
    name: 'Lovely Heart',
    color1: '#ec4899', // Pink 500
    color2: '#f472b6', // Pink 400 (for gradient effect if supported)
    width: 20,
  },
  {
    id: 'frame-hexagon-blue',
    type: FrameType.HEXAGON,
    name: 'Hex Tech',
    color1: '#1e3a8a', // Blue 900
    width: 25,
  },
];
