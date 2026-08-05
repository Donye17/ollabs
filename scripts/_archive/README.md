# Archived scripts

One-off scripts from the pre-campaign era of Ollabs. Moved here on August 1, 2026
rather than deleted, in case any of them is worth reading later.

**Most of these no longer run.** They query tables that migration
`0008_drop_dead_social_tables.sql` removed: `frames`, `likes`, `frame_likes`,
`frame_comments`, `collections`, `collection_items`, `user_favorites`,
`notifications`, `user_profiles`, `user`, `session`, `account`, `verification`.

They fall into four groups:

- **Schema inspection** (`inspect_*`, `debug-db-*`) — ad hoc `information_schema`
  queries written while debugging a migration.
- **One-time migrations** (`migrate-*`, `fix-*`) — already applied to production.
  Superseded by the numbered files in `drizzle/`.
- **User admin** (`delete_user`, `verify-user`, `get_user_id`, `inspect_user`) —
  from when Ollabs had accounts. It does not any more.
- **Flag seeding** (`*_flags*`, `seed-*`, `manual-seed`) — populated the old
  frames gallery.

Still live, in `scripts/`:

| Script | What it does |
|---|---|
| `generate_frames.py` | Generates the designed frame PNGs into `public/frames` |
| `frame_lib.py` | Drawing primitives for the above |
| `build_seed_sql.py` | Emits the campaign seed SQL for the frame set |
| `inspect-db.js` | Generic table lister, still handy against production |
