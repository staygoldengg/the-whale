# The Whale — Mobile tap-to-run setup

A phone cannot run a raw Next.js source folder by opening it. The clean mobile path is:

1. Deploy The Whale to Vercel.
2. Connect Supabase, OpenAI, and Google environment variables.
3. Install it on phones as a PWA, or build an Android APK wrapper that opens the live app.

## Fastest phone install: PWA

After deployment, open the app URL on the phone.

Android Chrome:
- Tap the three-dot menu.
- Tap **Install app** or **Add to Home screen**.
- The Whale opens like an app from the home screen.

IPhone Safari:
- Tap Share.
- Tap **Add to Home Screen**.
- The Whale opens like an app from the home screen.

This is the recommended first operational release because it keeps the backend online and secure.

## Android APK wrapper

Use this when you want an actual `.apk` file.

```bash
npm install
npm run mobile:hosted -- https://YOUR-DEPLOYED-WHALE-APP.vercel.app
npx cap add android
npm run mobile:sync
cd android
./gradlew assembleDebug
```

The debug APK will be created at:

```txt
android/app/build/outputs/apk/debug/app-debug.apk
```

Move that APK to your Android phone, tap it, allow install from unknown sources if prompted, and open **The Whale**.

## Release APK / Play Store build

For a real school distribution, use a signed release build:

```bash
npm run mobile:hosted -- https://YOUR-DEPLOYED-WHALE-APP.vercel.app
npm run mobile:sync
cd android
./gradlew assembleRelease
```

Then sign the APK/AAB using Android Studio or your CI secrets.

## Why the APK points to a hosted app

The Whale has a real backend: Supabase Auth, Postgres, OpenAI routes, Google Workspace routes, audit logs, and role checks. Mobile apps should not store secret backend keys locally. The APK should open the hosted secure backend, while the phone gets a normal app icon experience.
