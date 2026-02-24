import { build } from 'esbuild';

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
}).catch(() => process.exit(1));
