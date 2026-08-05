import { Pool } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

enum FrameType {
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

const AVAILABLE_FRAMES = [
    { id: 'frame-none', type: FrameType.NONE, name: 'No Frame', color1: 'transparent', width: 0 },
    { id: 'frame-white-thin', type: FrameType.SOLID, name: 'Minimal White', color1: '#ffffff', width: 15 },
    { id: 'frame-gray-sleek', type: FrameType.SOLID, name: 'Apple Gray', color1: '#8e8e93', width: 20 },
    { id: 'frame-blue-gradient', type: FrameType.GRADIENT, name: 'Ocean Gradient', color1: '#00c6ff', color2: '#0072ff', width: 25 },
    { id: 'frame-sunset-gradient', type: FrameType.GRADIENT, name: 'Sunset Gradient', color1: '#f12711', color2: '#f5af19', width: 25 },
    { id: 'frame-neon-purple', type: FrameType.NEON, name: 'Cyberpunk', color1: '#d946ef', color2: '#8b5cf6', width: 10 },
    { id: 'frame-gold-double', type: FrameType.DOUBLE, name: 'Luxury Gold', color1: '#FDB931', color2: '#d4af37', width: 20 },
    { id: 'frame-dashed-mint', type: FrameType.DASHED, name: 'Stitched Mint', color1: '#34d399', width: 15 },
    { id: 'frame-memphis-pop', type: FrameType.MEMPHIS, name: 'Memphis Pop', color1: '#facc15', color2: '#3b82f6', width: 20 },
    { id: 'frame-geometric-dots', type: FrameType.GEOMETRIC, name: 'Modern Dots', color1: '#f43f5e', width: 18 },
    { id: 'frame-star-gold', type: FrameType.STAR, name: 'Super Star', color1: '#fbbf24', width: 20 },
    { id: 'frame-heart-pink', type: FrameType.HEART, name: 'Lovely Heart', color1: '#ec4899', color2: '#f472b6', width: 20 },
    { id: 'frame-hexagon-blue', type: FrameType.HEXAGON, name: 'Hex Tech', color1: '#1e3a8a', width: 25 },
];

// ----------------------------------------------------
// PROCEDURAL GENERATION ASSETS
// ----------------------------------------------------

const THEMES = [
    {
        name: 'Cyberpunk',
        colors: ['#d946ef', '#8b5cf6', '#06b6d4', '#f472b6'],
        fonts: ['Space Grotesk', 'Impact'],
        frames: [FrameType.NEON, FrameType.HEXAGON],
        words: ['CYBER', 'GLITCH', 'SYSTEM', 'NODE', 'NET', 'ZERO', 'FUTURE', 'NEON', 'TECH', '2077', 'DATA', 'CORE'],
        stickers: ['zap', 'star']
    },
    {
        name: 'Vaporwave',
        colors: ['#f472b6', '#00c6ff', '#FDB931', '#d946ef'],
        fonts: ['Inter', 'Courier New'],
        frames: [FrameType.GRADIENT, FrameType.MEMPHIS, FrameType.DASHED],
        words: ['VIBES', 'CHILL', 'WAVE', 'AESTHETIC', 'RETRO', '1995', 'DREAM', 'VHS', 'LOFI', 'GLOW', 'FLUX'],
        stickers: ['heart', 'star']
    },
    {
        name: 'Streetwear',
        colors: ['#000000', '#ffffff', '#ef4444', '#eab308'],
        fonts: ['Impact', 'Archivo', 'Arial Black'],
        frames: [FrameType.SOLID, FrameType.DOUBLE, FrameType.GEOMETRIC],
        words: ['HYPE', 'BEAST', 'DROP', 'LIMITED', 'Cop', 'Rare', 'FW26', 'SS26', 'X', 'Y', 'OBSCURE', 'GRAIL'],
        stickers: ['verified', 'zap', 'star']
    },
    {
        name: 'Professional',
        colors: ['#ffffff', '#000000', '#8e8e93', '#1e3a8a'],
        fonts: ['Inter', 'Georgia', 'Playfair Display'],
        frames: [FrameType.SOLID, FrameType.DOUBLE, FrameType.NONE],
        words: ['CEO', 'FOUNDER', 'DEV', 'DESIGN', 'PRO', 'LEAD', 'CHIEF', 'TEAM', 'BUILD', 'SHIP', 'SCALE'],
        stickers: ['verified']
    },
    {
        name: 'Cottagecore',
        colors: ['#22c55e', '#facc15', '#f97316', '#a855f7'],
        fonts: ['Georgia', 'Courier New', 'Comic Sans MS'],
        frames: [FrameType.HEART, FrameType.DASHED, FrameType.STAR],
        words: ['BLOOM', 'GROW', 'SOFT', 'HOME', 'COZY', 'TEA', 'BOOK', 'GARDEN', 'FARM', 'SUN', 'MOON'],
        stickers: ['heart', 'star']
    }
];

// Helper to pick random item
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper for random number
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
// Helper for random position
const randomPos = () => rand(-180, 180);

async function seed() {
    console.log('Connecting to DB...');
    try {
        // Ensure table exists (Basic check)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS frames (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                description TEXT,
                config JSONB NOT NULL,
                creator_id TEXT NOT NULL,
                creator_name TEXT NOT NULL,
                is_public BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `);
        console.log('Frames table verified.');

        // ----------------------------------------------------
        // DYNAMIC SCHEMA MIGRATION (Fix for Prod DB mismatch)
        // ----------------------------------------------------
        const colsResult = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'frames';
        `);
        const existingCols = colsResult.rows.map(r => r.column_name);

        console.log('Current Columns:', existingCols.join(', '));

        if (!existingCols.includes('creator_name')) {
            console.log('⚠️ Missing column: creator_name. Adding it...');
            await pool.query('ALTER TABLE frames ADD COLUMN creator_name TEXT DEFAULT \'Unknown\';');
        }
        if (!existingCols.includes('is_public')) {
            console.log('⚠️ Missing column: is_public. Adding it...');
            await pool.query('ALTER TABLE frames ADD COLUMN is_public BOOLEAN DEFAULT true;');
        }
        if (!existingCols.includes('description')) {
            console.log('⚠️ Missing column: description. Adding it...');
            await pool.query('ALTER TABLE frames ADD COLUMN description TEXT;');
        }
        // ----------------------------------------------------

        const TOTAL_FRAMES_TO_GENERATE = 120;
        let generatedCount = 0;

        console.log(`🚀 Starting Procedural Generation of ${TOTAL_FRAMES_TO_GENERATE} frames...`);

        for (let i = 0; i < TOTAL_FRAMES_TO_GENERATE; i++) {
            const theme = pick(THEMES);
            const frameType = pick(theme.frames);
            const primaryColor = pick(theme.colors);
            const secondaryColor = pick(theme.colors.filter(c => c !== primaryColor)) || '#000000';
            const font = pick(theme.fonts);

            // Find base config for this frame type to get correct width defaults
            const baseFrame = AVAILABLE_FRAMES.find(f => f.type === frameType) || AVAILABLE_FRAMES[0];

            // Generate stickers
            const stickerCount = rand(0, 3);
            const stickers = [];
            for (let s = 0; s < stickerCount; s++) {
                stickers.push({
                    id: `s-${i}-${s}`,
                    icon: pick(theme.stickers),
                    x: randomPos(),
                    y: randomPos(),
                    scale: rand(8, 20) / 10, // 0.8 to 2.0
                    rotation: rand(-45, 45)
                });
            }

            // Generate Text
            const textCount = rand(0, 2);
            const textLayers = [];

            // Only add text if we want some variety, sometimes just a frame is nice
            if (rand(0, 10) > 2) {
                // Main Title
                textLayers.push({
                    id: `t-${i}-main`,
                    text: pick(theme.words),
                    x: 0,
                    y: -150,
                    fontSize: rand(30, 60),
                    fontFamily: font,
                    color: pick(theme.colors),
                    rotation: 0,
                    align: 'center',
                    curved: Math.random() > 0.5
                });

                // Subtitle (rare)
                if (Math.random() > 0.6) {
                    textLayers.push({
                        id: `t-${i}-sub`,
                        text: pick(theme.words),
                        x: 0,
                        y: 150,
                        fontSize: rand(20, 40),
                        fontFamily: font,
                        color: pick(theme.colors),
                        rotation: 0,
                        align: 'center',
                        curved: false
                    });
                }
            }

            const frameName = `${theme.name} ${pick(theme.words)} ${rand(1, 999)}`;

            const config = {
                id: `gen-${i}-${Date.now()}`,
                type: frameType,
                name: frameName,
                color1: primaryColor,
                color2: secondaryColor,
                width: baseFrame.width,
                stickers: stickers,
                textLayers: textLayers as any[]
            };

            // Insert
            await pool.query(
                `INSERT INTO frames (name, description, config, creator_id, creator_name, is_public, created_at)
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                [
                    frameName,
                    `A unique ${theme.name} design generated by the Ollabs Engine.`,
                    JSON.stringify(config),
                    'seed-bot',
                    'Ollabs Bot',
                    true
                ]
            );

            generatedCount++;
            if (generatedCount % 10 === 0) process.stdout.write('.');
        }

        console.log(`\n✅ Successfully generated and seeded ${generatedCount} creative frames!`);
    } catch (e) {
        console.error('❌ Seeding failed:', e);
    } finally {
        await pool.end();
    }
}

seed();
