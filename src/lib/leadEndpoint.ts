/**
 * Shared plumbing for the lead endpoints
 * (/api/contact, /api/free-estimate, /api/lead, /api/chatbot-lead).
 *
 * Flow: parse -> spam checks -> rate limit -> validate -> store in Payload
 * (best effort) -> send notification email. A submission succeeds when it is
 * stored OR emailed; failures are recorded in security-logs without
 * credentials or full payloads.
 */
import type { APIContext } from "astro";
import { sendLeadEmail, smtpConfigured, type LeadRow } from "./email";
import { createLead, createSecurityLog, payloadEnabled } from "./payload";
import { isRateLimited } from "./rateLimit";
import { verifyRecaptcha } from "./recaptcha";
import { isSpam, type FieldErrors } from "./validation";
import type { Lead } from "./types";

export type LeadValidator = (body: Record<string, unknown>) => {
  errors: FieldErrors;
  subject: string;
  leadType: string;
  rows: LeadRow[];
  replyTo?: string;
  /** Structured lead for Payload storage (omit to skip storage). */
  lead?: Omit<Lead, "ipAddress" | "userAgent"> | null;
};

const FALLBACK_MESSAGE =
  "Please call us at (253) 754-4871 or email vmgpaintingnremodelingllc@gmail.com.";

export function json(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const data = await request.json();
    return typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  }
  const form = await request.formData();
  const body: Record<string, unknown> = {};
  for (const key of new Set(form.keys())) {
    const values = form.getAll(key).map(String);
    body[key] = values.length > 1 ? values : values[0];
  }
  return body;
}

export function requestMeta(context: APIContext): { ip: string; userAgent: string } {
  let ip = "unknown";
  try {
    ip = context.clientAddress;
  } catch {
    // clientAddress can throw in some runtimes.
  }
  return { ip, userAgent: context.request.headers.get("user-agent") ?? "" };
}

export async function handleLeadRequest(
  context: APIContext,
  validate: LeadValidator
): Promise<Response> {
  const route = new URL(context.request.url).pathname;
  const { ip, userAgent } = requestMeta(context);

  let body: Record<string, unknown>;
  try {
    body = await parseBody(context.request);
  } catch {
    return json(400, { ok: false, error: "Invalid request body." });
  }

  // Honeypot / too-fast submissions: pretend success, store nothing.
  if (isSpam(body)) {
    void createSecurityLog({
      eventType: "suspicious_submission",
      ipAddress: ip,
      userAgent,
      route,
      description: "Submission dropped by spam checks (honeypot or timing).",
      severity: "low"
    });
    return json(200, { ok: true });
  }

  if (isRateLimited(ip)) {
    void createSecurityLog({
      eventType: "rate_limit",
      ipAddress: ip,
      userAgent,
      route,
      description: "Submission blocked by rate limiting.",
      severity: "low"
    });
    return json(429, {
      ok: false,
      error: `You're sending requests too quickly. Please wait a moment and try again, or call (253) 754-4871.`
    });
  }

  // reCAPTCHA (active only when RECAPTCHA_SECRET_KEY is set). Failed checks
  // get the same fake success as the honeypot so bots learn nothing.
  const recaptcha = await verifyRecaptcha(body.recaptchaToken, ip);
  if (recaptcha.verdict === "fail") {
    void createSecurityLog({
      eventType: "suspicious_submission",
      ipAddress: ip,
      userAgent,
      route,
      description: `Submission dropped by reCAPTCHA (${recaptcha.reason ?? "failed"}).`,
      severity: "low"
    });
    return json(200, { ok: true });
  }

  const { errors, subject, leadType, rows, replyTo, lead } = validate(body);
  if (Object.keys(errors).length > 0) {
    return json(400, { ok: false, error: "Please correct the highlighted fields.", fields: errors });
  }

  // 1. Store in Payload CMS (best effort — the site works without the CMS).
  let storedId: string | number | null = null;
  if (lead && payloadEnabled()) {
    storedId = await createLead({ ...lead, ipAddress: ip, userAgent, sourcePage: lead.sourcePage, status: "new" });
  }

  // 2. Email notification.
  if (!(await smtpConfigured())) {
    if (storedId !== null) {
      // Lead is safely in the CMS even though email isn't set up yet.
      void createSecurityLog({
        eventType: "smtp_error",
        route,
        description: `Lead ${storedId} stored, but SMTP is not configured — no notification sent.`,
        severity: "medium"
      });
      return json(200, { ok: true });
    }
    console.error(`[lead:${leadType}] SMTP is not configured and CMS storage unavailable.`);
    return json(503, {
      ok: false,
      error: `Our online form is temporarily unavailable. ${FALLBACK_MESSAGE}`
    });
  }

  try {
    await sendLeadEmail({ subject, leadType, rows, replyTo });
    return json(200, { ok: true });
  } catch (error) {
    console.error(
      `[lead:${leadType}] Failed to send notification email:`,
      error instanceof Error ? error.message : "unknown error"
    );
    void createSecurityLog({
      eventType: "email_send_failed",
      route,
      description: `Notification email failed for ${leadType}${storedId !== null ? ` (lead ${storedId} stored)` : ""}.`,
      severity: storedId !== null ? "medium" : "high",
      metadata: { message: error instanceof Error ? error.message : "unknown" }
    });
    if (storedId !== null) {
      // The lead is stored in the CMS; don't fail the visitor.
      return json(200, { ok: true });
    }
    return json(502, {
      ok: false,
      error: `Sorry, something went wrong while sending your request. ${FALLBACK_MESSAGE}`
    });
  }
}
