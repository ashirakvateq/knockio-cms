import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: Confirm the current WordPress permalink style before the first deploy.
// WordPress typically uses trailing slashes (/page-name/). If the existing site
// does NOT use trailing slashes, change this to `trailingSlash: 'never'` and
// update the slug fields in content accordingly.
export default defineConfig({
  site: "https://knockio.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        "localhost:4321",
        "127.0.0.1:4321",
        "knockiocms.iosama.qzz.io",
      ],
    },
  },
});
