import { relations } from "drizzle-orm/relations";
import { campaigns, campaignUses, campaignReports } from "./schema";

// Everything hangs off a campaign now. The old user/session/frames/collections
// graph went away with migration 0008.

export const campaignsRelations = relations(campaigns, ({ many }) => ({
	uses: many(campaignUses),
	reports: many(campaignReports),
}));

export const campaignUsesRelations = relations(campaignUses, ({ one }) => ({
	campaign: one(campaigns, {
		fields: [campaignUses.campaignId],
		references: [campaigns.id],
	}),
}));

export const campaignReportsRelations = relations(campaignReports, ({ one }) => ({
	campaign: one(campaigns, {
		fields: [campaignReports.campaignId],
		references: [campaigns.id],
	}),
}));
