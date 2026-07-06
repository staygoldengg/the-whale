# Step 4 — Deploy The Whale Web App

This package is now prepared for Step 4: deploying the web/PWA version so staff can open it from a browser and install it on phones.

## What you need before deployment

- Supabase project created
- `supabase/schema.sql` already run
- First admin user created through the app auth screen
- Admin role applied using `supabase/admin-bootstrap.sql`
- OpenAI API key
- Vercel account connected to your GitHub repo, or Vercel CLI installed locally

## 1. Copy env file

```bash
cp .env.vercel.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Google Workspace variables can stay blank until Docs/Drive exports are activated.

## 2. Local test

```bash
npm install
npm run typecheck
npm run deploy:preflight
npm run dev
```

Open:

```text
http://localhost:3000
```

Test login, dashboard, AI generation, validation, and Staff Profiles.

## 3. Vercel deployment path A — easiest GitHub flow

1. Push this folder to GitHub.
2. Go to Vercel.
3. Import the GitHub repository.
4. Framework should detect as Next.js.
5. Add the same env vars from `.env.vercel.example`.
6. Deploy.

After deployment, the app becomes installable as a PWA on mobile and desktop browsers.

## 4. Vercel deployment path B — CLI

Install Vercel CLI once:

```bash
npm i -g vercel
```

Deploy preview:

```bash
vercel
```

Deploy production:

```bash
vercel --prod
```

Or use the included script:

```bash
npm run deploy:vercel
```

## 5. Required post-deploy test

On the deployed Vercel URL, test:

- Sign in
- Dashboard loads
- AI generation works
- Preflight review catches spelling/pronoun issues
- Staff profile saves
- School Brain search returns approved items
- Brightwheel Companion copy-ready output works
- Mobile browser shows install option

## 6. Mobile install after deployment

On Android Chrome:

1. Open the deployed Vercel URL.
2. Tap menu.
3. Tap **Add to Home screen** or **Install app**.
4. Launch The Whale from the home screen.

On iPhone Safari:

1. Open the deployed URL.
2. Tap Share.
3. Tap **Add to Home Screen**.

## 7. What this step does not do automatically

This package cannot create your private Supabase/Vercel projects or enter private keys for you. Once those values are added, the code is ready for Step 4 deployment.
