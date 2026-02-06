const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const USERS = [
    { name: 'Sarah Chen', email: 'sarah.c@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4' },
    { name: 'Marcus Rodriguez', email: 'm.rodriguez@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede' },
    { name: 'Emma Wilson', email: 'emma.w@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffdfbf' },
    { name: 'David Kim', email: 'david.k@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=d1d4f9' },
    { name: 'Jessica Patel', email: 'j.patel@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=ffd5dc' },
    { name: 'Alex Thompson', email: 'alex.t@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede' },
    { name: 'Olivia Brown', email: 'olivia.b@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia&backgroundColor=b6e3f4' },
    { name: 'Ryan Connor', email: 'ryan.c@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan&backgroundColor=d1d4f9' },
    { name: 'Sofia Garcia', email: 'sofia.g@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=ffd5dc' },
    { name: 'Lucas Wright', email: 'lucas.w@example.com', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=ffdfbf' }
];

const FRAME_TEMPLATES = [
    { name: 'Cyberpunk Neon', type: 'NEON', color1: '#00ff9d', color2: '#00b8ff', width: 15, tags: ['Neon', 'Cyberpunk', 'Futuristic', 'Glow'] },
    { name: 'Sunset Gradient', type: 'GRADIENT', color1: '#ff6b6b', color2: '#feca57', width: 20, tags: ['Summer', 'Gradient', 'Warm', 'Sunset'] },
    { name: 'Royal Gold', type: 'DOUBLE', color1: '#ffd700', color2: '#b8860b', width: 25, tags: ['Gold', 'Luxury', 'Royal', 'Elegant'] },
    { name: 'Minimalist White', type: 'SOLID', color1: '#ffffff', width: 10, tags: ['Minimal', 'Clean', 'White', 'Simple'] },
    { name: 'Glitch Effect', type: 'DASHED', color1: '#ff0055', color2: '#00ffff', width: 12, tags: ['Glitch', 'Tech', 'Cyber', 'Distorted'] },
    { name: 'Memphis Pop', type: 'MEMPHIS', color1: '#ff9ff3', color2: '#54a0ff', width: 18, tags: ['Retro', 'Pop', 'Memphis', 'Colorful'] },
    { name: 'Geometric Tech', type: 'GEOMETRIC', color1: '#5f27cd', color2: '#341f97', width: 22, tags: ['Tech', 'Geometric', 'Purple', 'Modern'] },
    { name: 'Love Core', type: 'HEART', color1: '#ff4757', color2: '#ff6b81', width: 16, tags: ['Love', 'Heart', 'Cute', 'Pink'] },
    { name: 'Starlight', type: 'STAR', color1: '#f1c40f', color2: '#f39c12', width: 14, tags: ['Stars', 'Space', 'Magic', 'Yellow'] },
    { name: 'Hex Shield', type: 'HEXAGON', color1: '#2ecc71', color2: '#27ae60', width: 20, tags: ['Gamer', 'Hex', 'Green', 'Shield'] },
    { name: 'Vaporwave', type: 'GRADIENT', color1: '#ff71ce', color2: '#01cdfe', width: 24, tags: ['Vaporwave', 'Aesthetic', 'Retro', 'Pink'] },
    { name: 'Stealth Ops', type: 'DASHED', color1: '#2f3542', color2: '#57606f', width: 15, tags: ['Dark', 'Tactical', 'Minimal', 'Stealth'] },
    { name: 'Golden Hour', type: 'NEON', color1: '#ff9ff3', color2: '#feca57', width: 20, tags: ['Gradient', 'Neon', 'Sunset', 'Vibe'] },
    { name: 'Ice & Fire', type: 'DOUBLE', color1: '#ee5253', color2: '#48dbfb', width: 22, tags: ['Contrast', 'Blue', 'Red', 'Fire'] },
    { name: 'Forest Deep', type: 'SOLID', color1: '#10ac84', width: 18, tags: ['Nature', 'Green', 'Forest', 'Organic'] }
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
        const tables = ['notifications', 'comments', 'likes', 'frames', 'users'];
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
                 VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW(), NOW()) 
                 RETURNING *`,
                [u.name, u.email, u.image]
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
                const config = {
                    id: crypto.randomUUID(),
                    ...template,
                    width: Math.max(5, template.width + Math.floor(Math.random() * 8 - 4)), // Variation +/- 4px
                    // Occasionally swap colors for more variety
                    color1: Math.random() > 0.8 ? template.color2 || template.color1 : template.color1
                };

                // Pick 2-4 tags from template
                const shuffledTags = template.tags.sort(() => 0.5 - Math.random());
                const selectedTags = shuffledTags.slice(0, 2 + Math.floor(Math.random() * 3));

                const res = await client.query(
                    `INSERT INTO frames (user_id, name, description, config, created_at, tags)
                     VALUES ($1, $2, $3, $4, NOW() - (random() * interval '60 days'), $5)
                     RETURNING *`,
                    [
                        user.id,
                        `${template.name} #${i + 1}`,
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
