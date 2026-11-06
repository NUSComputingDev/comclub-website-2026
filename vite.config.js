import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import { fileURLToPath } from 'node:url';

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
  base: '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
