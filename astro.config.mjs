import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://vmgpaintingremodeling.com",
  output: "static",
  integrations: [sitemap()],
  build: {
    // The whole stylesheet is small (~10KB); inlining removes the
    // render-blocking CSS request entirely.
    inlineStylesheets: "always"
  }
});
