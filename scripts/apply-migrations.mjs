/**
 * Apply pending drizzle SQL migrations (0014, 0015).
 * Usage: node scripts/apply-migrations.mjs
 * Requires DATABASE_URL in .env.local or environment.
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
    const path = join(root, '.env.local');
    if (!existsSync(path)) return;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (!m) continue;
        const key = m[1].trim();
        if (!process.env[key]) process.env[key] = m[2].trim().replace(/^["']|["']$/g, '');
    }
}

loadEnv();
const url = process.env.DATABASE_URL;
if (!url) {
    console.error('DATABASE_URL not set');
    process.exit(1);
}

const sql = neon(url);
const files = ['0014_publisher_country.sql', '0015_supporter_country.sql', '0016_first_supporter_emailed.sql'];

for (const file of files) {
    const raw = readFileSync(join(root, 'drizzle', file), 'utf8');
    const statements = raw
        .split('--> statement-breakpoint')
        .map((s) => s.replace(/^--[^\n]*\n?/gm, '').trim())
        .filter(Boolean);
    console.log(`Applying ${file} (${statements.length} statements)...`);
    for (const stmt of statements) {
        await sql.query(stmt);
    }
}

console.log('Done.');
