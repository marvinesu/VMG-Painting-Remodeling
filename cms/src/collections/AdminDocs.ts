import type { CollectionConfig } from "payload";
import { adminsOnly } from "../lib/access";
import { slugHook } from "../lib/slug";

export const AdminDocs: CollectionConfig = {
  slug: "admin-docs",
  admin: {
    useAsTitle: "title",
    group: "Admin",
    defaultColumns: ["title", "category", "updatedAt"]
  },
  access: {
    // Internal documentation — admins only, never public.
    create: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [slugHook] }
    },
    { name: "category", type: "text" },
    { name: "content", type: "richText" },
    { name: "published", type: "checkbox", defaultValue: false },
    { name: "internalOnly", type: "checkbox", defaultValue: true }
  ]
};
