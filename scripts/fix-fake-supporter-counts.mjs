/**
 * Reconcile inflated supporter_count with real campaign_uses rows.
 * Hides known demo frames that were seeded with fake traction.
 *
 * Usage: node scripts/fix-fake-supporter-counts.mjs
 */
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

// Demo frames created with injected numbers. Hide so they never reappear on
// home / explore popularity ranks even if someone bumps the count again.
const HIDE_SLUGS = ['save-our-reef', 'support-team-usa'];

const mismatched = await sql`
  SELECT c.id, c.slug, c.title, c.supporter_count,
    (SELECT COUNT(*)::int FROM campaign_uses u WHERE u.campaign_id = c.id) AS real_uses
  FROM campaigns c
  WHERE COALESCE(c.supporter_count, 0)
     <> (SELECT COUNT(*)::int FROM campaign_uses u WHERE u.campaign_id = c.id)
  ORDER BY c.supporter_count DESC NULLS LAST
`;

console.log(`Found ${mismatched.length} campaigns with count != real uses`);
for (const row of mismatched) {
    console.log(`  ${row.slug}: ${row.supporter_count} -> ${row.real_uses}`);
}

const synced = await sql`
  UPDATE campaigns c
  SET supporter_count = sub.real_uses
  FROM (
    SELECT c2.id, COUNT(u.id)::int AS real_uses
    FROM campaigns c2
    LEFT JOIN campaign_uses u ON u.campaign_id = c2.id
    GROUP BY c2.id
  ) sub
  WHERE c.id = sub.id
    AND COALESCE(c.supporter_count, 0) <> sub.real_uses
  RETURNING c.slug, c.supporter_count
`;
console.log(`Synced ${synced.length} campaigns to real use counts`);

const hidden = await sql`
  UPDATE campaigns
  SET is_hidden = true
  WHERE slug = ANY(${HIDE_SLUGS})
  RETURNING slug, title, supporter_count, is_hidden
`;
console.log('Hidden demo campaigns:');
console.log(hidden);

const podium = await sql`
  SELECT c.slug, c.title, c.supporter_count,
    (SELECT COUNT(*)::int FROM campaign_uses u WHERE u.campaign_id = c.id) AS real_uses
  FROM campaigns c
  WHERE c.is_public = true
    AND c.is_hidden IS NOT TRUE
    AND COALESCE(c.supporter_count, 0) >= 5
  ORDER BY c.supporter_count DESC NULLS LAST
  LIMIT 5
`;
console.log('Next podium candidates:');
console.log(podium);
