# The Whale installable builds

The Whale has three install paths:

## 1. Fastest production path: hosted app + PWA install

Deploy the app to Vercel, connect Supabase/OpenAI/Google environment variables, then users can install it from Chrome/Edge/Safari as a phone or desktop app.

```bash
npm install
npm run build
```

On Android/Chrome: open the deployed URL, tap menu, then **Install app**.
On iPhone/Safari: open the deployed URL, Share, then **Add to Home Screen**.
On Windows/Chrome or Edge: open the deployed URL, click install icon.

## 2. PC executable

This uses Electron and bundles the Next.js standalone server inside a desktop shell.

```bash
npm install
npm run desktop:build
```

Output appears in `release/` as a Windows installer when built on Windows. Cross-building Windows installers from Linux may require Wine and signing setup.

## 3. Android app wrapper

For the cleanest mobile app, first deploy The Whale to Vercel and set `server.url` in `capacitor.config.ts` to that deployed URL. Then:

```bash
npm install
npm run mobile:android
```

Android Studio opens. Build an APK or signed AAB from there.

## Required services before operational use

- Supabase project
- Supabase SQL schema applied
- Supabase Auth enabled
- First admin profile created
- OpenAI API key added
- Google Workspace OAuth/service credentials added for Docs/Drive exports
- Vercel deployment or desktop/mobile build environment

## Why Brightwheel is companion-mode

Brightwheel does not appear to expose a general public API for direct posting from third-party apps. The Whale therefore uses Brightwheel-ready formatting, copy-to-clipboard, CSV import/export, and review checks instead of pretending to directly sync messages.
