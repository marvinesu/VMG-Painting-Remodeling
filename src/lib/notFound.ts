/**
 * 404 response for SSR routes (CMS pages/updates).
 * Serves the prerendered /404 page with a real 404 status code — rewriting to
 * a prerendered route isn't supported from on-demand routes in this adapter.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

let cached: string | null = null;

const FALLBACK_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page Not Found | VMG Painting &amp; Remodeling LLC</title><meta name="robots" content="noindex"></head>
<body style="font-family:system-ui,sans-serif;background:#fafcf7;color:#0d0630;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="text-align:center;padding:24px"><h1>Page Not Found</h1>
<p>The page you're looking for doesn't exist or has moved.</p>
<p><a href="/" style="color:#384e77;font-weight:700">Back to Home</a> &middot; <a href="/free-estimate" style="color:#384e77;font-weight:700">Get a Free Estimate</a></p>
</div></body></html>`;

export async function notFoundResponse(): Promise<Response> {
  if (cached === null) {
    const candidates = [
      path.join(process.cwd(), "dist", "client", "404.html"),
      // When the process cwd is the server dir itself.
      path.join(process.cwd(), "client", "404.html")
    ];
    for (const candidate of candidates) {
      try {
        cached = await readFile(candidate, "utf8");
        break;
      } catch {
        // try next location
      }
    }
    if (cached === null) cached = FALLBACK_HTML;
  }
  return new Response(cached, {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
}
