/**
 * Astro middleware: catches unhandled server errors on API routes, records
 * them in the CMS security log (without credentials or full payloads), and
 * returns a clean JSON error instead of a stack trace.
 */
import { defineMiddleware } from "astro:middleware";
import { createSecurityLog } from "./lib/payload";

export const onRequest = defineMiddleware(async (context, next) => {
  try {
    return await next();
  } catch (error) {
    const route = new URL(context.request.url).pathname;
    if (route.startsWith("/api/")) {
      let ip = "unknown";
      try {
        ip = context.clientAddress;
      } catch {
        // not available in all runtimes
      }
      void createSecurityLog({
        eventType: "api_error",
        ipAddress: ip,
        userAgent: context.request.headers.get("user-agent") ?? "",
        route,
        description: `Unhandled API error: ${error instanceof Error ? error.message : "unknown"}`,
        severity: "high"
      });
      return new Response(
        JSON.stringify({ ok: false, error: "Internal server error. Please call (253) 754-4871." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    throw error;
  }
});
