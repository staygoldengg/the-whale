import fs from 'node:fs';

const rawUrl = process.env.WHALE_APP_URL || process.argv[2];
if (!rawUrl) {
  console.error('Missing hosted app URL. Usage: npm run mobile:hosted -- https://your-vercel-app.vercel.app');
  process.exit(1);
}

const url = rawUrl.replace(/\/$/, '');
if (!/^https:\/\//.test(url)) {
  console.error('Mobile hosted builds must use an https:// URL.');
  process.exit(1);
}

const config = `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.westhampton.thewhale',
  appName: 'The Whale',
  webDir: 'out',
  server: {
    url: '${url}',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true
  }
};

export default config;
`;

fs.writeFileSync('capacitor.config.ts', config);
fs.writeFileSync('mobile-launcher/APP_URL.txt', `${url}\n`);
console.log(`Configured Capacitor mobile shell for ${url}`);
