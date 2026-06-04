import { createHmac, timingSafeEqual, randomBytes } from "crypto";

// ─── Environment Variables with safe fallbacks ────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "160835";
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "bondok-perfumes-default-secret-change-in-production-2026";

// Note: Set ADMIN_PASSWORD and ADMIN_TOKEN_SECRET env vars in production for security.
// Defaults are used for development convenience.

// ─── Rate Limiting for Login Attempts (In-Memory) ──────────────────
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPT_WINDOW = 5 * 60 * 1000;   // Count attempts within 5 min window

export function checkRateLimit(clientIp: string): { allowed: boolean; remainingAttempts: number; lockedUntil: number | null } {
  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  // No previous attempts
  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Check if currently locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil: record.lockedUntil,
    };
  }

  // Lockout expired, reset
  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(clientIp);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Check if attempts window expired
  if (now - record.lastAttempt > ATTEMPT_WINDOW) {
    loginAttempts.delete(clientIp);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS, lockedUntil: null };
  }

  // Within window, check count
  const remaining = MAX_ATTEMPTS - record.count;
  if (remaining <= 0) {
    const lockedUntil = record.lastAttempt + LOCKOUT_DURATION;
    record.lockedUntil = lockedUntil;
    loginAttempts.set(clientIp, record);
    return {
      allowed: false,
      remainingAttempts: 0,
      lockedUntil,
    };
  }

  return { allowed: true, remainingAttempts: remaining, lockedUntil: null };
}

export function recordFailedAttempt(clientIp: string): void {
  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  if (!record || now - record.lastAttempt > ATTEMPT_WINDOW) {
    loginAttempts.set(clientIp, { count: 1, lastAttempt: now, lockedUntil: 0 });
  } else {
    record.count += 1;
    record.lastAttempt = now;
    loginAttempts.set(clientIp, record);
  }
}

export function clearLoginAttempts(clientIp: string): void {
  loginAttempts.delete(clientIp);
}

// ─── Token Generation (Improved: with nonce) ──────────────────────
export function generateToken(): string {
  if (!TOKEN_SECRET) throw new Error("ADMIN_TOKEN_SECRET not configured");

  const timestamp = Date.now();
  const nonce = randomBytes(16).toString("hex"); // 32-char random nonce
  const payload = `${timestamp}.${nonce}`;
  const hmac = createHmac("sha256", TOKEN_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64");
}

// ─── Token Verification ────────────────────────────────────────────
export function verifyToken(token: string): boolean {
  if (!TOKEN_SECRET) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString();
    const parts = decoded.split(".");
    if (parts.length !== 3) return false; // timestamp.nonce.signature

    const [timestampStr, nonce, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Check expiry (24 hours)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) return false;

    // Verify signature
    const payload = `${timestampStr}.${nonce}`;
    const hmac = createHmac("sha256", TOKEN_SECRET);
    hmac.update(payload);
    const expectedSig = hmac.digest("hex");

    // Timing-safe comparison
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length) return false;
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

// ─── Password Check (timing-safe) ────────────────────────────────
export function checkPassword(password: string): boolean {
  if (!ADMIN_PASSWORD) return false; // Disabled if not configured

  const passBuf = Buffer.from(password);
  const adminBuf = Buffer.from(ADMIN_PASSWORD);
  if (passBuf.length !== adminBuf.length) return false;
  return timingSafeEqual(passBuf, adminBuf);
}

// ─── Cookie name for httpOnly cookie ──────────────────────────
export const ADMIN_COOKIE_NAME = "bondok_admin_token";

// ─── Helpers ──────────────────────────────────────────────────────

/**
 * Extract token from request.
 * Priority: Authorization header > httpOnly cookie
 * Keeping Authorization header for backwards compatibility during transition.
 */
export function getTokenFromRequest(req: Request): string | null {
  // 1. Try Authorization header (legacy support)
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  // 2. Try httpOnly cookie
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
    if (match?.[1]) return match[1];
  }

  return null;
}

export function isAdminRequest(req: Request): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  return verifyToken(token);
}

/**
 * Build httpOnly cookie string for Set-Cookie header
 */
export function buildAdminCookie(token: string): string {
  const maxAge = 24 * 60 * 60; // 24 hours (matches token expiry)
  return `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

/**
 * Build cookie string to clear the admin cookie (logout)
 */
export function buildAdminCookieClear(): string {
  return `${ADMIN_COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function getClientIp(req: Request): string {
  // Try common proxy headers, fallback to unknown
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
