import fs from 'node:fs';
const config = `/** @type {import('next').NextConfig} */\nconst nextConfig = { output: 'standalone', poweredByHeader: false, images: { unoptimized: true } };\nexport default nextConfig;\n`;
fs.writeFileSync('next.config.mjs', config);
console.log('next.config.mjs switched to standalone mode for Electron desktop builds.');
