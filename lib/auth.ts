import { betterAuth } from "better-auth";
import { pool } from "./neon";

export const auth = betterAuth({
    database: pool,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!
        }
    },
    user: {
        additionalFields: {
            image: { type: "string", required: false },
            role: { type: "string", required: false, defaultValue: "user" }
        }
    },
    trustedOrigins: ["https://ollabs.studio", "http://localhost:3000"]
});
