import { pgTable, index, foreignKey, unique, text, timestamp, uuid, boolean, jsonb, integer } from "drizzle-orm/pg-core"

// Campaign-only schema.
//
// The social model (frames, likes, comments, collections, notifications) and
// the better-auth tables were dropped in migration 0008. Everything Ollabs
// does now lives in these four tables.

export const campaigns = pgTable("campaigns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: text().notNull(),
	title: text().notNull(),
	description: text(),
	frameConfig: jsonb("frame_config").notNull(),
	// Nullable and always null today. Kept so organizer accounts can be added
	// later without another migration.
	creatorId: text("creator_id"),
	creatorName: text("creator_name").default('Anonymous'),
	supporterCount: integer("supporter_count").default(0),
	viewCount: integer("view_count").default(0),
	goal: integer("goal"),
	category: text("category"),
	ownerToken: text("owner_token"),
	previewUrl: text("preview_url"),
	isPublic: boolean("is_public").default(true),
	isHidden: boolean("is_hidden").default(false),
	// Optional. Creating a campaign never requires an account; this exists only
	// so an organizer can recover their dashboard after switching devices.
	organizerEmail: text("organizer_email"),
	emailSentAt: timestamp("email_sent_at", { withTimezone: true, mode: 'string' }),
	milestoneNotified: integer("milestone_notified").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_campaigns_slug").using("btree", table.slug.asc().nullsLast()),
	index("idx_campaigns_created_at").using("btree", table.createdAt.desc().nullsLast()),
	index("idx_campaigns_category").using("btree", table.category.asc().nullsLast()),
	index("idx_campaigns_organizer_email").using("btree", table.organizerEmail.asc().nullsLast()),
	unique("campaigns_slug_key").on(table.slug),
]);

export const campaignUses = pgTable("campaign_uses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	userId: text("user_id"),
	// Set only when a supporter opts in to the supporter wall.
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_campaign_uses_campaign_id").using("btree", table.campaignId.asc().nullsLast()),
	foreignKey({
		columns: [table.campaignId],
		foreignColumns: [campaigns.id],
		name: "campaign_uses_campaign_id_fkey"
	}).onDelete("cascade"),
]);

export const campaignReports = pgTable("campaign_reports", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	slug: text().notNull(),
	reason: text(),
	reporterIp: text("reporter_ip"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_campaign_reports_campaign_id").using("btree", table.campaignId.asc().nullsLast()),
	foreignKey({
		columns: [table.campaignId],
		foreignColumns: [campaigns.id],
		name: "campaign_reports_campaign_id_fkey"
	}).onDelete("cascade"),
]);

export const campaignRecoveryTokens = pgTable("campaign_recovery_tokens", {
	token: text().primaryKey().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_recovery_tokens_email").using("btree", table.email.asc().nullsLast()),
	index("idx_recovery_tokens_expires").using("btree", table.expiresAt.asc().nullsLast()),
]);
