import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://vmgpaintingremodeling.com",
  output: "static",
  integrations: [sitemap()]
});
