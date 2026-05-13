import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://corner-company.up.railway.app',
  trailingSlash: 'never',
  build: { inlineStylesheets: 'auto' },
  vite: { plugins: [tailwindcss()] },
});
