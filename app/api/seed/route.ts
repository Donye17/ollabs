import { pool } from '@/lib/neon';
import { NextRequest, NextResponse } from 'next/server';
import { AVAILABLE_FRAMES } from '@/lib/constants';
import { FrameType, FrameConfig } from '@/lib/types';

export const dynamic = 'force-dynamic';

const SEED_TEMPLATES = [
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Cyberpunk')!,
        overrideName: 'Cyber Glitch 2077',
        description: 'A neon-soaked aesthetic for the future.',
        stickers: [
            { id: 's1', icon: 'zap', x: 120, y: -120, scale: 1.2, rotation: 15 },
            { id: 's2', icon: 'zap', x: -120, y: 120, scale: 1.0, rotation: -15 },
        ],
        textLayers: [
            { id: 't1', text: 'CYBERPUNK', x: 0, y: -200, fontSize: 48, fontFamily: 'Inter', color: '#d946ef', rotation: 0, align: 'center', curved: true },
            { id: 't2', text: '2077', x: 0, y: 200, fontSize: 32, fontFamily: 'Inter', color: '#8b5cf6', rotation: 0, align: 'center', curved: true },
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Luxury Gold')!,
        overrideName: 'Verified Gold',
        description: 'The ultimate status symbol.',
        stickers: [
            { id: 's1', icon: 'verified', x: 0, y: -130, scale: 1.5, rotation: 0 },
        ],
        textLayers: [
            { id: 't1', text: 'OFFICIAL', x: 0, y: 140, fontSize: 36, fontFamily: 'Playfair Display', color: '#FDB931', rotation: 0, align: 'center', curved: true },
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Ocean Gradient')!,
        overrideName: 'Deep Blue Sea',
        description: 'Calm and collected vibes.',
        stickers: [
            { id: 's1', icon: 'star', x: 100, y: -100, scale: 0.8, rotation: 45 },
            { id: 's2', icon: 'star', x: -100, y: -100, scale: 0.8, rotation: -45 },
        ],
        textLayers: [
            { id: 't1', text: 'WAVES', x: 0, y: 180, fontSize: 42, fontFamily: 'Inter', color: '#00c6ff', rotation: 0, align: 'center', curved: true },
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Modern Dots')!,
        overrideName: 'Pop Art',
        description: 'Bold, geometric, and fun.',
        stickers: [
            { id: 's1', icon: 'heart', x: 0, y: 0, scale: 2.0, rotation: 0 } // Center heart
        ],
        textLayers: [
            { id: 't1', text: 'LOVE', x: 0, y: -140, fontSize: 60, fontFamily: 'Inter', color: '#f43f5e', rotation: 0, align: 'center', curved: true }
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Sunset Gradient')!,
        overrideName: 'Sunset Vibes',
        description: 'Warm colors for cool people.',
        stickers: [],
        textLayers: [
            { id: 't1', text: 'SUMMER', x: 0, y: -150, fontSize: 50, fontFamily: 'Inter', color: '#f12711', rotation: 0, align: 'center', curved: true },
            { id: 't2', text: 'VIBES', x: 0, y: 150, fontSize: 50, fontFamily: 'Inter', color: '#f5af19', rotation: 0, align: 'center', curved: true }
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Lovely Heart')!,
        overrideName: 'True Romance',
        description: 'For your special someone.',
        stickers: [
            { id: 's1', icon: 'heart', x: 0, y: -150, scale: 1.2, rotation: 10 },
            { id: 's2', icon: 'heart', x: 0, y: 150, scale: 0.8, rotation: -10 }
        ],
        textLayers: [
            { id: 't1', text: 'XOXO', x: 0, y: 0, fontSize: 80, fontFamily: 'Playfair Display', color: '#ec4899', rotation: 0, align: 'center', curved: true }
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Hex Tech')!,
        overrideName: 'Future Tech',
        description: 'Geometric perfection.',
        stickers: [
            { id: 's1', icon: 'zap', x: 0, y: 0, scale: 2.5, rotation: 90 }
        ],
        textLayers: [
            { id: 't1', text: 'SYSTEM', x: 0, y: -180, fontSize: 40, fontFamily: 'Inter', color: '#1effff', rotation: 0, align: 'center', curved: true },
            { id: 't2', text: 'ONLINE', x: 0, y: 180, fontSize: 40, fontFamily: 'Inter', color: '#1effff', rotation: 0, align: 'center', curved: true }
        ]
    },
    {
        ...AVAILABLE_FRAMES.find(f => f.name === 'Stitched Mint')!,
        overrideName: 'Handmade View',
        description: 'Crafted with care.',
        stickers: [
            { id: 's1', icon: 'star', x: 120, y: 0, scale: 1.0, rotation: 0 },
            { id: 's2', icon: 'star', x: -120, y: 0, scale: 1.0, rotation: 0 }
        ],
        textLayers: [
            { id: 't1', text: 'LIMITED', x: 0, y: -160, fontSize: 32, fontFamily: 'Playfair Display', color: '#34d399', rotation: 0, align: 'center', curved: true },
            { id: 't2', text: 'EDITION', x: 0, y: 160, fontSize: 32, fontFamily: 'Playfair Display', color: '#34d399', rotation: 0, align: 'center', curved: true }
        ]
    }
];

export async function GET(request: NextRequest) {
    try {
        const results = [];
        for (const template of SEED_TEMPLATES) {
            const config: FrameConfig = {
                id: template.id,
                type: template.type,
                name: template.overrideName,
                color1: template.color1,
                color2: template.color2,
                width: template.width,
                stickers: template.stickers,
                // @ts-ignore
                textLayers: template.textLayers
            };

            // Check if exists
            const check = await pool.query('SELECT id FROM frames WHERE name = $1', [template.overrideName]);
            if (check.rows.length === 0) {
                await pool.query(
                    `INSERT INTO frames (name, description, config, creator_id, creator_name, is_public, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                    [template.overrideName, template.description, JSON.stringify(config), 'seed-admin', 'Ollabs Team', true]
                );
                results.push(`Inserted: ${template.overrideName}`);
            } else {
                results.push(`Skipped: ${template.overrideName} (Exists)`);
            }
        }

        return NextResponse.json({ status: 'success', results });
    } catch (error) {
        console.error('Seed failed:', error);
        return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 });
    }
}
