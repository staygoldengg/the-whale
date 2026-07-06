# Vercel Launch Checklist

## Required env vars

Add these in Vercel Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
OPENAI_MODEL
```

Optional Google Workspace exports:

```env
GOOGLE_CLIENT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_DRIVE_FOLDER_ID
GOOGLE_CALENDAR_ID
GOOGLE_IMPERSONATE_EMAIL
```

## Build settings

- Framework: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output: Vercel auto-detect

`vercel.json` is included for function duration and security headers.

## Smoke test after deploy

- `/` loads
- `/dashboard` redirects or loads based on auth
- `/dashboard/ops-console` loads for admin
- `/api/validate/preflight` returns a structured result
- AI generation returns result when OpenAI key is valid
