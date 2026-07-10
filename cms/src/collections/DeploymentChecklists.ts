import type { CollectionConfig } from "payload";
import { adminsOnly } from "../lib/access";

export const DeploymentChecklists: CollectionConfig = {
  slug: "deployment-checklists",
  admin: {
    useAsTitle: "title",
    group: "Admin",
    defaultColumns: ["title", "environment", "lastReviewed"]
  },
  access: {
    create: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "environment",
      type: "select",
      options: ["production", "staging", "local"]
    },
    {
      name: "checklist",
      type: "array",
      fields: [
        { name: "item", type: "text", required: true },
        { name: "completed", type: "checkbox", defaultValue: false },
        { name: "notes", type: "textarea" }
      ]
    },
    { name: "lastReviewed", type: "date" },
    { name: "published", type: "checkbox", defaultValue: false }
  ]
};
