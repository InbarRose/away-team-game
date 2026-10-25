import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://awayteam.inbarrose.com',
  base: '/',
  integrations: [react()],
  output: 'static',
  server: {
    port: 4321,
    host: true,
  },
});
