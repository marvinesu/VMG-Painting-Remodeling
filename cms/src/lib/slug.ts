import type { FieldHook } from "payload";

/** Normalize any string to a URL-safe slug. */
export function formatSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Field hook: normalize the slug, falling back to the document title. */
export const slugHook: FieldHook = ({ value, data }) => {
  const source = typeof value === "string" && value.trim() !== "" ? value : ((data?.title as string) ?? "");
  return formatSlug(source);
};
