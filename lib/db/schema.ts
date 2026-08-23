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
	// Set to organizers.id (as text) when the creator is signed in or later
	// claims the campaign. Still nullable for anonymous publishes.
	creatorId: text("creator_id"),
	creatorName: text("creator_name").default('Anonymous'),
	supporterCount: integer("supporter_count").default(0),
	viewCount: integer("view_count").default(0),
	goal: integer("goal"),
	category: text("category"),
	// Awareness-day attribution when the builder was opened from /day/[slug].
	daySlug: text("day_slug"),
	referrerSlug: text("referrer_slug"),
	ownerToken: text("owner_token"),
	/** SHA-256 hex of owner_token. Dual-read with plaintext during migration. */
	ownerTokenHash: text("owner_token_hash"),
	previewUrl: text("preview_url"),
	isPublic: boolean("is_public").default(true),
	isHidden: boolean("is_hidden").default(false),
	// Optional. Creating a campaign never requires an account; this exists only
	// so an organizer can recover their dashboard after switching devices.
	organizerEmail: text("organizer_email"),
	emailSentAt: timestamp("email_sent_at", { withTimezone: true, mode: 'string' }),
	milestoneNotified: integer("milestone_notified").default(0),
	publisherCountry: text("publisher_country"),
	firstSupporterCountry: text("first_supporter_country"),
	firstSupporterEmailedAt: timestamp("first_supporter_emailed_at", { withTimezone: true, mode: 'string' }),
	zeroSupporterEmailedAt: timestamp("zero_supporter_emailed_at", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_campaigns_slug").using("btree", table.slug.asc().nullsLast()),
	index("idx_campaigns_created_at").using("btree", table.createdAt.desc().nullsLast()),
	index("idx_campaigns_category").using("btree", table.category.asc().nullsLast()),
	index("idx_campaigns_day_slug").using("btree", table.daySlug.asc().nullsLast()),
	index("idx_campaigns_referrer_slug").using("btree", table.referrerSlug.asc().nullsLast()),
	index("idx_campaigns_organizer_email").using("btree", table.organizerEmail.asc().nullsLast()),
	index("idx_campaigns_publisher_country").using("btree", table.publisherCountry.asc().nullsLast()),
	index("idx_campaigns_first_supporter_country").using("btree", table.firstSupporterCountry.asc().nullsLast()),
	unique("campaigns_slug_key").on(table.slug),
]);

// Old /c/[slug] links keep working after an organizer renames their URL.
export const campaignSlugRedirects = pgTable("campaign_slug_redirects", {
	oldSlug: text("old_slug").primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_slug_redirects_campaign").using("btree", table.campaignId.asc().nullsLast()),
	foreignKey({
		columns: [table.campaignId],
		foreignColumns: [campaigns.id],
		name: "campaign_slug_redirects_campaign_id_fkey"
	}).onDelete("cascade"),
]);

// Runtime frame art for /day pages (override → bundled file → colour ring).
export const dayFrameOverrides = pgTable("day_frame_overrides", {
	slug: text().primaryKey().notNull(),
	imageUrl: text("image_url").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
]);

export const campaignUses = pgTable("campaign_uses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	userId: text("user_id"),
	// Set only when a supporter opts in to the supporter wall.
	imageUrl: text("image_url"),
	supporterCountry: text("supporter_country"),
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

// --------------------------------------------------------------------------
// Optional organizer accounts (migration 0011).
//
// Creating a campaign still needs no account and supporters still never sign
// in. These three tables exist so an organizer can reach their dashboard from a
// device that is not the one they created on. campaigns.creator_id holds
// organizers.id as text, since that column predates these tables.
// --------------------------------------------------------------------------

export const organizers = pgTable("organizers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	// Always stored lowercased and trimmed.
	email: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	// Optional public hub at /u/[handle]. Null until they claim one after login.
	handle: text(),
	displayName: text("display_name"),
	bio: text(),
	avatarUrl: text("avatar_url"),
	featuredCampaignId: uuid("featured_campaign_id"),
	hubTheme: text("hub_theme").default('default'),
	hubHiddenCampaignIds: jsonb("hub_hidden_campaign_ids").$type<string[]>().default([]),
	supportClickCount: integer("support_click_count").default(0),
	hubUpdatedAt: timestamp("hub_updated_at", { withTimezone: true, mode: 'string' }),
	/** Interest in paid hub upgrades; no billing yet. */
	upgradeInterestedAt: timestamp("upgrade_interested_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	unique("idx_organizers_email").on(table.email),
]);

// Short-lived manage cookies after a successful k= verify (see lib/ownerToken.ts).
export const campaignManageSessions = pgTable("campaign_manage_sessions", {
	tokenHash: text("token_hash").primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_manage_sessions_campaign").using("btree", table.campaignId.asc().nullsLast()),
	index("idx_manage_sessions_expires").using("btree", table.expiresAt.asc().nullsLast()),
	foreignKey({
		columns: [table.campaignId],
		foreignColumns: [campaigns.id],
		name: "campaign_manage_sessions_campaign_id_fkey"
	}).onDelete("cascade"),
]);

// Extra buttons on the organizer hub (Instagram, donate, press kit, …).
export const organizerHubLinks = pgTable("organizer_hub_links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	organizerId: uuid("organizer_id").notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	clickCount: integer("click_count").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_hub_links_organizer").using("btree", table.organizerId.asc().nullsLast(), table.sortOrder.asc().nullsLast()),
	foreignKey({
		columns: [table.organizerId],
		foreignColumns: [organizers.id],
		name: "organizer_hub_links_organizer_id_fkey"
	}).onDelete("cascade"),
]);

// Six digit sign-in codes, stored hashed. Codes rather than magic links because
// most organizers open Ollabs inside an in-app browser, where a mailed link
// launches a different browser and signs in a session they cannot see.
export const organizerLoginCodes = pgTable("organizer_login_codes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	codeHash: text("code_hash").notNull(),
	attempts: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("idx_login_codes_email").using("btree", table.email.asc().nullsLast()),
	index("idx_login_codes_expires").using("btree", table.expiresAt.asc().nullsLast()),
]);

// Session tokens are hashed too. The plaintext lives only in the user's cookie.
export const organizerSessions = pgTable("organizer_sessions", {
	tokenHash: text("token_hash").primaryKey().notNull(),
	organizerId: uuid("organizer_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("idx_organizer_sessions_organizer").using("btree", table.organizerId.asc().nullsLast()),
	index("idx_organizer_sessions_expires").using("btree", table.expiresAt.asc().nullsLast()),
	foreignKey({
		columns: [table.organizerId],
		foreignColumns: [organizers.id],
		name: "organizer_sessions_organizer_id_fkey"
	}).onDelete("cascade"),
]);
