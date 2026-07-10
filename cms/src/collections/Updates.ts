import type { CollectionConfig } from "payload";
import { adminsOnly, publishedOrAdmin } from "../lib/access";
import { slugHook } from "../lib/slug";

export const Updates: CollectionConfig = {
  slug: "updates",
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "slug", "category", "published", "publishedAt"]
  },
  access: {
    read: publishedOrAdmin,
    create: adminsOnly,
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
      admin: { description: "URL-safe; generated from the title when left blank." },
      hooks: { beforeValidate: [slugHook] }
    },
    { name: "content", type: "richText", required: true },
    { name: "excerpt", type: "textarea" },
    { name: "featuredImage", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "select",
      options: ["Company News", "Project Spotlight", "Tips & Guides", "Promotions"]
    },
    {
      name: "published",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" }
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar" }
    }
  ]
};
