import fs from 'fs';
import path from 'path';

const root = process.cwd();
const ignoreDirs = new Set(['node_modules', '.next', '.git', 'release', 'dist', 'android', 'ios']);
const problems: string[] = [];
const seenRel = new Map<string, string>();
const unfinishedPatterns = [
  /TODO_PLACEHOLDER/i,
  /FIXME_PLACEHOLDER/i,
  /throw new Error\(['\"]Not implemented/i,
  /coming soon/i,
  /lorem ipsum/i,
  /your-.*-here/i,
];

function walk(dir: string) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoreDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else {
      const rel = path.relative(root, full);
      const key = rel.toLowerCase().replace(/ copy of copy of copy of copy of /g, '').replace(/ \(\d+\)(?=\.)/g, '');
      if (seenRel.has(key) && /docs[\\/]reference/.test(rel)) {
        // Reference documents may intentionally preserve originals
      } else if (seenRel.has(key)) {
        problems.push(`Potential duplicate: ${seenRel.get(key)} and ${rel}`);
      }
      seenRel.set(key, rel);
      if (/\.(ts|tsx|js|jsx|mjs|cjs|md|json|sql|html|css)$/.test(ent.name) && rel !== 'scripts/quality-check.mjs') {
        const text = fs.readFileSync(full, 'utf8');
        for (const pattern of unfinishedPatterns) {
          if (pattern.test(text)) problems.push(`Unfinished marker ${pattern} in ${rel}`);
        }
      }
    }
  }
}

walk(root);

const required = [
  'app/api/ai/generate/route.ts',
  'app/api/school-brain/search/route.ts',
  'app/dashboard/admin-command-center/page.tsx',
  'app/dashboard/teacher-workspace/page.tsx',
  'app/dashboard/settings/page.tsx',
  'lib/schoolBrain.ts',
  'lib/types.ts',
  'lib/supabaseAdmin.ts',
  'components/AmbientMusicPlayer.tsx',
  'lib/musicLibrary.ts'
];

for (const file of required) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) {
    problems.push(`Missing required file: ${file}`);
  }
}

if (problems.length > 0) {
  console.error('❌ Quality check failed:');
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
} else {
  console.log('✅ Quality check passed - all required files present and no unfinished markers found');
  process.exit(0);
}
