import { FrameConfig, FrameType } from '@/lib/types';

/**
 * Starter frame packs by market intent.
 *
 * Custom PNGs live under /public/frames/packs/. Colour rings remain the
 * collapsed fallback when a pack is empty or assets fail to load.
 */

export type FramePackId = 'br' | 'id' | 'ph' | 'mx' | 'ng';

export type FramePack = {
    id: FramePackId;
    label: string;
    /** Countries / markets this pack is aimed at. */
    markets: string[];
    frames: FrameConfig[];
};

function packFrame(
    id: string,
    name: string,
    file: string,
    cutout = 0.58
): FrameConfig {
    return {
        id,
        name,
        type: FrameType.CUSTOM_IMAGE,
        imageUrl: `/frames/packs/${file}`,
        cutoutScale: cutout,
        color1: '#01BEF6',
        width: 12,
    };
}

/** Shared ring-style SVG packs (transparent center) per priority market. */
export const FRAME_PACKS: FramePack[] = [
    {
        id: 'br',
        label: 'Brasil',
        markets: ['BR', 'PT'],
        frames: [
            packFrame('pack-br-verde', 'Verde e amarelo', 'br-verde.svg'),
            packFrame('pack-br-azul', 'Azul campanha', 'br-azul.svg'),
            packFrame('pack-br-coral', 'Coral', 'br-coral.svg'),
            packFrame('pack-br-ink', 'Escuro', 'br-ink.svg'),
            packFrame('pack-br-rosa', 'Rosa', 'br-rosa.svg'),
            packFrame('pack-br-ouro', 'Ouro', 'br-ouro.svg'),
            packFrame('pack-br-duplo', 'Duplo', 'br-duplo.svg', 0.55),
            packFrame('pack-br-fino', 'Fino', 'br-fino.svg', 0.62),
        ],
    },
    {
        id: 'id',
        label: 'Indonesia',
        markets: ['ID'],
        frames: [
            packFrame('pack-id-merah', 'Merah putih', 'id-merah.svg'),
            packFrame('pack-id-hijau', 'Hijau', 'id-hijau.svg'),
            packFrame('pack-id-biru', 'Biru', 'id-biru.svg'),
            packFrame('pack-id-emas', 'Emas', 'id-emas.svg'),
            packFrame('pack-id-ungu', 'Ungu', 'id-ungu.svg'),
            packFrame('pack-id-hitam', 'Hitam', 'id-hitam.svg'),
            packFrame('pack-id-tebal', 'Tebal', 'id-tebal.svg', 0.52),
            packFrame('pack-id-tipis', 'Tipis', 'id-tipis.svg', 0.64),
        ],
    },
    {
        id: 'ph',
        label: 'Pilipinas',
        markets: ['PH'],
        frames: [
            packFrame('pack-ph-asul', 'Asul', 'ph-asul.svg'),
            packFrame('pack-ph-pula', 'Pula', 'ph-pula.svg'),
            packFrame('pack-ph-dilaw', 'Dilaw', 'ph-dilaw.svg'),
            packFrame('pack-ph-berde', 'Berde', 'ph-berde.svg'),
            packFrame('pack-ph-rosas', 'Rosas', 'ph-rosas.svg'),
            packFrame('pack-ph-itim', 'Itim', 'ph-itim.svg'),
            packFrame('pack-ph-doble', 'Doble', 'ph-doble.svg', 0.54),
            packFrame('pack-ph-manipis', 'Manipis', 'ph-manipis.svg', 0.63),
        ],
    },
    {
        id: 'mx',
        label: 'México',
        markets: ['MX', 'ES'],
        frames: [
            packFrame('pack-mx-verde', 'Verde', 'mx-verde.svg'),
            packFrame('pack-mx-rojo', 'Rojo', 'mx-rojo.svg'),
            packFrame('pack-mx-oro', 'Oro', 'mx-oro.svg'),
            packFrame('pack-mx-azul', 'Azul', 'mx-azul.svg'),
            packFrame('pack-mx-rosa', 'Rosa', 'mx-rosa.svg'),
            packFrame('pack-mx-negro', 'Negro', 'mx-negro.svg'),
            packFrame('pack-mx-doble', 'Doble', 'mx-doble.svg', 0.54),
            packFrame('pack-mx-fino', 'Fino', 'mx-fino.svg', 0.63),
        ],
    },
    {
        id: 'ng',
        label: 'Nigeria',
        markets: ['NG'],
        frames: [
            packFrame('pack-ng-green', 'Green', 'ng-green.svg'),
            packFrame('pack-ng-white', 'White ring', 'ng-white.svg'),
            packFrame('pack-ng-gold', 'Gold', 'ng-gold.svg'),
            packFrame('pack-ng-blue', 'Blue', 'ng-blue.svg'),
            packFrame('pack-ng-coral', 'Coral', 'ng-coral.svg'),
            packFrame('pack-ng-ink', 'Ink', 'ng-ink.svg'),
            packFrame('pack-ng-bold', 'Bold', 'ng-bold.svg', 0.52),
            packFrame('pack-ng-thin', 'Thin', 'ng-thin.svg', 0.64),
        ],
    },
];

export function packForCountry(country: string | null | undefined): FramePack | null {
    if (!country) return null;
    const code = country.toUpperCase();
    return FRAME_PACKS.find((p) => p.markets.includes(code)) ?? null;
}

export function allPackFrames(): FrameConfig[] {
    return FRAME_PACKS.flatMap((p) => p.frames);
}
