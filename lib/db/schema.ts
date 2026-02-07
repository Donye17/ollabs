import { pgTable, index, foreignKey, unique, text, timestamp, uuid, boolean, jsonb, integer, serial, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "session_userId_fkey"
	}).onDelete("cascade"),
	unique("session_token_key").on(table.token),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "account_userId_fkey"
	}).onDelete("cascade"),
]);

export const notifications = pgTable("notifications", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	actorId: text("actor_id").notNull(),
	type: text().notNull(),
	entityId: uuid("entity_id").notNull(),
	read: boolean().default(false),
	metadata: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_notifications_created_at").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_notifications_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const collections = pgTable("collections", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	description: text(),
	isPublic: boolean("is_public").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_collections_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
		columns: [table.userId],
		foreignColumns: [user.id],
		name: "collections_user_id_fkey"
	}).onDelete("cascade"),
]);

export const collectionItems = pgTable("collection_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	collectionId: uuid("collection_id").notNull(),
	frameId: uuid("frame_id").notNull(),
	addedAt: timestamp("added_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_collection_items_collection_id").using("btree", table.collectionId.asc().nullsLast().op("uuid_ops")),
	index("idx_collection_items_frame_id").using("btree", table.frameId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
		columns: [table.collectionId],
		foreignColumns: [collections.id],
		name: "collection_items_collection_id_fkey"
	}).onDelete("cascade"),
	foreignKey({
		columns: [table.frameId],
		foreignColumns: [frames.id],
		name: "collection_items_frame_id_fkey"
	}).onDelete("cascade"),
	unique("collection_items_collection_id_frame_id_key").on(table.collectionId, table.frameId),
]);

export const userProfiles = pgTable("user_profiles", {
	id: text().primaryKey().notNull(),
	username: text().notNull(),
	bio: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("user_profiles_username_key").on(table.username),
]);

export const frames = pgTable("frames", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	creatorId: text("creator_id").notNull(),
	name: text().notNull(),
	config: jsonb().notNull(),
	isPublic: boolean("is_public").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	likesCount: integer("likes_count").default(0),
	creatorName: text("creator_name").default('Unknown'),
	description: text(),
	viewsCount: integer("views_count").default(0),
	tags: text().array().default([""]),
	previewUrl: text("preview_url"),
	mediaType: text("media_type").default('image/png'),
}, (table) => [
	index("idx_frames_tags").using("gin", table.tags.asc().nullsLast().op("array_ops")),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	// createdAt: timestamp("created_at", { mode: 'string' }),
	// updatedAt: timestamp("updated_at", { mode: 'string' }),
	// expiresAt: timestamp({ withTimezone: true, mode: 'string' }),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean().notNull(),
	image: text(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	role: text(),
	bio: text(),
	location: text(),
	website: text(),
	socialLinks: jsonb("social_links").default({}),
	isVerified: boolean("isverified").default(false),
}, (table) => [
	unique("user_email_key").on(table.email),
]);

export const frameComments = pgTable("frame_comments", {
	id: serial().primaryKey().notNull(),
	frameId: uuid("frame_id").notNull(),
	userId: text("user_id").notNull(),
	content: text().notNull(),
	userName: text("user_name"),
	userImage: text("user_image"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_frame_comments_frame_id").using("btree", table.frameId.asc().nullsLast().op("uuid_ops")),
]);

export const frameLikes = pgTable("frame_likes", {
	frameId: uuid("frame_id").notNull(),
	userId: text("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.frameId],
		foreignColumns: [frames.id],
		name: "frame_likes_frame_id_fkey"
	}).onDelete("cascade"),
	primaryKey({ columns: [table.frameId, table.userId], name: "frame_likes_pkey" }),
]);

export const userFavorites = pgTable("user_favorites", {
	userId: text("user_id").notNull(),
	frameId: uuid("frame_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
		columns: [table.frameId],
		foreignColumns: [frames.id],
		name: "user_favorites_frame_id_fkey"
	}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.frameId], name: "user_favorites_pkey" }),
]);

export const likes = pgTable("likes", {
	userId: text("user_id").notNull(),
	frameId: uuid("frame_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	primaryKey({ columns: [table.userId, table.frameId], name: "likes_pkey" }),
]);
