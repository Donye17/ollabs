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
  HEXAGON = 'HEXAGON'
}

export interface FrameConfig {
  id: string;
  type: FrameType;
  name: string;
  color1: string;
  color2?: string;
  width: number; // proportional thickness
}