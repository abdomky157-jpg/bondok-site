import { NextRequest } from "next/server";

/**
 * Basic CSRF protection for mutating requests (POST/PUT/DELETE)
 * 
 * Strategy: Check Origin header matches the site's allowed origins
 * This prevents cross-site request forgery from other domains.
 * 
 * For API routes behind Next.js, we check:
 * 1. Origin or Referer header exists
 * 2. Origin matches the site's own domain or localhost
 */
const ALLOWED_ORIGINS = [
  "bondok-perfumes.vercel.app",
  "localhost",
  "127.0.0.1",
  // Allow additional origins via env var (comma-separated)
  ...(process.env.CSRF_ALLOWED_ORIGINS?.split(",").map(s => s.trim()).filter(Boolean) || []),
];

/**
 * Extract hostname from a URL-like string (origin, referer, etc.)
 */
function extractHost(url: string): string | null {
  try {
    // origin: "https://example.com" or "http://example.com:3000"
    // referer: "https://example.com/page"
    const u = new URL(url);
    return u.hostname;
  } catch {
    return null;
  }
}

export function checkCsrf(req: NextRequest): boolean {
  // Only check mutating methods
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return true;
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  // Must have at least one
  if (!origin && !referer) {
    return false;
  }

  // Check origin against allowed list (exact hostname match, not substring)
  if (origin) {
    const originHost = extractHost(origin)?.toLowerCase();
    if (originHost && ALLOWED_ORIGINS.some(allowed =>
      originHost === allowed || originHost.endsWith('.' + allowed)
    )) {
      return true;
    }
  }

  // Check referer against allowed list (exact hostname match)
  if (referer) {
    const refererHost = extractHost(referer)?.toLowerCase();
    if (refererHost && ALLOWED_ORIGINS.some(allowed =>
      refererHost === allowed || refererHost.endsWith('.' + allowed)
    )) {
      return true;
    }
  }

  // ─── Same-origin check ─────────────────────────────────────
  // If the origin/referer hostname matches the request's Host header,
  // it's a same-origin request → allow it.
  // This makes CSRF protection work regardless of deployment domain.
  if (host) {
    const hostName = host.split(":")[0].toLowerCase(); // strip port
    const originHost = origin ? extractHost(origin) : null;
    const refererHost = referer ? extractHost(referer) : null;
    if (originHost !== null && originHost !== undefined && originHost === hostName) return true;
    if (refererHost !== null && refererHost !== undefined && refererHost === hostName) return true;
  }

  // Also allow if no origin config is set (development mode)
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  return false;
}

/**
 * Check if the request has a valid Content-Type for JSON APIs
 */
export function checkContentType(req: NextRequest): boolean {
  const contentType = req.headers.get("content-type");
  // FormData uploads have multipart/form-data
  return !!(contentType?.includes("application/json") ||
         contentType?.includes("multipart/form-data"));
}
