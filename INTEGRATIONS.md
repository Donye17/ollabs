# 🔌 Ollabs Integration Master Checklist

To activate the "Smooth Running" tech stack and "Viral Engine", you must configure the following services.

## 1. Vercel Environment Variables (Critical)
Go to **Vercel Dashboard > Settings > Environment Variables** and add these:

### A. Authentication (Social Login)
*Get these from Google Cloud Console & Discord Developer Portal.*
- `GOOGLE_CLIENT_ID`: `...`
- `GOOGLE_CLIENT_SECRET`: `...`
- `DISCORD_CLIENT_ID`: `...`
- `DISCORD_CLIENT_SECRET`: `...`
- `NEXT_PUBLIC_APP_URL`: `https://ollabs.studio` (or your vercel url)
- `BETTER_AUTH_SECRET`: `...` (Generate a random string)

#### ⚠️ Important: Redirect URIs
When creating your apps in Google/Discord, you must add these **Redirect URIs**:

**For Google Console:**
- `http://localhost:3000/api/auth/callback/google`
- `https://ollabs.studio/api/auth/callback/google`

**For Discord Developer Portal:**
- `http://localhost:3000/api/auth/callback/discord`
- `https://ollabs.studio/api/auth/callback/discord`
- **Scopes:** `identify`, `email` (The app requests these automatically, no need to check boxes in the URL generator)

### B. Storage (Vercel Blob)
*Get this from Vercel > Storage > Create Blob.*
- `BLOB_READ_WRITE_TOKEN`: `vercel_blob_rw_...`

### C. Database (Already Set)
- `DATABASE_URL`: (You should already have this from Neon)

---

## 2. Antigravity Integrations (MCP)
To give **me** (your AI Agent) superpowers, add these to your MCP Config file (usually `.cursor/mcp.json` or similar, depending on your setup).

### A. GitHub (Manage Code)
Allows me to open PRs, read issues, and manage the repo.
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_pat"
  }
}
```

### B. Sentry (Fix Crashes)
Allows me to see crash reports and fix them automatically.
```json
"sentry": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sentry"],
  "env": {
    "SENTRY_AUTH_TOKEN": "your_sentry_token"
  }
}
```

---

## 3. SEO & Analytics (No Code Needed)
These are already integrated into the codebase, but ensure they are enabled in Vercel.
- **Vercel Web Analytics**: Go to Vercel Dashboard > Analytics > Enable.
- **Vercel Speed Insights**: Go to Vercel Dashboard > Speed Insights > Enable.

---

## 4. Admin Access
Once deployed, claim your ownership:
1. Visit: `https://ollabs.studio/api/admin/claim?secret=ollabs-2026-master-key`
2. Click: "Populate Default Templates" in the Gallery.
