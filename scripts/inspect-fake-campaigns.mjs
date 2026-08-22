import { readFileSync, existsSync } from 'fs';
import { neon } from '@neondatabase/serverless';

function loadEnv() {
    for (const f of ['.env.local', '.env']) {
        if (!existsSync(f)) continue;
        for (const line of readFileSync(f, 'utf8').split('\n')) {
            const m = line.match(/^([^#=]+)=(.*)$/);
            if (!m) continue;
            const k = m[1].trim();
            if (!process.env[k]) process.env[k] = m[2].trim().replace(/^["']|["']$/g, '');
        }
    }
}

loadEnv();
const sql = neon(process.env.DATABASE_URL);

const top = await sql`
  SELECT slug, title, supporter_count, is_hidden, creator_name, created_at
  FROM campaigns
  WHERE is_public = true AND is_hidden IS NOT TRUE
  ORDER BY COALESCE(supporter_count, 0) DESC
  LIMIT 15
`;
console.log('TOP BY COUNT:');
console.log(top);

const named = await sql`
  SELECT slug, title, supporter_count, is_hidden, creator_name,
    (SELECT COUNT(*)::int FROM campaign_uses u WHERE u.campaign_id = c.id) AS real_uses
  FROM campaigns c
  WHERE title ILIKE '%reef%'
     OR title ILIKE '%team usa%'
     OR title ILIKE '%support team%'
     OR slug ILIKE '%reef%'
     OR slug ILIKE '%team-usa%'
     OR slug ILIKE '%usa%'
`;
console.log('NAMED MATCHES:');
console.log(named);

const inflated = await sql`
  SELECT c.slug, c.title, c.supporter_count,
    (SELECT COUNT(*)::int FROM campaign_uses u WHERE u.campaign_id = c.id) AS real_uses
  FROM campaigns c
  WHERE COALESCE(c.supporter_count, 0) > 0
  ORDER BY c.supporter_count DESC
  LIMIT 20
`;
console.log('COUNT VS REAL USES:');
console.log(inflated);
