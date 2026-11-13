// Build: empacota o servidor em um único arquivo e copia os arquivos estáticos para dist/
import { build } from 'esbuild';
import { cpSync, rmSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });

await build({
  entryPoints: ['src/server.js'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'dist/server.js',
  minify: true,
  external: ['pg-native'],
});

cpSync('public', 'dist/public', { recursive: true });
console.log('Build concluído: dist/server.js e dist/public/');
