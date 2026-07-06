# Mobile Launcher

This folder is for the hosted mobile app wrapper. Run:

```bash
npm run mobile:hosted -- https://YOUR-DEPLOYED-WHALE-APP.vercel.app
npx cap add android
npm run mobile:sync
cd android
./gradlew assembleDebug
```

Then install `android/app/build/outputs/apk/debug/app-debug.apk` on Android.
