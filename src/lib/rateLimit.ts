/**
 * A simple in-memory per-key rate limiter. This is intentionally the
 * zero-setup, zero-cost option: it lives in the serverless function's
 * memory, which Vercel often reuses for a burst of requests in quick
 * succession (a "warm" instance), so it catches the most common abuse
 * pattern — a bot or a fast clicker hammering one route.
 *
 * What it does NOT do: guarantee a hard global limit under high traffic,
 * since concurrent/cold-started instances don't share this memory. If
 * this project ever gets real traffic, swap this for Upstash Redis
 * (also has a free tier) using the same checkRateLimit() signature.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetInSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetInSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

export function clientKeyFromRequest(req: Request, routeName: string): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0].trim() : "unknown";
  return `${routeName}:${ip}`;
}
