import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content"
  },
  access: {
    // Images referenced by published pages/updates must be publicly readable.
    read: anyone,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "card", width: 640 },
      { name: "feature", width: 1280 }
    ]
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      label: "Alt Text",
      admin: {
        description: "Describe the image for screen readers and SEO."
      }
    }
  ]
};
