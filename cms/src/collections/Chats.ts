import type { CollectionConfig } from "payload";
import { adminsOnly } from "../lib/access";

export const Chats: CollectionConfig = {
  slug: "chats",
  admin: {
    useAsTitle: "sessionId",
    group: "Leads & Chats",
    defaultColumns: ["sessionId", "userName", "userPhone", "status", "createdAt"]
  },
  access: {
    // Chats are created only by the Astro server (API-key admin user) via
    // POST /api/chat on the website — never directly by the public.
    create: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    { name: "sessionId", type: "text", required: true, unique: true, index: true },
    { name: "userName", type: "text", maxLength: 200 },
    { name: "userEmail", type: "email" },
    { name: "userPhone", type: "text", maxLength: 40 },
    { name: "serviceNeeded", type: "text", maxLength: 200 },
    {
      name: "status",
      type: "select",
      defaultValue: "open",
      options: ["open", "submitted", "reviewed", "closed"],
      admin: { position: "sidebar" }
    },
    {
      name: "messages",
      type: "array",
      required: true,
      fields: [
        {
          name: "sender",
          type: "select",
          required: true,
          options: ["user", "bot", "admin", "system"]
        },
        { name: "text", type: "textarea", required: true, maxLength: 4000 },
        { name: "timestamp", type: "date", required: true }
      ]
    },
    { name: "lead", type: "relationship", relationTo: "leads" },
    { name: "sourcePage", type: "text", maxLength: 300 },
    { name: "ipAddress", type: "text", admin: { readOnly: true } },
    { name: "userAgent", type: "text", admin: { readOnly: true } }
  ]
};
