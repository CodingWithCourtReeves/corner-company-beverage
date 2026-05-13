import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://corner-company.up.railway.app',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { plugins: [tailwindcss()] },
});
