import type { CollectionConfig } from "payload";
import { adminsOnly, noOne } from "../lib/access";

export const SecurityLogs: CollectionConfig = {
  slug: "security-logs",
  admin: {
    useAsTitle: "description",
    group: "Admin",
    defaultColumns: ["eventType", "severity", "route", "timestamp"]
  },
  access: {
    // Created only by trusted server-side code (the Astro app's API-key user
    // or Payload's own hooks/endpoints). Immutable once written.
    create: adminsOnly,
    read: adminsOnly,
    update: noOne,
    delete: adminsOnly
  },
  fields: [
    {
      name: "eventType",
      type: "select",
      required: true,
      options: [
        "auth_failure",
        "api_error",
        "brute_force_suspect",
        "validation_error",
        "suspicious_submission",
        "rate_limit",
        "smtp_error",
        "smtp_test_failed",
        "smtp_test_success",
        "email_send_failed"
      ]
    },
    { name: "ipAddress", type: "text", maxLength: 100 },
    { name: "userAgent", type: "text", maxLength: 500 },
    { name: "route", type: "text", maxLength: 300 },
    { name: "description", type: "textarea", required: true, maxLength: 3000 },
    {
      name: "severity",
      type: "select",
      required: true,
      defaultValue: "low",
      options: ["low", "medium", "high", "critical"]
    },
    { name: "metadata", type: "json" },
    {
      name: "timestamp",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString()
    }
  ]
};
