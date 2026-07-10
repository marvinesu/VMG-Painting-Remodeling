import type { CollectionConfig } from "payload";
import { adminsOnly, publishedOrAdmin } from "../lib/access";
import { slugHook } from "../lib/slug";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    group: "Content",
    defaultColumns: ["title", "slug", "published", "updatedAt"]
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
    { name: "metaTitle", type: "text", label: "Meta Title (SEO)" },
    { name: "metaDescription", type: "textarea", label: "Meta Description (SEO)" },
    { name: "featuredImage", type: "upload", relationTo: "media" },
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
