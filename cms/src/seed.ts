import type { Payload } from "payload";
import { richTextFromBlocks } from "./lib/richText";

/**
 * Idempotent seed: creates the internal admin docs and the production
 * deployment checklist on first boot. Never seeds credentials.
 */
export async function seed(payload: Payload): Promise<void> {
  try {
    const docs = await payload.find({ collection: "admin-docs", limit: 1 });
    if (docs.totalDocs === 0) {
      await payload.create({
        collection: "admin-docs",
        data: {
          title: "SMTP Settings Guide",
          slug: "smtp-settings-guide",
          category: "Email",
          internalOnly: true,
          published: false,
          content: richTextFromBlocks([
            {
              paragraphs: [
                "SMTP settings for the website are managed from Payload Admin -> SMTP Settings. The website reads these settings server-side to send lead notification emails."
              ]
            },
            {
              heading: "How the password is stored",
              paragraphs: [
                "The SMTP password is encrypted with AES-256-GCM before it is saved. The plaintext is never stored, never displayed in the admin UI, and never returned by the API.",
                "Leave the password field blank when saving to keep the existing password. Entering a new value replaces the stored password.",
                "Never paste SMTP passwords into public pages, updates, notes, or documentation."
              ]
            },
            {
              heading: "Testing",
              paragraphs: [
                "After saving, use the Send Test Email button on the SMTP Settings screen. The result appears in Last Test Status, and a copy is recorded in Security Logs."
              ]
            },
            {
              heading: "Fallback behavior",
              paragraphs: [
                "If SMTP is disabled here or the settings are incomplete, the website falls back to the SMTP_* environment variables configured in Hostinger.",
                "SMTP_ENCRYPTION_KEY must exist in the environment variables of BOTH the website app and this CMS app, with the same value. Without it, saved passwords cannot be decrypted."
              ]
            }
          ])
        }
      });

      await payload.create({
        collection: "admin-docs",
        data: {
          title: "Hostinger Deployment & SMTP Setup",
          slug: "hostinger-deployment-smtp-setup",
          category: "Deployment",
          internalOnly: true,
          published: false,
          content: richTextFromBlocks([
            {
              heading: "Website app (Astro) settings",
              list: [
                "Build command: npm run build",
                "Entry file: dist/server/entry.mjs",
                "Node version: 22.x",
                "Environment variable HOST = 0.0.0.0"
              ]
            },
            {
              heading: "CMS app (this app) settings",
              list: [
                "Root directory: cms",
                "Build command: npm run build",
                "Start command: npm start",
                "Environment variables: PAYLOAD_SECRET, PAYLOAD_PUBLIC_SERVER_URL, DATABASE_URI, SMTP_ENCRYPTION_KEY"
              ]
            },
            {
              heading: "SMTP fallback environment variables (website app)",
              list: [
                "SMTP_HOST = smtp.hostinger.com",
                "SMTP_PORT = 465",
                "SMTP_SECURE = true",
                "SMTP_USER = info@vmgpaintingnremodelingllc.com",
                "SMTP_PASS = (mailbox password — environment variable ONLY, never in Git or docs)",
                "SMTP_FROM = info@vmgpaintingnremodelingllc.com",
                "LEAD_NOTIFY_EMAIL = vmgpaintingnremodelingllc@gmail.com"
              ]
            },
            {
              heading: "If the site returns 403 after a deploy",
              list: [
                "Confirm the entry file is dist/server/entry.mjs (not blank).",
                "Confirm the build command is npm run build.",
                "Confirm Node version is 22.x.",
                "Confirm HOST = 0.0.0.0 is set.",
                "Confirm the deployment completed, then clear the cache.",
                "A 403 usually means Hostinger is serving dist/ as static files instead of running the Node server."
              ]
            },
            {
              heading: "SMTP testing steps",
              list: [
                "Save SMTP Settings in Payload Admin.",
                "Click Send Test Email and check Last Test Status.",
                "Submit the /free-estimate form on the website.",
                "Confirm the notification arrives at the Lead Notification Email inbox."
              ]
            }
          ])
        }
      });
      payload.logger.info("Seeded admin docs.");
    }

    const checklists = await payload.find({ collection: "deployment-checklists", limit: 1 });
    if (checklists.totalDocs === 0) {
      await payload.create({
        collection: "deployment-checklists",
        data: {
          title: "Production Deployment Checklist",
          environment: "production",
          published: false,
          lastReviewed: new Date().toISOString(),
          checklist: [
            { item: "Build command set to npm run build", completed: false },
            { item: "Entry file set to dist/server/entry.mjs (website app)", completed: false },
            { item: "Node version set to 22.x", completed: false },
            { item: "HOST env var set to 0.0.0.0", completed: false },
            { item: "SMTP_ENCRYPTION_KEY added to both apps", completed: false },
            { item: "SMTP variables added individually if using fallback", completed: false },
            { item: "No single combined 'SMTP' variable used", completed: false },
            { item: "Site redeployed", completed: false },
            { item: "Cache cleared", completed: false },
            { item: "Payload Admin tested", completed: false },
            { item: "SMTP Settings saved", completed: false },
            { item: "Test email sent successfully", completed: false },
            { item: "/free-estimate form tested", completed: false },
            { item: "Chatbot tested end to end", completed: false },
            { item: "Runtime logs checked if anything failed", completed: false }
          ]
        }
      });
      payload.logger.info("Seeded production deployment checklist.");
    }
  } catch (error) {
    payload.logger.error(`Seed failed: ${error instanceof Error ? error.message : "unknown"}`);
  }
}
