export interface Position {
  x: number;
  y: number;
}

export enum FrameType {
  NONE = 'NONE',
  SOLID = 'SOLID',
  GRADIENT = 'GRADIENT',
  NEON = 'NEON',
  DASHED = 'DASHED',
  DOUBLE = 'DOUBLE',
  MEMPHIS = 'MEMPHIS',
  GEOMETRIC = 'GEOMETRIC',
  STAR = 'STAR',
  HEART = 'HEART',
  HEXAGON = 'HEXAGON',
  CUSTOM_IMAGE = 'CUSTOM_IMAGE'
}

export interface FrameCaption {
  text: string;
  color?: string;                 // text color, defaults to white
  position?: 'bottom' | 'top';    // arc placement, defaults to bottom
  size?: number;                  // 0.6 - 1.6 scale multiplier, defaults to 1
}

export interface FrameConfig {
  id: string;
  type: FrameType;
  name: string;
  color1: string;
  color2?: string;
  width: number; // proportional thickness
  imageUrl?: string; // For CUSTOM_IMAGE type
  cutoutScale?: number; // 0-1: transparent center hole (photo window) for CUSTOM_IMAGE
  caption?: FrameCaption; // Optional curved slogan text around the ring
  stickers?: StickerConfig[]; // Optional stickers array
  textLayers?: TextConfig[]; // Optional text layers
  motionEffect?: MotionEffect;
}

export type MotionEffect = 'none' | 'pulse' | 'spin' | 'glitch' | 'rain';

export interface StickerConfig {
  id: string;
  icon: string; // Lucide icon name or image URL
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface TextConfig {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation: number;
  align: 'left' | 'center' | 'right';
  curved?: boolean;
  flip?: boolean;
}
