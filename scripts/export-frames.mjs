// One-off: rescue the real artwork out of the `frames` table before it is dropped.
//
// Migration 0008 drops `frames` along with the rest of the dead social model.
// Most of that table is seed data (creators like "Kai Takemura", images pointing
// at picsum.photos, a row called "Test Animated Frame"). Three things in it are
// not seed data and would be lost:
//
//   1. 32 country flag frames, ~119 KB total, each carrying a real base64 PNG.
//      Includes Brazil, which matters when 96.7% of traffic is Brazilian and
//      Sete de Setembro falls inside the campaign window.
//   2. "flowy glass tile" by mimi, a 4.4 MB PNG upload from a real user.
//   3. "Blue Sky" by Josh Russo, a 2.0 MB JPEG upload.
//
// Run once, from the repo root, before applying 0008:
//
//   node scripts/export-frames.mjs
//
// Writes decoded images to public/frames/ and a manifest to
// lib/rescuedFrames.json. Reads only, changes nothing in the database.

import { Pool } from '@neondatabase/serverless';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_IMAGES = join(process.cwd(), 'public', 'frames');
const OUT_MANIFEST = join(process.cwd(), 'lib', 'rescuedFrames.json');

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Try: node --env-file=.env.local scripts/export-frames.mjs');
    process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/** "Brazil Flag" -> "brazil-flag" */
function slugify(name) {
    return String(name || 'frame')
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'frame';
}

/** Split a data URL into its extension and raw bytes. Returns null for plain URLs. */
function decodeDataUrl(value) {
    if (typeof value !== 'string') return null;
    const match = /^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(value);
    if (!match) return null;
    const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
    return { ext, buffer: Buffer.from(match[2], 'base64') };
}

async function main() {
    await mkdir(OUT_IMAGES, { recursive: true });

    // Flags, plus anything carrying a genuinely large embedded image. The size
    // floor is what separates a real upload from a seed row: seed configs are
    // roughly 300 bytes because they only hold colours and a width.
    const { rows } = await pool.query(`
        SELECT id, name, creator_name, tags, config, created_at,
               pg_column_size(config)::bigint AS bytes
        FROM frames
        WHERE ('flag' = ANY(tags)) OR pg_column_size(config) > 100000
        ORDER BY ('flag' = ANY(tags)) DESC, name
    `);

    if (rows.length === 0) {
        console.log('Nothing to export. The frames table may already be gone.');
        return;
    }

    const manifest = [];
    const used = new Set();
    let written = 0;
    let skipped = 0;

    for (const row of rows) {
        const config = typeof row.config === 'string' ? JSON.parse(row.config) : row.config;
        const source = config?.imageUrl ?? config?.customImageUrl ?? config?.src ?? null;
        const decoded = decodeDataUrl(source);

        // Keep filenames unique without clobbering: two rows can share a name.
        let base = slugify(row.name);
        let candidate = base;
        let n = 2;
        while (used.has(candidate)) candidate = `${base}-${n++}`;
        used.add(candidate);

        let file = null;
        if (decoded) {
            file = `${candidate}.${decoded.ext}`;
            await writeFile(join(OUT_IMAGES, file), decoded.buffer);
            written += 1;
        } else {
            // A picsum.photos link or no image at all. Record it, write nothing.
            skipped += 1;
        }

        // Strip the image out of the stored config; the file on disk replaces it.
        const { imageUrl, customImageUrl, src, ...rest } = config ?? {};
        manifest.push({
            name: row.name,
            slug: candidate,
            file: file ? `/frames/${file}` : null,
            tags: row.tags ?? [],
            creator: row.creator_name ?? null,
            createdAt: row.created_at,
            originalBytes: Number(row.bytes),
            config: rest,
        });
    }

    await writeFile(OUT_MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

    console.log(`Rescued ${rows.length} frames.`);
    console.log(`  ${written} images written to public/frames/`);
    if (skipped) console.log(`  ${skipped} had no embedded image (external or none), recorded in the manifest only`);
    console.log(`  manifest: lib/rescuedFrames.json`);
    console.log('');
    console.log('Check public/frames/ looks right, then 0008 is safe to run.');
}

main()
    .catch((e) => { console.error('Export failed:', e); process.exitCode = 1; })
    .finally(() => pool.end());
