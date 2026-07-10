/**
 * Server-side Payload CMS REST client.
 *
 * The CMS runs as a separate Node app (see cms/). This module authenticates
 * server-to-server with a Payload API key; nothing here is ever exposed to
 * the browser. Every function fails gracefully — if the CMS is unreachable
 * or unconfigured, callers get null/false and the site keeps working.
 *
 * Env (server-only, never ASTRO_PUBLIC_):
 *   PAYLOAD_INTERNAL_API_URL  e.g. https://cms.vmgpaintingnremodelingllc.com/api
 *   PAYLOAD_API_KEY           API key of an admin user in the CMS
 */
import type { Chat, Lead, Page, SecurityLog, SMTPSettings, Update } from "./types";

const TIMEOUT_MS = 8000;

function baseUrl(): string | undefined {
  return process.env.PAYLOAD_INTERNAL_API_URL?.replace(/\/$/, "");
}

export function payloadEnabled(): boolean {
  return Boolean(baseUrl() && process.env.PAYLOAD_API_KEY);
}

async function payloadFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${baseUrl()}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `users API-Key ${process.env.PAYLOAD_API_KEY}`,
      ...init.headers
    },
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!response.ok) {
    throw new Error(`Payload request failed: ${init.method ?? "GET"} ${path} -> ${response.status}`);
  }
  return (await response.json()) as T;
}

type ListResponse<T> = { docs: T[]; totalDocs: number };

/** Fetch a published page by slug (returns null when missing/unpublished/CMS down). */
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  if (!payloadEnabled()) return null;
  try {
    const query = new URLSearchParams({
      "where[slug][equals]": slug,
      "where[published][equals]": "true",
      limit: "1",
      depth: "1"
    });
    const result = await payloadFetch<ListResponse<Page>>(`/pages?${query}`);
    return result.docs[0] ?? null;
  } catch (error) {
    console.error("[payload] fetchPageBySlug failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Fetch published updates, newest first. */
export async function fetchUpdates(limit = 20): Promise<Update[]> {
  if (!payloadEnabled()) return [];
  try {
    const query = new URLSearchParams({
      "where[published][equals]": "true",
      sort: "-publishedAt",
      limit: String(limit),
      depth: "1"
    });
    const result = await payloadFetch<ListResponse<Update>>(`/updates?${query}`);
    return result.docs;
  } catch (error) {
    console.error("[payload] fetchUpdates failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

/** Fetch a single published update by slug. */
export async function fetchUpdateBySlug(slug: string): Promise<Update | null> {
  if (!payloadEnabled()) return null;
  try {
    const query = new URLSearchParams({
      "where[slug][equals]": slug,
      "where[published][equals]": "true",
      limit: "1",
      depth: "1"
    });
    const result = await payloadFetch<ListResponse<Update>>(`/updates?${query}`);
    return result.docs[0] ?? null;
  } catch (error) {
    console.error("[payload] fetchUpdateBySlug failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Store a lead. Returns the created id, or null when storage failed. */
export async function createLead(lead: Lead): Promise<string | number | null> {
  if (!payloadEnabled()) return null;
  try {
    const result = await payloadFetch<{ doc: { id: string | number } }>("/leads", {
      method: "POST",
      body: JSON.stringify(lead)
    });
    return result.doc.id;
  } catch (error) {
    console.error("[payload] createLead failed:", error instanceof Error ? error.message : error);
    await createSecurityLog({
      eventType: "api_error",
      route: "/api (createLead)",
      description: "Failed to store lead in Payload CMS.",
      severity: "medium",
      metadata: { message: error instanceof Error ? error.message : "unknown" }
    });
    return null;
  }
}

/** Store a chatbot conversation. Returns the created id, or null on failure. */
export async function createChat(chat: Chat): Promise<string | number | null> {
  if (!payloadEnabled()) return null;
  try {
    const result = await payloadFetch<{ doc: { id: string | number } }>("/chats", {
      method: "POST",
      body: JSON.stringify(chat)
    });
    return result.doc.id;
  } catch (error) {
    console.error("[payload] createChat failed:", error instanceof Error ? error.message : error);
    await createSecurityLog({
      eventType: "api_error",
      route: "/api/chat",
      description: "Failed to store chat transcript in Payload CMS.",
      severity: "medium",
      metadata: { message: error instanceof Error ? error.message : "unknown" }
    });
    return null;
  }
}

/**
 * Record a security incident. Fire-and-forget: never throws, never blocks the
 * caller's response, and never includes credentials in the payload.
 */
export async function createSecurityLog(entry: SecurityLog): Promise<void> {
  if (!payloadEnabled()) return;
  try {
    await payloadFetch("/security-logs", {
      method: "POST",
      body: JSON.stringify({ ...entry, timestamp: entry.timestamp ?? new Date().toISOString() })
    });
  } catch (error) {
    // Last resort: local server log only. Never rethrow from the logger.
    console.error("[payload] createSecurityLog failed:", error instanceof Error ? error.message : error);
  }
}

/** Read the SMTP settings global (admin-only; requires the API-key user). */
export async function getSMTPSettingsFromPayload(): Promise<SMTPSettings | null> {
  if (!payloadEnabled()) return null;
  try {
    return await payloadFetch<SMTPSettings>("/globals/smtp-settings");
  } catch (error) {
    console.error("[payload] getSMTPSettings failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/** Update the SMTP test status fields (used after test sends). */
export async function updateSMTPTestStatus(status: string): Promise<void> {
  if (!payloadEnabled()) return;
  try {
    await payloadFetch("/globals/smtp-settings", {
      method: "POST",
      body: JSON.stringify({ lastTestStatus: status, lastTestedAt: new Date().toISOString() })
    });
  } catch (error) {
    console.error("[payload] updateSMTPTestStatus failed:", error instanceof Error ? error.message : error);
  }
}
