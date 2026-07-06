import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'vercel.json',
  'supabase/schema.sql',
  'scripts/seed-ai-index.ts',
  'app/api/ai/generate/route.ts',
  'app/api/validate/preflight/route.ts',
  'app/dashboard/page.tsx'
];

const requiredEnv = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY'
];

let failed = false;
console.log('\nThe Whale deployment preflight\n');

for (const file of requiredFiles) {
  const exists = fs.existsSync(path.join(root, file));
  console.log(`${exists ? '✓' : '✗'} ${file}`);
  if (!exists) failed = true;
}

console.log('\nEnvironment variables');
for (const key of requiredEnv) {
  const value = process.env[key];
  const ok = Boolean(value && !value.includes('YOUR_') && value.trim().length > 8);
  console.log(`${ok ? '✓' : '✗'} ${key}`);
  if (!ok) failed = true;
}

const googleKeys = ['GOOGLE_CLIENT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_DRIVE_FOLDER_ID'];
const googleReady = googleKeys.every((key) => Boolean(process.env[key]));
console.log(`\n${googleReady ? '✓' : '•'} Google Workspace export ${googleReady ? 'configured' : 'not configured yet; app can still deploy'}`);

if (failed) {
  console.error('\nPreflight failed. Add missing files/env vars before production deploy.');
  process.exit(1);
}

console.log('\nPreflight passed. Ready for Vercel build/deploy.');
