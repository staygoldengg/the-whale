import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.westhampton.thewhale',
  appName: 'The Whale',
  webDir: 'out',
  server: {
    // For production mobile builds, point this to your deployed Vercel URL.
    // url: 'https://the-whale.your-school-domain.org',
    cleartext: false
  }
};

export default config;
