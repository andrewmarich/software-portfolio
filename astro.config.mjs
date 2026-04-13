// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://marich.dev",
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/secret") })],

  build: {
    // Inline all stylesheets into <style> tags to eliminate render-blocking CSS requests.
    // The site is small and single-page so we accept the per-page HTML cost for the LCP win.
    inlineStylesheets: "always",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
