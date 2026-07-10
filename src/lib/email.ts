/**
 * Centralized SMTP mailer (Nodemailer).
 *
 * Settings priority:
 *   1. Payload CMS "SMTP Settings" global (when enabled + complete) — the
 *      password is stored AES-256-GCM encrypted and decrypted server-side
 *      here using SMTP_ENCRYPTION_KEY.
 *   2. Environment variables: SMTP_HOST/PORT/SECURE/USER/PASS/FROM,
 *      LEAD_NOTIFY_EMAIL.
 *
 * Nothing in this module is reachable from the browser, and neither
 * passwords nor the encryption key are ever logged or returned.
 */
import nodemailer, { type Transporter } from "nodemailer";
import { createSecurityLog, getSMTPSettingsFromPayload } from "./payload";
import { decryptSecret } from "./crypto";

export type LeadRow = { label: string; value: string };

const DEFAULT_NOTIFY = "vmgpaintingnremodelingllc@gmail.com";
/** Agency copy of every lead email for delivery monitoring. Override with LEAD_BCC_EMAIL; set it to "" to disable. */
const DEFAULT_BCC = "emarketwizdigit@gmail.com";
const SETTINGS_CACHE_MS = 60_000;

function leadBcc(): string | undefined {
  const value = process.env.LEAD_BCC_EMAIL ?? DEFAULT_BCC;
  return value.trim() === "" ? undefined : value;
}

export type ResolvedSmtp = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  notifyTo: string;
  replyTo?: string;
  source: "cms" | "env";
};

let cache: { at: number; settings: ResolvedSmtp | null } | null = null;

async function resolveFromCms(): Promise<ResolvedSmtp | null> {
  const cms = await getSMTPSettingsFromPayload();
  if (!cms || cms.enabled === false) return null;
  if (!cms.smtpHost || !cms.smtpUser || !cms.smtpPasswordEncrypted) return null;
  let pass: string;
  try {
    pass = decryptSecret(cms.smtpPasswordEncrypted);
  } catch (error) {
    console.error("[email] Could not decrypt CMS SMTP password:", error instanceof Error ? error.message : error);
    await createSecurityLog({
      eventType: "smtp_error",
      route: "lib/email",
      description: "CMS SMTP password could not be decrypted (check SMTP_ENCRYPTION_KEY).",
      severity: "high"
    });
    return null;
  }
  const fromEmail = cms.smtpFromEmail || cms.smtpUser;
  return {
    host: cms.smtpHost,
    port: Number(cms.smtpPort ?? 465),
    secure: cms.smtpSecure !== false,
    user: cms.smtpUser,
    pass,
    from: cms.smtpFromName ? `"${cms.smtpFromName}" <${fromEmail}>` : fromEmail,
    notifyTo: cms.leadNotifyEmail || DEFAULT_NOTIFY,
    replyTo: cms.replyToEmail || undefined,
    source: "cms"
  };
}

function resolveFromEnv(): ResolvedSmtp | null {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    notifyTo: process.env.LEAD_NOTIFY_EMAIL || DEFAULT_NOTIFY,
    source: "env"
  };
}

/** Resolve active SMTP settings (CMS first, env fallback). Cached for 60s. */
export async function getSMTPSettings(): Promise<ResolvedSmtp | null> {
  if (cache && Date.now() - cache.at < SETTINGS_CACHE_MS) return cache.settings;
  const settings = (await resolveFromCms()) ?? resolveFromEnv();
  cache = { at: Date.now(), settings };
  return settings;
}

export async function smtpConfigured(): Promise<boolean> {
  return (await getSMTPSettings()) !== null;
}

export function createTransporter(settings: ResolvedSmtp): Transporter {
  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    auth: { user: settings.user, pass: settings.pass }
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function submittedAt(): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Los_Angeles"
  }).format(new Date());
}

/** Core sender: builds a clean text + HTML lead email and sends it. */
export async function sendLeadEmail(options: {
  subject: string;
  leadType: string;
  rows: LeadRow[];
  replyTo?: string;
}): Promise<void> {
  const settings = await getSMTPSettings();
  if (!settings) throw new Error("SMTP is not configured (no CMS settings and no env fallback).");

  const rows: LeadRow[] = [
    { label: "Lead Type", value: options.leadType },
    ...options.rows.filter((row) => row.value !== ""),
    { label: "Submitted", value: `${submittedAt()} (Pacific)` }
  ];

  const text = rows.map((row) => `${row.label}: ${row.value}`).join("\n");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0d0630;line-height:1.5">
      <h2 style="color:#18314f;margin:0 0 4px">${escapeHtml(options.subject)}</h2>
      <p style="margin:0 0 16px;color:#4a5570">New lead from vmgpaintingnremodelingllc.com</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            (row, index) => `
          <tr style="background:${index % 2 === 0 ? "#edf4f1" : "#ffffff"}">
            <td style="padding:9px 12px;font-weight:bold;white-space:nowrap;vertical-align:top;border:1px solid #d9e3e0">${escapeHtml(row.label)}</td>
            <td style="padding:9px 12px;border:1px solid #d9e3e0">${escapeHtml(row.value).replaceAll("\n", "<br>")}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>`;

  await createTransporter(settings).sendMail({
    from: settings.from,
    to: settings.notifyTo,
    bcc: leadBcc(),
    replyTo: options.replyTo || settings.replyTo,
    subject: options.subject,
    text,
    html
  });
}

export function sendContactNotification(rows: LeadRow[], replyTo?: string): Promise<void> {
  return sendLeadEmail({
    subject: "New Contact Message - VMG Painting & Remodeling",
    leadType: "Contact Form Message",
    rows,
    replyTo
  });
}

export function sendLeadNotification(leadType: string, subject: string, rows: LeadRow[], replyTo?: string): Promise<void> {
  return sendLeadEmail({ subject, leadType, rows, replyTo });
}

export function sendChatbotNotification(rows: LeadRow[], replyTo?: string): Promise<void> {
  return sendLeadEmail({
    subject: "New Chatbot Lead - VMG Painting & Remodeling",
    leadType: "Chatbot Lead",
    rows,
    replyTo
  });
}

/** Send a plain configuration test email (never includes credentials). */
export async function sendTestEmail(recipient?: string): Promise<void> {
  const settings = await getSMTPSettings();
  if (!settings) throw new Error("SMTP is not configured.");
  await createTransporter(settings).sendMail({
    from: settings.from,
    to: recipient || settings.notifyTo,
    subject: "VMG Website SMTP Test",
    text: [
      "This is a test email from the VMG Painting & Remodeling website SMTP configuration.",
      "",
      `SMTP Host: ${settings.host}`,
      `SMTP User: ${settings.user}`,
      `From Email: ${settings.from}`,
      `Settings Source: ${settings.source === "cms" ? "Payload CMS (credentials loaded and decrypted server-side)" : "Environment variables (loaded server-side)"}`,
      `Timestamp: ${submittedAt()} (Pacific)`
    ].join("\n")
  });
}
