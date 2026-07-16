// Simple in-memory rate limiter.
// Works reliably in single-process Node.js environments (local dev, single-instance server).
// For multi-instance or serverless production deployments, replace the store with a
// distributed cache (e.g. Redis / Vercel KV).
//
// IP extraction note: `x-forwarded-for` / `x-real-ip` can be spoofed if the reverse
// proxy is not configured to strip client-supplied values of those headers before
// forwarding. Ensure your production proxy (Nginx, Cloudflare, etc.) overwrites these
// headers. On Vercel the header is injected by the platform and can be trusted.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

function pruneExpired() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

// Prune expired entries every 30 minutes to prevent unbounded memory growth.
const PRUNE_INTERVAL_MS = 30 * 60 * 1000;
let pruneTimer: ReturnType<typeof setInterval> | undefined;
if (typeof setInterval !== "undefined") {
  pruneTimer = setInterval(pruneExpired, PRUNE_INTERVAL_MS);
  // Allow the process to exit even if the interval is still active.
  if (pruneTimer?.unref) pruneTimer.unref();
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
