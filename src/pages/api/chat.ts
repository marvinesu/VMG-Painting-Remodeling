import type { APIRoute } from "astro";
import { json, parseBody, requestMeta } from "../../lib/leadEndpoint";
import { genericLeadValidator } from "../../lib/leadValidators";
import { sendLeadEmail } from "../../lib/email";
import { createChat, createLead, createSecurityLog, payloadEnabled } from "../../lib/payload";
import { isRateLimited } from "../../lib/rateLimit";
import { clean, cleanMultiline } from "../../lib/validation";
import type { ChatMessage } from "../../lib/types";

export const prerender = false;

const MAX_MESSAGES = 200;

function sanitizeMessages(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_MESSAGES).flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const entry = item as Record<string, unknown>;
    const sender = entry.sender === "bot" ? "bot" : "user";
    const text = cleanMultiline(entry.text, 2000);
    if (!text) return [];
    const time = new Date(String(entry.timestamp ?? ""));
    return [
      {
        sender,
        text,
        timestamp: Number.isNaN(time.valueOf()) ? new Date().toISOString() : time.toISOString()
      } satisfies ChatMessage
    ];
  });
}

/**
 * Accepts the final chatbot conversation: stores the transcript (and a linked
 * lead when the visitor consented and left contact details) in Payload, and
 * emails the owner. Succeeds when the submission was stored OR emailed.
 */
export const POST: APIRoute = async (context) => {
  const route = "/api/chat";
  const { ip, userAgent } = requestMeta(context);

  let body: Record<string, unknown>;
  try {
    body = await parseBody(context.request);
  } catch {
    return json(400, { ok: false, error: "Invalid request body." });
  }

  if (isRateLimited(ip)) {
    void createSecurityLog({
      eventType: "rate_limit",
      ipAddress: ip,
      userAgent,
      route,
      description: "Chat submission blocked by rate limiting.",
      severity: "low"
    });
    return json(429, { ok: false, error: "You're sending requests too quickly. Please wait a moment and try again." });
  }

  const sessionId = clean(body.sessionId, 100);
  const messages = sanitizeMessages(body.messages);
  if (!sessionId || sessionId.length < 8) {
    return json(400, { ok: false, error: "Invalid chat session." });
  }
  if (messages.length === 0) {
    return json(400, { ok: false, error: "The conversation is empty." });
  }

  // Reuse the generic lead validation for the collected answers.
  const { errors, subject, leadType, rows, replyTo, lead } = genericLeadValidator(body);
  if (Object.keys(errors).length > 0) {
    return json(400, { ok: false, error: "Please correct the highlighted fields.", fields: errors });
  }

  // 1. Store lead + transcript in Payload (best effort).
  let leadId: string | number | null = null;
  let chatId: string | number | null = null;
  if (payloadEnabled()) {
    if (lead) {
      leadId = await createLead({ ...lead, ipAddress: ip, userAgent, status: "new" });
    }
    chatId = await createChat({
      sessionId,
      userName: lead?.name,
      userEmail: lead?.email,
      userPhone: lead?.phone,
      serviceNeeded: clean(body.service, 120),
      status: "submitted",
      messages,
      lead: leadId ?? undefined,
      sourcePage: clean(body.page, 200),
      ipAddress: ip,
      userAgent
    });
  }

  // 2. Email notification.
  try {
    await sendLeadEmail({ subject, leadType, rows, replyTo });
    return json(200, { ok: true });
  } catch (error) {
    console.error("[chat] Notification email failed:", error instanceof Error ? error.message : "unknown");
    void createSecurityLog({
      eventType: "email_send_failed",
      route,
      description: `Chatbot notification email failed${chatId !== null ? ` (chat ${chatId} stored)` : ""}.`,
      severity: chatId !== null ? "medium" : "high",
      metadata: { message: error instanceof Error ? error.message : "unknown" }
    });
    if (chatId !== null || leadId !== null) {
      return json(200, { ok: true });
    }
    return json(502, {
      ok: false,
      error:
        "Sorry, something went wrong while sending your request. Please call us at (253) 754-4871 or email vmgpaintingnremodelingllc@gmail.com."
    });
  }
};
