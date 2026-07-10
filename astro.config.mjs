import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://vmgpaintingnremodelingllc.com",
  // Pages stay fully prerendered (static). The Node adapter exists only so the
  // /api/* lead endpoints (marked `prerender = false`) can run server-side.
  // Hostinger entry file setting: `server/entry.mjs` (relative to the dist
  // output directory) — see README deployment notes.
  output: "static",
  adapter: node({ mode: "standalone" }),
  integrations: [sitemap()],
  build: {
    // The whole stylesheet is small (~10KB); inlining removes the
    // render-blocking CSS request entirely.
    inlineStylesheets: "always"
  },
  vite: {
    ssr: {
      // Bundle ALL dependencies into dist/server so the entry file runs
      // standalone — Hostinger's runtime only receives the dist folder,
      // without node_modules.
      noExternal: true
    }
  }
});
