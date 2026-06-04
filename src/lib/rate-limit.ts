import { NextRequest, NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";

// ─── Generic Rate Limiter ────────────────────────────────────────
const rateLimitStore = new Map<string, { count: number; windowStart: number; lockedUntil: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  lockoutMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000,    // 1 minute window
  lockoutMs: 60 * 1000,   // 1 minute lockout
};

const STRICT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 10 * 60 * 1000,  // 10 minute window
  lockoutMs: 15 * 60 * 1000, // 15 minute lockout
};

/**
 * Check rate limit for a given key (usually IP + endpoint)
 * Returns { allowed, remainingRequests, retryAfter }
 */
export function rateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): { allowed: boolean; remainingRequests: number; retryAfter: number | null } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // No previous record
  if (!record) {
    rateLimitStore.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return { allowed: true, remainingRequests: config.maxRequests - 1, retryAfter: null };
  }

  // Check if locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remainingRequests: 0,
      retryAfter: Math.ceil((record.lockedUntil - now) / 1000),
    };
  }

  // Lockout expired - reset
  if (record.lockedUntil && now >= record.lockedUntil) {
    rateLimitStore.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return { allowed: true, remainingRequests: config.maxRequests - 1, retryAfter: null };
  }

  // Window expired - reset
  if (now - record.windowStart > config.windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return { allowed: true, remainingRequests: config.maxRequests - 1, retryAfter: null };
  }

  // Within window - check count
  const remaining = config.maxRequests - record.count;
  if (remaining <= 0) {
    record.lockedUntil = now + config.lockoutMs;
    rateLimitStore.set(key, record);
    return {
      allowed: false,
      remainingRequests: 0,
      retryAfter: Math.ceil(config.lockoutMs / 1000),
    };
  }

  record.count += 1;
  rateLimitStore.set(key, record);
  return { allowed: true, remainingRequests: remaining - 1, retryAfter: null };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

/**
 * Create a rate-limited rate limiter key for an endpoint
 */
export function rateLimitKey(req: NextRequest, endpoint: string): string {
  const ip = getClientIp(req);
  return `${ip}:${endpoint}`;
}

// Export configs for reuse
export { DEFAULT_CONFIG, STRICT_CONFIG };
