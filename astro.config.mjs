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
    // "auto" inlines only small stylesheets (<4 KB by default). Keeps the larger
    // Tailwind bundle external so HTML and CSS can download in parallel over
    // HTTP/2 — tested faster on Slow 4G than fully-inlining "always".
    inlineStylesheets: "auto",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
