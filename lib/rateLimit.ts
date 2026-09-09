// Basic in-memory, fixed-window rate limiter shared by every app/api route
// that triggers an external side effect (an n8n execution, etc.). It
// protects a single running server process from being spammed; on
// multi-instance serverless deployments each instance keeps its own
// counters, so this is a best-effort mitigation, not a hard guarantee —
// pair with a shared store (e.g. Upstash Redis) if you need it enforced
// across instances.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

// `scope` namespaces the bucket per route (e.g. "quote", "chat") so traffic
// on one endpoint can't exhaust another endpoint's budget for the same client.
export function isRateLimited(clientId: string, scope: string, now: number = Date.now()): boolean {
  const key = `${scope}:${clientId}`;
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}

export function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstAddress = forwardedFor?.split(",")[0]?.trim();
  return firstAddress || "unknown";
}
