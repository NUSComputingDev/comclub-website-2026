import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const distDir = resolve(process.cwd(), 'dist');
const indexFile = resolve(distDir, 'index.html');
const fallbackFile = resolve(distDir, '404.html');

if (!existsSync(indexFile)) {
  console.error('dist/index.html was not found. Run the Vite build first.');
  process.exit(1);
}

copyFileSync(indexFile, fallbackFile);
console.log('Created dist/404.html from dist/index.html');
