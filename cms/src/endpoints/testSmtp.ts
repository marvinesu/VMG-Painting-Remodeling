import type { Endpoint } from "payload";
import nodemailer from "nodemailer";
import { decryptSecret } from "../lib/crypto";

/**
 * POST /api/admin/test-smtp
 * Admin-only: sends a test email using the saved (encrypted) SMTP settings
 * and records the result in the SMTP Settings global + security logs.
 * Credentials never appear in responses, emails, or logs.
 */
export const testSmtpEndpoint: Endpoint = {
  path: "/admin/test-smtp",
  method: "post",
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
    }

    const payload = req.payload;
    const now = new Date().toISOString();

    async function recordResult(status: string, success: boolean, description: string) {
      try {
        const current = await payload.findGlobal({ slug: "smtp-settings" });
        await payload.updateGlobal({
          slug: "smtp-settings",
          data: { ...current, lastTestStatus: status, lastTestedAt: now }
        });
        await payload.create({
          collection: "security-logs",
          data: {
            eventType: success ? "smtp_test_success" : "smtp_test_failed",
            route: "/api/admin/test-smtp",
            description,
            severity: success ? "low" : "medium",
            timestamp: now
          }
        });
      } catch (error) {
        payload.logger.error(
          `Failed to record SMTP test result: ${error instanceof Error ? error.message : "unknown"}`
        );
      }
    }

    let settings;
    try {
      settings = await payload.findGlobal({ slug: "smtp-settings" });
    } catch {
      return Response.json({ ok: false, error: "SMTP settings have not been saved yet." }, { status: 400 });
    }

    if (!settings?.smtpHost || !settings?.smtpUser || !settings?.smtpPasswordEncrypted) {
      await recordResult(`Failed ${now}: settings incomplete`, false, "SMTP test failed: settings incomplete.");
      return Response.json(
        { ok: false, error: "SMTP settings are incomplete — save host, username, and password first." },
        { status: 400 }
      );
    }

    let password: string;
    try {
      password = decryptSecret(settings.smtpPasswordEncrypted as string);
    } catch {
      await recordResult(
        `Failed ${now}: decryption error`,
        false,
        "SMTP test failed: password could not be decrypted (check SMTP_ENCRYPTION_KEY)."
      );
      return Response.json(
        { ok: false, error: "Stored password could not be decrypted. Verify SMTP_ENCRYPTION_KEY and re-save the password." },
        { status: 500 }
      );
    }

    const recipient = (settings.testRecipientEmail as string) || (settings.leadNotifyEmail as string);
    const fromEmail = (settings.smtpFromEmail as string) || (settings.smtpUser as string);
    const from = settings.smtpFromName ? `"${settings.smtpFromName}" <${fromEmail}>` : fromEmail;

    try {
      const transporter = nodemailer.createTransport({
        host: settings.smtpHost as string,
        port: Number(settings.smtpPort ?? 465),
        secure: settings.smtpSecure !== false,
        auth: { user: settings.smtpUser as string, pass: password }
      });
      await transporter.sendMail({
        from,
        to: recipient,
        subject: "VMG Website SMTP Test",
        text: [
          "This is a test email from the VMG Painting & Remodeling website SMTP configuration.",
          "",
          `SMTP Host: ${settings.smtpHost}`,
          `SMTP User: ${settings.smtpUser}`,
          `From Email: ${fromEmail}`,
          `Timestamp: ${new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} (Pacific)`,
          "",
          "Credentials were loaded and decrypted server-side from Payload CMS. No password is included in this email."
        ].join("\n")
      });
      await recordResult(`Success ${now}`, true, `SMTP test email sent to ${recipient}.`);
      return Response.json({ ok: true, message: `Test email sent to ${recipient}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      await recordResult(`Failed ${now}: ${message.slice(0, 200)}`, false, `SMTP test failed: ${message.slice(0, 500)}`);
      return Response.json(
        { ok: false, error: "Test email failed to send. Check host, port, username, and password." },
        { status: 502 }
      );
    }
  }
};
