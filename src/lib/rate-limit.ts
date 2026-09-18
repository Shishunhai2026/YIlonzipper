/**
 * Minimal in-memory rate limiter for the RFQ endpoint.
 *
 * SCOPE / LIMITS — read before relying on this:
 *   - State lives in the process, so it resets on redeploy and is per-instance
 *     if the site is ever scaled horizontally.
 *   - It is an abuse *dampener*, not a security boundary. An attacker who can
 *     rotate their apparent IP can sidestep it entirely.
 *   - The durable control is edge rate limiting (nginx `limit_req`, or a CDN /
 *     bot-management product) plus the honeypot field.
 * Treat this module as "stops casual duplicate submissions", nothing more.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5; // per window per key

/**
 * Hard ceiling on tracked keys. Without this, an attacker sending requests with
 * a fresh spoofed IP each time would grow the map without bound — nothing inside
 * the window is ever "expired", so the sweep would collect nothing and the
 * process would run out of memory.
 */
const MAX_BUCKETS = 10_000;

function sweep(now: number) {
  if (buckets.size < MAX_BUCKETS / 2) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  // Still full after sweeping: shed load rather than grow until the process dies.
  if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) {
    return { ok: false, remaining: 0, retryAfterSeconds: 60 };
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true, remaining: MAX_REQUESTS - bucket.count, retryAfterSeconds: 0 };
}

/**
 * How many reverse proxies *you* operate in front of this app.
 *
 * This matters: `X-Forwarded-For` is append-only and client-settable. With the
 * common nginx setting `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`,
 * a request arrives as `<attacker-supplied>, <real client ip>`. Taking the
 * left-most entry therefore trusts the attacker, who can rotate a fake IP per
 * request and never hit the limit. The trustworthy entry is the one your own
 * proxy appended — counted from the right.
 */
const TRUSTED_PROXY_HOPS = 1;

/**
 * Best-effort client identifier, or `null` when no trustworthy identity exists.
 *
 * Returning null rather than a shared sentinel like 'unknown' is deliberate: a
 * shared constant would let a single abusive client exhaust the budget for every
 * visitor on earth, locking the enquiry form for a site whose only conversion
 * path is that form.
 */
export function clientKeyFrom(headers: Headers): string | null {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length) {
      const index = Math.max(0, parts.length - TRUSTED_PROXY_HOPS);
      const candidate = parts[index];
      if (candidate) return candidate.slice(0, 64);
    }
  }

  // Also client-settable when nothing upstream rewrites headers, but it is the
  // least-bad signal available and is still capped in length.
  const realIp = headers.get('x-real-ip')?.trim();
  return realIp ? realIp.slice(0, 64) : null;
}
