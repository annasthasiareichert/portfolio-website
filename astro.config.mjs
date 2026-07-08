// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Öffentliche Adresse der Live-Seite (korrekte Canonical-URLs, Sitemap etc.)
  site: 'https://annasthasiareichert.de',
  // Fester Entwicklungs-Port (siehe CLAUDE.md: immer 4321)
  server: { port: 4321 },
});
