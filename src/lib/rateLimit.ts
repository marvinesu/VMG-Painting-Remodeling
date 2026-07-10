/**
 * Lightweight in-memory rate limiter for the lead endpoints.
 * Good enough for a single Node process on Hostinger; resets on restart.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5;
const COOLDOWN_MS = 15 * 1000; // minimum gap between submissions per IP

const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

  const limited =
    recent.length >= MAX_PER_WINDOW ||
    (recent.length > 0 && now - recent[recent.length - 1] < COOLDOWN_MS);

  if (!limited) {
    recent.push(now);
  }
  hits.set(ip, recent);

  // Opportunistic cleanup so the map never grows unbounded.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(key);
    }
  }

  return limited;
}
