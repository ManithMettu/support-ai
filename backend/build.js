import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  minify: true,
  external: ['better-sqlite3'],
  banner: {
    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);"
  }
}).then(() => {
  // Copy docs.json to dist folder
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  fs.copyFileSync('docs.json', 'dist/docs.json');
  console.log('✓ Build complete, docs.json copied to dist/');
}).catch(() => process.exit(1));
