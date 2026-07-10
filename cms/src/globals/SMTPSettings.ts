import type { GlobalConfig } from "payload";
import { APIError } from "payload";
import { adminsOnly } from "../lib/access";
import { encryptSecret } from "../lib/crypto";

/**
 * Graphical SMTP configuration.
 *
 * Password handling:
 * - Admins type the password into `smtpPassword` (a write-only input).
 * - A beforeChange hook encrypts it (AES-256-GCM, SMTP_ENCRYPTION_KEY) into
 *   the hidden `smtpPasswordEncrypted` field and blanks the input.
 * - Leaving the input empty on later saves keeps the existing password.
 * - afterRead always blanks `smtpPassword`, so no plaintext ever leaves the
 *   server. The ciphertext field is admin-read-only (used by the Astro app,
 *   which authenticates with an admin API key and decrypts server-side).
 */
export const SMTPSettings: GlobalConfig = {
  slug: "smtp-settings",
  label: "SMTP Settings",
  admin: {
    group: "Admin"
  },
  access: {
    read: adminsOnly,
    update: adminsOnly
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const entered = typeof data.smtpPassword === "string" ? data.smtpPassword.trim() : "";
        if (entered !== "") {
          if (!process.env.SMTP_ENCRYPTION_KEY) {
            throw new APIError(
              "SMTP_ENCRYPTION_KEY is not set on the server — cannot store the SMTP password securely.",
              500
            );
          }
          data.smtpPasswordEncrypted = encryptSecret(entered);
        } else if (!data.smtpPasswordEncrypted && originalDoc?.smtpPasswordEncrypted) {
          data.smtpPasswordEncrypted = originalDoc.smtpPasswordEncrypted;
        }
        if (data.enabled && !data.smtpPasswordEncrypted) {
          throw new APIError("SMTP password is required — no password has been saved yet.", 400);
        }
        // Never persist or echo the plaintext.
        data.smtpPassword = "";
        return data;
      }
    ],
    afterRead: [
      ({ doc }) => {
        if (doc) doc.smtpPassword = "";
        return doc;
      }
    ]
  },
  fields: [
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      label: "Enable SMTP Email Sending",
      admin: { description: "When disabled, the website falls back to the SMTP_* environment variables." }
    },
    {
      type: "row",
      fields: [
        {
          name: "smtpHost",
          type: "text",
          required: true,
          defaultValue: "smtp.hostinger.com",
          label: "SMTP Host"
        },
        {
          name: "smtpPort",
          type: "number",
          required: true,
          defaultValue: 465,
          min: 1,
          max: 65535,
          label: "SMTP Port"
        }
      ]
    },
    {
      name: "smtpSecure",
      type: "checkbox",
      defaultValue: true,
      label: "Use Secure Connection / SSL",
      admin: { description: "Enable for port 465; disable for STARTTLS on port 587." }
    },
    {
      name: "smtpUser",
      type: "text",
      required: true,
      defaultValue: "info@vmgpaintingnremodelingllc.com",
      label: "SMTP Username"
    },
    {
      name: "smtpPassword",
      type: "text",
      label: "SMTP Password",
      admin: {
        description:
          "Leave blank to keep the existing SMTP password. New values are encrypted (AES-256-GCM) before they are stored.",
        autoComplete: "new-password"
      }
    },
    {
      name: "smtpPasswordEncrypted",
      type: "text",
      admin: { hidden: true },
      access: {
        // Ciphertext is never shown in the admin UI and only readable by
        // authenticated admin/API-key requests (for server-side decryption).
        read: ({ req: { user } }) => Boolean(user),
        update: () => false
      }
    },
    {
      type: "row",
      fields: [
        {
          name: "smtpFromEmail",
          type: "email",
          required: true,
          defaultValue: "info@vmgpaintingnremodelingllc.com",
          label: "From Email"
        },
        {
          name: "smtpFromName",
          type: "text",
          required: true,
          defaultValue: "VMG Painting & Remodeling",
          label: "From Name"
        }
      ]
    },
    {
      name: "leadNotifyEmail",
      type: "email",
      required: true,
      defaultValue: "vmgpaintingnremodelingllc@gmail.com",
      label: "Lead Notification Email",
      admin: { description: "Where lead notification emails are delivered." }
    },
    {
      name: "replyToEmail",
      type: "email",
      defaultValue: "vmgpaintingnremodelingllc@gmail.com",
      label: "Reply-To Email"
    },
    {
      name: "testRecipientEmail",
      type: "email",
      label: "Test Recipient Email",
      admin: { description: "Optional. Test emails go here; otherwise to the Lead Notification Email." }
    },
    {
      name: "testEmailButton",
      type: "ui",
      admin: {
        components: {
          Field: "/components/TestEmailButton#TestEmailButton"
        }
      }
    },
    {
      type: "row",
      fields: [
        {
          name: "lastTestStatus",
          type: "text",
          label: "Last Test Status",
          admin: { readOnly: true }
        },
        {
          name: "lastTestedAt",
          type: "date",
          label: "Last Tested At",
          admin: { readOnly: true, date: { displayFormat: "MMM d, yyyy h:mm a" } }
        }
      ]
    },
    {
      name: "internalNotes",
      type: "textarea",
      label: "Internal Notes",
      admin: { description: "Admin-only notes. Never paste passwords here." }
    }
  ]
};
