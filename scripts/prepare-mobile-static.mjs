import fs from 'node:fs';
const config = `/** @type {import('next').NextConfig} */\nconst nextConfig = { output: 'export', images: { unoptimized: true }, trailingSlash: true };\nexport default nextConfig;\n`;
fs.writeFileSync('next.config.mjs', config);
console.log('next.config.mjs switched to static export mode for Capacitor/PWA mobile builds. Restore standalone mode for Electron builds.');
