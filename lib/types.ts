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

export interface FrameConfig {
  id: string;
  type: FrameType;
  name: string;
  color1: string;
  color2?: string;
  width: number; // proportional thickness
  imageUrl?: string; // For CUSTOM_IMAGE type
  stickers?: StickerConfig[]; // Optional stickers array
}

export interface StickerConfig {
  id: string;
  icon: string; // Lucide icon name or image URL
  x: number;
  y: number;
  scale: number;
  rotation: number;
}
