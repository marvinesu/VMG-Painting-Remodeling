import type { CollectionConfig } from "payload";
import { adminsOnly } from "../lib/access";

/**
 * Admin users. Brute-force protection is built in: accounts lock for
 * 10 minutes after 5 failed login attempts (Payload core behavior).
 * API keys are enabled so the Astro app can authenticate server-to-server.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000
  },
  admin: {
    useAsTitle: "email",
    group: "Admin"
  },
  access: {
    read: adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
    unlock: adminsOnly
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Full Name"
    }
  ]
};
