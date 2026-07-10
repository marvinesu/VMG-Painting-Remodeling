/**
 * Server-side reCAPTCHA verification (Google siteverify).
 *
 * Active only when RECAPTCHA_SECRET_KEY is set — without it every check is
 * skipped, so deploys are safe before the env var exists. Behavior:
 *  - explicit failure or low score  -> "fail" (caller drops the submission)
 *  - Google unreachable / 5xx      -> "pass" (fail-open: never lose a real
 *    lead to a Google outage; honeypot/timing/rate-limit still apply)
 * The secret and tokens are never logged.
 */

export type RecaptchaResult = {
  verdict: "pass" | "fail" | "skipped";
  score?: number;
  reason?: string;
};

const MIN_SCORE = 0.5;
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export function recaptchaEnabled(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export async function verifyRecaptcha(token: unknown, ip: string): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { verdict: "skipped", reason: "not configured" };
  if (typeof token !== "string" || token.trim() === "") {
    return { verdict: "fail", reason: "missing token" };
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") params.set("remoteip", ip);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!response.ok) {
      return { verdict: "pass", reason: `siteverify HTTP ${response.status} (fail-open)` };
    }
    const data = (await response.json()) as {
      success?: boolean;
      score?: number;
      "error-codes"?: string[];
    };
    if (!data.success) {
      return { verdict: "fail", reason: (data["error-codes"] ?? []).join(", ") || "verification failed" };
    }
    // Score-based (v3) keys return a score; checkbox (v2) keys don't.
    if (typeof data.score === "number" && data.score < MIN_SCORE) {
      return { verdict: "fail", score: data.score, reason: `score ${data.score} below ${MIN_SCORE}` };
    }
    return { verdict: "pass", score: data.score };
  } catch {
    return { verdict: "pass", reason: "siteverify unreachable (fail-open)" };
  }
}
