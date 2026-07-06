# The Whale — Westhampton Day School AI Companion

> **AI-powered operations platform for preschool administrators and teachers**  
> **Free to host • Free to access • Works on mobile & desktop**

---

## 🚀 **Quick Start: Deploy in 5 Minutes**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy to Vercel (free hosting)
vercel --prod

# 3. Add env vars in Vercel dashboard
# → Then visit: thewhale.westhampton.app ✨

# 4. Every git push auto-deploys!
git push origin main
```

**See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step guide.**

---

## 🆓 **100% Free to Run**

- ✅ **Hosting:** Vercel (free tier, $0/month)
- ✅ **Database:** Supabase (free tier, $0/month)
- ✅ **SSL/Domain:** Included (free)
- ✅ **AI Generation:** Optional ($0-100/month, pay-as-you-go)
- ✅ **Deployment:** Automatic (free)

**See [FREE-TIER.md](FREE-TIER.md) for cost breakdown & limits.**

---

## 📱 **Access Anywhere**

| Device | How to Access |
|--------|--------------|
| **Desktop Browser** | Visit `thewhale.westhampton.app` |
| **iPhone/iPad** | Safari → Share → Add to Home Screen |
| **Android Phone** | Chrome → Menu → Install app |
| **Windows/Mac** | Desktop app (see `desktop:build` script) |

---

## What is included

- Next.js + React + TypeScript + Tailwind CSS
- Supabase Auth with roles: `admin`, `teacher`, `staff`
- Supabase/Postgres schema with RLS policies
- AI generation route using Groq API (free open-source LLM via Mixtral 8x7B)
- School Brain central context service
- Staff profiles for name spelling, pronouns, classroom, tone preferences, and career goals
- Preflight validation for Brightwheel-ready messages
- Brightwheel Companion formatting page
- Google Workspace API routes for Docs, Drive, Calendar, and Gmail actions when credentials are configured
- Administrator Command Center
- Teacher Workspace
- Guided Lesson Planner with validation and quality scoring
- Staff Feedback module
- Resource Library approval workflow
- Notification Center
- Analytics summary route
- Anonymous polls, schedules, live updates, AI index library, parent messages, weekly plans, coloring prompts, and career path builder
- Desktop/PWA/mobile-ready packaging configuration

## Operational principle

Brightwheel does not need to be replaced. The Whale creates reviewed, copy-ready messages and exports longer planning documents to Google Workspace. Direct Brightwheel posting should only be added if an official integration is made available.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Enable email login in Supabase Auth.
5. Create a first user through the app login.
6. In Supabase, update that user in `profiles` to role `admin`.
7. Run the seed script if needed:

```bash
npm run seed
```

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
# Groq API key (free tier: https://groq.com) - uses open-source Mixtral model
GROQ_API_KEY=

# Optional Google Workspace connector activation
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_CALENDAR_ID=
GOOGLE_IMPERSONATE_EMAIL=
```

## v2.0 routes added

- `/dashboard/admin-command-center`
- `/dashboard/teacher-workspace`
- `/dashboard/lesson-planner`
- `/dashboard/staff-feedback`
- `/dashboard/resource-library`
- `/dashboard/notification-center`
- `/dashboard/analytics`
- `/api/schoolos/dashboard`
- `/api/schoolos/lesson-plan`
- `/api/schoolos/feedback`
- `/api/schoolos/resources`
- `/api/schoolos/notifications`
- `/api/schoolos/analytics`

## Validation status

`npm run typecheck` passes after dependencies are installed.

## Production checklist

Before real school deployment:

- Confirm school approval and data policy.
- Enter real staff profiles.
- Enter real classroom names and routines.
- Add official school procedures and communication rules.
- Add Google Workspace service account credentials.
- Keep Brightwheel in companion mode unless official integration support is confirmed.
- Review RLS policies with the school's technical owner.
- Test admin, teacher, and staff roles separately.
