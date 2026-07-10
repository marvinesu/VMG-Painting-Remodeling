/**
 * Shared plumbing for the three lead endpoints
 * (/api/contact, /api/free-estimate, /api/chatbot-lead).
 */
import type { APIContext } from "astro";
import { sendLeadEmail, smtpConfigured, type LeadRow } from "./email";
import { isRateLimited } from "./rateLimit";
import { isSpam, type FieldErrors } from "./validation";

export type LeadValidator = (body: Record<string, unknown>) => {
  errors: FieldErrors;
  subject: string;
  leadType: string;
  rows: LeadRow[];
  replyTo?: string;
};

const FALLBACK_MESSAGE =
  "Please call us at (253) 754-4871 or email vmgpaintingnremodelingllc@gmail.com.";

function json(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await request.json();
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  }
  // multipart/form-data or application/x-www-form-urlencoded (no-JS fallback)
  const form = await request.formData();
  const body: Record<string, unknown> = {};
  for (const key of new Set(form.keys())) {
    const values = form.getAll(key).map(String);
    body[key] = values.length > 1 ? values : values[0];
  }
  return body;
}

export async function handleLeadRequest(
  context: APIContext,
  validate: LeadValidator
): Promise<Response> {
  let body: Record<string, unknown>;
  try {
    body = await parseBody(context.request);
  } catch {
    return json(400, { ok: false, error: "Invalid request body." });
  }

  // Honeypot / too-fast submissions: pretend success, send nothing.
  if (isSpam(body)) {
    return json(200, { ok: true });
  }

  let ip = "unknown";
  try {
    ip = context.clientAddress;
  } catch {
    // clientAddress can throw in some runtimes; rate limiting still works per "unknown".
  }
  if (isRateLimited(ip)) {
    return json(429, {
      ok: false,
      error: `You're sending requests too quickly. Please wait a moment and try again, or call (253) 754-4871.`
    });
  }

  const { errors, subject, leadType, rows, replyTo } = validate(body);
  if (Object.keys(errors).length > 0) {
    return json(400, { ok: false, error: "Please correct the highlighted fields.", fields: errors });
  }

  if (!smtpConfigured()) {
    console.error(`[lead:${leadType}] SMTP is not configured — set SMTP_* environment variables.`);
    return json(503, {
      ok: false,
      error: `Our online form is temporarily unavailable. ${FALLBACK_MESSAGE}`
    });
  }

  try {
    await sendLeadEmail({ subject, leadType, rows, replyTo });
    return json(200, { ok: true });
  } catch (error) {
    // Log the failure without ever including SMTP credentials.
    console.error(
      `[lead:${leadType}] Failed to send notification email:`,
      error instanceof Error ? error.message : "unknown error"
    );
    return json(502, {
      ok: false,
      error: `Sorry, something went wrong while sending your request. ${FALLBACK_MESSAGE}`
    });
  }
}
