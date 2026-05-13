import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://corner-company.up.railway.app',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
