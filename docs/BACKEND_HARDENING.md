# The Whale Backend Hardening Notes

This build replaces earlier raw connector placeholders with a safer, production-style backend layer.

## What changed

### 1. Shared API foundation
- `lib/api.ts` standardizes JSON parsing, validation errors, HTTP errors, text sanitization, and response format.
- API routes now return consistent `{ error, code, details }` objects on failure.

### 2. Real auth and role gates
- `lib/auth.ts` validates the Supabase session on every protected route.
- Admin-only routes use `requireAuth(['admin'])`.
- Generator routes still allow admin, teacher, and staff access.

### 3. Repository layer
- `lib/repositories.ts` centralizes staff lookups, content-review saves, and generation logging.
- Routes no longer scatter direct table-writing logic everywhere.

### 4. Audit logging
- `lib/audit.ts` writes to `audit_logs` for high-value actions:
  - AI generation
  - Preflight checks
  - Ops review
  - Staff profile create/update
  - School Brain search
  - Google Workspace actions

### 5. Brightwheel Companion backend
- `lib/brightwheel.ts` formats content for Brightwheel-style copy/paste.
- It blocks fake claims like “automatically synced to Brightwheel.”
- It returns copy instructions, review checklist, and issues.

### 6. Google Workspace backend
- `lib/googleWorkspace.ts` now has working service-account routes for:
  - Google Docs creation
  - Google Drive folder placement
  - Google Calendar events
  - Gmail drafts
- These require real Google Workspace environment variables.

### 7. AI generation is safer
- `/api/ai/generate` now:
  - authenticates user
  - retrieves School Brain context
  - runs optional preflight validation
  - saves generation outputs
  - writes audit logs

### 8. Staff profiles are operational
- `/api/staff-profiles` supports:
  - GET all profiles
  - POST create/update
  - admin-only writes
  - clean list parsing for certifications, strengths, growth areas, and do-not-say notes

## Required live environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_CALENDAR_ID=
GOOGLE_IMPERSONATE_USER=
```

`GOOGLE_IMPERSONATE_USER` is only needed if the Workspace service account uses domain-wide delegation.

## Verified

- `npm run typecheck` passes.
- `next build` compiled successfully, then the sandbox timed out while Next.js continued production optimization. Re-run locally or on Vercel after adding environment variables.

## Remaining production work

Before a real school deployment:

1. Add actual staff/classroom data.
2. Add real Google Workspace service credentials.
3. Configure Supabase auth and RLS using `supabase/schema.sql`.
4. Create the first admin profile manually in Supabase.
5. Run live testing with fake/sandbox parent messages before using with real families.
6. Add legal/privacy review before entering child-specific information.
