
export type AvatarPartType = 'background' | 'skin' | 'clothes' | 'mouth' | 'eyes' | 'hair' | 'accessory';

export interface AvatarAsset {
    id: string;
    type: AvatarPartType;
    name: string;
    src: string; // URL to SVG/PNG
    zIndex: number;
}

export interface AvatarConfig {
    background: string;
    skin: string;
    clothes: string;
    mouth: string;
    eyes: string;
    hair: string;
    accessory: string;
}

export const AVATAR_LAYERS: Record<AvatarPartType, number> = {
    background: 0,
    skin: 10,
    clothes: 20,
    mouth: 30,
    eyes: 40,
    hair: 50,
    accessory: 60,
};

export const AVATAR_ASSETS: Record<AvatarPartType, AvatarAsset[]> = {
    background: [
        { id: 'bg-none', type: 'background', name: 'Transparent', src: '', zIndex: 0 },
        { id: 'bg-white', type: 'background', name: 'White', src: '/avatar/bg/white.svg', zIndex: 0 },
        { id: 'bg-blue', type: 'background', name: 'Blue', src: '/avatar/bg/blue.svg', zIndex: 0 },
        { id: 'bg-pink', type: 'background', name: 'Pink', src: '/avatar/bg/pink.svg', zIndex: 0 },
    ],
    skin: [
        { id: 'skin-pale', type: 'skin', name: 'Pale Base', src: '/avatar/doodle/skin-pale.svg', zIndex: 10 },
    ],
    clothes: [
        { id: 'clothes-none', type: 'clothes', name: 'None', src: '', zIndex: 20 },
    ],
    mouth: [
        { id: 'mouth-smile', type: 'mouth', name: 'Smile', src: '/avatar/doodle/mouth-smile.svg', zIndex: 30 },
    ],
    eyes: [
        { id: 'eyes-normal', type: 'eyes', name: 'Normal', src: '/avatar/doodle/eyes-normal.svg', zIndex: 40 },
    ],
    hair: [
        { id: 'hair-none', type: 'hair', name: 'Bald', src: '', zIndex: 50 },
        { id: 'hair-messy', type: 'hair', name: 'Messy', src: '/avatar/doodle/hair-messy.svg', zIndex: 50 },
    ],
    accessory: [
        { id: 'acc-none', type: 'accessory', name: 'None', src: '', zIndex: 60 },
    ],
};

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
    background: 'bg-white',
    skin: 'skin-pale',
    clothes: 'clothes-none',
    mouth: 'mouth-smile',
    eyes: 'eyes-normal',
    hair: 'hair-messy',
    accessory: 'acc-none',
};
