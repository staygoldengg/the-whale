# The Whale — PC Executable Build

This package is prepared to become a real Windows desktop app.

## What is included

- Electron desktop shell
- Windows installer configuration
- Portable `.exe` configuration
- Desktop icons
- One-click local launcher: `Run-The-Whale-PC.bat`
- Windows executable builder: `Build-Windows-EXE.bat`
- GitHub Actions workflow that builds the `.exe` on a Windows runner

## Fastest local test

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase and OpenAI keys.
4. Double-click:

```txt
Run-The-Whale-PC.bat
```

This opens the app in a desktop window.

## Build the real Windows `.exe`

On Windows:

```txt
Build-Windows-EXE.bat
```

Or run:

```bash
npm install
npm run desktop:build:win
```

Output appears in:

```txt
release/
```

You should see files like:

```txt
The-Whale-Setup-1.0.0.exe
The-Whale-Portable-1.0.0.exe
```

## Best way if you are on Android or Chromebook

Push this project to GitHub and run the included workflow:

```txt
.github/workflows/windows-exe.yml
```

GitHub will build the Windows executable and give you a downloadable artifact.

## Important

A real `.exe` cannot be created just by opening the source zip on a phone. The source has to be built on Windows or a Windows build runner. This package now contains the desktop wrapper and build automation needed to produce the installer.
