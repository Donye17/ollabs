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
}

// Removed with the builder features they belonged to: stickers, textLayers and
// motionEffect. All three were still being written into campaigns.frame_config
// by the publish flow long after their UI was taken out, so every campaign
// carried empty arrays for them. Checked before removing: across all 326
// campaigns, zero had a sticker, zero had a text layer, and no row carried a
// motionEffect key at all. Old rows keep their empty arrays harmlessly; nothing
// reads them any more.
