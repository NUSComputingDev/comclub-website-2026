import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(
      {
        babel: {
          plugins: [
            ['@babel/plugin-syntax-import-attributes'],
          ],
        },
      },
    ),
  ],
  // GitHub Pages project sites live under /<repo>/, so the deploy workflow sets BASE_PATH. Defaults to the root.
  base: process.env.BASE_PATH || '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
