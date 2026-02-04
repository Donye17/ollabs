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
        },
        twitter: {
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!
        }
    },
    user: {
        additionalFields: {
            image: { type: "string", required: false },
            role: { type: "string", required: false, defaultValue: "user" }
        }
    },
    trustedOrigins: [
        "https://ollabs.studio",
        "http://localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
    ].filter(Boolean) as string[],
    secret: process.env.BETTER_AUTH_SECRET
});
