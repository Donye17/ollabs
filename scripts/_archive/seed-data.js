const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const USERS = [
    { name: 'Kai Takemura', email: 'kai.t@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai&backgroundColor=b6e3f4' },
    { name: 'Elara Vance', email: 'elara.v@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara&backgroundColor=c0aede' },
    { name: 'Jaxon Steele', email: 'jaxon.s@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jaxon&backgroundColor=ffdfbf' },
    { name: 'Nova Kyra', email: 'nova.k@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova&backgroundColor=d1d4f9' },
    { name: 'Ryder Storm', email: 'ryder.s@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryder&backgroundColor=ffd5dc' },
    { name: 'Luna Chen', email: 'luna.c@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=c0aede' },
    { name: 'Axel Blaze', email: 'axel.b@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Axel&backgroundColor=b6e3f4' },
    { name: 'Zara X', email: 'zara.x@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara&backgroundColor=d1d4f9' },
    { name: 'Orion Pax', email: 'orion.p@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Orion&backgroundColor=ffd5dc' },
    { name: 'Mira Sol', email: 'mira.s@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mira&backgroundColor=ffdfbf' }
];

const FRAME_TEMPLATES = [
    { name: 'Neo Tokyo', type: 'NEON', color1: '#00ff9d', color2: '#00b8ff', width: 15, tags: ['Neon', 'Cyberpunk', 'Futuristic', 'Glow'] },
    { name: 'Sunset Boulevard', type: 'GRADIENT', color1: '#ff6b6b', color2: '#feca57', width: 20, tags: ['Summer', 'Gradient', 'Warm', 'Sunset'] },
    { name: 'Midas Touch', type: 'DOUBLE', color1: '#ffd700', color2: '#b8860b', width: 25, tags: ['Gold', 'Luxury', 'Royal', 'Elegant'] },
    { name: 'Zen Circle', type: 'SOLID', color1: '#ffffff', width: 10, tags: ['Minimal', 'Clean', 'White', 'Simple'] },
    { name: 'System Failure', type: 'DASHED', color1: '#ff0055', color2: '#00ffff', width: 12, tags: ['Glitch', 'Tech', 'Cyber', 'Distorted'] },
    { name: 'Candy Pop', type: 'MEMPHIS', color1: '#ff9ff3', color2: '#54a0ff', width: 18, tags: ['Retro', 'Pop', 'Memphis', 'Colorful'] },
    { name: 'Quantum Field', type: 'GEOMETRIC', color1: '#5f27cd', color2: '#341f97', width: 22, tags: ['Tech', 'Geometric', 'Purple', 'Modern'] },
    { name: 'Cupid`s Arrow', type: 'HEART', color1: '#ff4757', color2: '#ff6b81', width: 16, tags: ['Love', 'Heart', 'Cute', 'Pink'] },
    { name: 'Cosmic Dust', type: 'STAR', color1: '#f1c40f', color2: '#f39c12', width: 14, tags: ['Stars', 'Space', 'Magic', 'Yellow'] },
    { name: 'Cyber Shield', type: 'HEXAGON', color1: '#2ecc71', color2: '#27ae60', width: 20, tags: ['Gamer', 'Hex', 'Green', 'Shield'] },
    { name: 'Synthwave', type: 'GRADIENT', color1: '#ff71ce', color2: '#01cdfe', width: 24, tags: ['Vaporwave', 'Aesthetic', 'Retro', 'Pink'] },
    { name: 'Black Ops', type: 'DASHED', color1: '#2f3542', color2: '#57606f', width: 15, tags: ['Dark', 'Tactical', 'Minimal', 'Stealth'] },
    { name: 'Solar Flare', type: 'NEON', color1: '#ff9ff3', color2: '#feca57', width: 20, tags: ['Gradient', 'Neon', 'Sunset', 'Vibe'] },
    { name: 'Frostbite', type: 'DOUBLE', color1: '#ee5253', color2: '#48dbfb', width: 22, tags: ['Contrast', 'Blue', 'Red', 'Fire'] },
    { name: 'Deep Forest', type: 'SOLID', color1: '#10ac84', width: 18, tags: ['Nature', 'Green', 'Forest', 'Organic'] }
];

const COMMENTS = [
    "This is amazing! 🔥",
    "Love the colors on this one.",
    "Going to use this for my Discord profile.",
    "So clean! ✨",
    "Can you make a version in blue?",
    "Best frame I've seen yet.",
    "Remixing this immediately.",
    "Vibes serve immaculate energy.",
    "Awesome work!",
    "How did you get that glow effect?",
    "Perfect for my pfp thanks!",
    "Sleek design.",
    "Needs more neon lol",
    "Could you increase the border width?",
    "Looks great on mobile too."
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting Scaled Seed Process...');

        // 1. Clean Database
        console.log('🧹 Cleaning old data...');
        const tables = ['notifications', 'comments', 'likes', 'frames', '"user"'];
        for (const table of tables) {
            try {
                await client.query(`TRUNCATE TABLE ${table} CASCADE`);
            } catch (e) {
                if (e.code !== '42P01') {
                    console.warn(`⚠️ Could not truncate ${table}: ${e.message}`);
                }
            }
        }

        // 2. Create Users
        console.log('👥 Creating 10 Active Users...');
        const dbUsers = [];
        for (const u of USERS) {
            const res = await client.query(
                `INSERT INTO "user" (id, name, email, image, "emailVerified", "createdAt", "updatedAt") 
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) 
                 RETURNING *`,
                [u.name, u.email, u.image, true]
            );
            dbUsers.push(res.rows[0]);
        }

        // 3. Create Frames (10 per user = 100 total)
        console.log('🖼️ Creating 100 Frames (10 per user)...');
        const frames = [];

        for (const user of dbUsers) {
            for (let i = 0; i < 10; i++) {
                // Select random template
                const template = FRAME_TEMPLATES[Math.floor(Math.random() * FRAME_TEMPLATES.length)];

                // Variation logic
                const frameId = crypto.randomUUID();
                const hasTexture = Math.random() > 0.8; // 20% chance of texture
                const textureUrl = hasTexture ? `https://picsum.photos/seed/${frameId}/400/400` : undefined;

                const config = {
                    id: frameId,
                    ...template,
                    width: Math.max(5, template.width + Math.floor(Math.random() * 8 - 4)), // Variation +/- 4px
                    // Occasionally swap colors for more variety
                    color1: Math.random() > 0.8 ? template.color2 || template.color1 : template.color1,
                    imageUrl: textureUrl
                };

                // Pick 2-4 tags from template
                const shuffledTags = template.tags.sort(() => 0.5 - Math.random());
                const selectedTags = shuffledTags.slice(0, 2 + Math.floor(Math.random() * 3));

                const res = await client.query(
                    `INSERT INTO frames (creator_id, creator_name, name, description, config, created_at, tags)
                     VALUES ($1, $2, $3, $4, $5, NOW() - (random() * interval '60 days'), $6)
                     RETURNING *`,
                    [
                        user.id,
                        user.name,
                        template.name, // Use simple name without # number
                        `A unique variation of the ${template.name} style. Created by ${user.name}.`,
                        JSON.stringify(config),
                        selectedTags
                    ]
                );
                frames.push(res.rows[0]);
            }
        }

        // 4. Create Likes (Dense Graph)
        console.log('❤️ Generating Dense Likes Graph...');
        for (const user of dbUsers) {
            // Each user likes 20-40 random frames
            const numLikes = 20 + Math.floor(Math.random() * 21);
            for (let i = 0; i < numLikes; i++) {
                const frame = frames[Math.floor(Math.random() * frames.length)];
                await client.query(
                    `INSERT INTO likes (user_id, frame_id, created_at)
                     VALUES ($1, $2, NOW() - (random() * interval '30 days'))
                     ON CONFLICT DO NOTHING`,
                    [user.id, frame.id]
                );
            }
        }

        // 5. Create Comments
        console.log('💬 Generating Discussions...');
        for (const frame of frames) {
            // 60% chance a frame has comments (higher engagement)
            if (Math.random() > 0.4) {
                const numComments = 1 + Math.floor(Math.random() * 6);
                for (let i = 0; i < numComments; i++) {
                    const commenter = dbUsers[Math.floor(Math.random() * dbUsers.length)];
                    const text = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
                    await client.query(
                        `INSERT INTO comments (user_id, frame_id, text, created_at)
                         VALUES ($1, $2, $3, NOW() - (random() * interval '30 days'))`,
                        [commenter.id, frame.id, text]
                    );
                }
            }
        }

        // 6. Remixes
        console.log('🔄 Generating Remix Ecosystem...');
        // Let's create ~20 remixes total
        for (let i = 0; i < 20; i++) {
            const parent = frames[Math.floor(Math.random() * frames.length)];
            const creator = dbUsers[Math.floor(Math.random() * dbUsers.length)];

            // Don't remix own frame generally (though legal)
            if (creator.id === parent.user_id) continue;

            const parentConfig = typeof parent.config === 'string' ? JSON.parse(parent.config) : parent.config;

            const newConfig = {
                ...parentConfig,
                id: crypto.randomUUID(),
                color1: '#ffffff', // Remixes often go monochrome or invert
                name: `${parentConfig.name} [Remix]`
            };

            await client.query(
                `INSERT INTO frames (user_id, name, description, config, parent_id, created_at, tags)
                 VALUES ($1, $2, $3, $4, $5, NOW(), $6)`,
                [
                    creator.id,
                    `${parent.name} Remix`,
                    `Remixed version of ${parent.name}.`,
                    JSON.stringify(newConfig),
                    parent.id,
                    ['Remix', ...parent.tags || []]
                ]
            );
        }

        console.log('✅ Seeding Complete! generated 100+ frames with tags and interactions.');

    } catch (err) {
        console.error('❌ Seeding Failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
