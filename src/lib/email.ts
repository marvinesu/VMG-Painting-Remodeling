/**
 * SMTP lead notification mailer (Nodemailer).
 *
 * Configuration comes exclusively from environment variables — credentials
 * are never bundled into client code and never logged:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM,
 *   LEAD_NOTIFY_EMAIL
 */
import nodemailer, { type Transporter } from "nodemailer";

export type LeadRow = { label: string; value: string };

const DEFAULT_NOTIFY = "vmgpaintingnremodelingllc@gmail.com";

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
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

/**
 * Send a lead notification to the owner inbox.
 * Rows with empty values are omitted so the email stays easy to scan.
 */
export async function sendLeadEmail(options: {
  subject: string;
  leadType: string;
  rows: LeadRow[];
  replyTo?: string;
}): Promise<void> {
  const rows: LeadRow[] = [
    { label: "Lead Type", value: options.leadType },
    ...options.rows.filter((row) => row.value !== ""),
    { label: "Submitted", value: `${submittedAt()} (Pacific)` }
  ];

  const text = rows.map((row) => `${row.label}: ${row.value}`).join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#242018;line-height:1.5">
      <h2 style="color:#29251d;margin:0 0 4px">${escapeHtml(options.subject)}</h2>
      <p style="margin:0 0 16px;color:#6d665c">New lead from vmgpaintingnremodelingllc.com</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            (row, index) => `
          <tr style="background:${index % 2 === 0 ? "#f7f1e7" : "#ffffff"}">
            <td style="padding:9px 12px;font-weight:bold;white-space:nowrap;vertical-align:top;border:1px solid #e8ddcd">${escapeHtml(row.label)}</td>
            <td style="padding:9px 12px;border:1px solid #e8ddcd">${escapeHtml(row.value).replaceAll("\n", "<br>")}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>`;

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.LEAD_NOTIFY_EMAIL || DEFAULT_NOTIFY,
    replyTo: options.replyTo || undefined,
    subject: options.subject,
    text,
    html
  });
}
