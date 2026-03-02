type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type Entry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, Entry>();

export function consumeRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  memoryStore.set(key, current);
  return { allowed: true, retryAfterSec: 0 };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}
