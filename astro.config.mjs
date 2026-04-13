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
    // Inline small stylesheets into <style> tags to eliminate render-blocking CSS requests.
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
