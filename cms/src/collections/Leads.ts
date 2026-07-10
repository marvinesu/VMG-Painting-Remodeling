import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access";

const SERVICE_OPTIONS = [
  "Interior Painting",
  "Exterior Painting",
  "Siding",
  "Roofing",
  "Windows Installation",
  "Wood Deck",
  "Composite Deck",
  "Custom Deck",
  "Remodeling Services",
  "Multiple Services",
  "Not Sure Yet"
];

const COUNTY_OPTIONS = ["Thurston County", "Pierce County", "King County", "Snohomish County", "Other"];

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "name",
    group: "Leads & Chats",
    defaultColumns: ["name", "phone", "email", "status", "createdAt"]
  },
  access: {
    // Public create only (the Astro endpoints forward submissions here);
    // reading, updating, and deleting requires an authenticated admin.
    create: anyone,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 200 },
    // email optional: the footer quick form and chatbot collect phone-first leads.
    { name: "email", type: "email" },
    { name: "phone", type: "text", maxLength: 40 },
    {
      name: "serviceNeeded",
      type: "select",
      hasMany: true,
      options: SERVICE_OPTIONS
    },
    { name: "projectAddress", type: "text", maxLength: 300 },
    { name: "city", type: "text", maxLength: 200 },
    { name: "county", type: "select", options: COUNTY_OPTIONS },
    { name: "message", type: "textarea", required: true, maxLength: 5000 },
    {
      name: "preferredContactMethod",
      type: "select",
      options: ["Phone Call", "Text Message", "Email"]
    },
    { name: "sourcePage", type: "text", maxLength: 300 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: ["new", "contacted", "resolved"],
      admin: { position: "sidebar" }
    },
    { name: "consent", type: "checkbox", required: true },
    { name: "ipAddress", type: "text", admin: { readOnly: true } },
    { name: "userAgent", type: "text", admin: { readOnly: true } }
  ]
};
