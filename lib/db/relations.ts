import { relations } from "drizzle-orm/relations";
import { user, session, account, collections, collectionItems, frames, frameLikes, userFavorites } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	collections: many(collections),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const collectionsRelations = relations(collections, ({one, many}) => ({
	user: one(user, {
		fields: [collections.userId],
		references: [user.id]
	}),
	collectionItems: many(collectionItems),
}));

export const collectionItemsRelations = relations(collectionItems, ({one}) => ({
	collection: one(collections, {
		fields: [collectionItems.collectionId],
		references: [collections.id]
	}),
	frame: one(frames, {
		fields: [collectionItems.frameId],
		references: [frames.id]
	}),
}));

export const framesRelations = relations(frames, ({many}) => ({
	collectionItems: many(collectionItems),
	frameLikes: many(frameLikes),
	userFavorites: many(userFavorites),
}));

export const frameLikesRelations = relations(frameLikes, ({one}) => ({
	frame: one(frames, {
		fields: [frameLikes.frameId],
		references: [frames.id]
	}),
}));

export const userFavoritesRelations = relations(userFavorites, ({one}) => ({
	frame: one(frames, {
		fields: [userFavorites.frameId],
		references: [frames.id]
	}),
}));