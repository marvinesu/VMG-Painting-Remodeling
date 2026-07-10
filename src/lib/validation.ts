/**
 * Server-side validation and sanitization for lead submissions.
 * Never trust client input: everything is trimmed, length-capped, control
 * characters stripped, and choice fields checked against the known options.
 */

export type FieldErrors = Record<string, string>;

// Control characters (except \n used in multiline fields), built from escapes
// so no literal control bytes end up in this file.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]", "g");

/** Strip control characters, collapse whitespace, trim, and cap length. */
export function clean(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

/** Like clean() but preserves line breaks for message/details fields. */
export function cleanMultiline(value: unknown, maxLength = 3000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function inList(value: string, options: readonly string[]): boolean {
  return options.includes(value);
}

/** Sanitize a multi-select: keep only known options, de-duplicated. */
export function pickFromList(values: unknown, options: readonly string[]): string[] {
  const list = Array.isArray(values) ? values : typeof values === "string" ? [values] : [];
  return [...new Set(list.map((item) => clean(item, 100)).filter((item) => options.includes(item)))];
}

/**
 * Basic spam heuristics. Returns the reason a submission should be silently
 * dropped (we still respond with success so bots don't adapt), or null when
 * it looks legitimate.
 */
export function spamReason(body: Record<string, unknown>): string | null {
  // Honeypot field: real visitors never see or fill it. The current field is
  // named `form_ref_check` — deliberately meaningless so browser autofill
  // never matches it (the old `company_website` name attracted autofill and
  // silently ate real submissions). The old name is still checked for bots
  // replaying cached markup.
  if (clean(body.form_ref_check, 200) !== "") return "honeypot (form_ref_check filled)";
  if (clean(body.company_website, 200) !== "") return "honeypot (company_website filled)";
  // Form filled implausibly fast (< 2.5s after render).
  const startedAt = Number(body.form_started_at);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2500) {
    return `filled too fast (${Date.now() - startedAt}ms)`;
  }
  return null;
}

export function isSpam(body: Record<string, unknown>): boolean {
  return spamReason(body) !== null;
}

/** Reject obviously suspicious free-text content (link farms). */
export function looksSuspicious(text: string): boolean {
  const links = text.match(/https?:\/\//gi);
  return Boolean(links && links.length > 2);
}
