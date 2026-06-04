import { NextRequest, NextResponse } from "next/server";
import { checkPassword, generateToken, verifyToken, getTokenFromRequest, checkRateLimit, recordFailedAttempt, clearLoginAttempts, getClientIp, buildAdminCookie, buildAdminCookieClear, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { authSchema, validateBody } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // Rate limit check
    const rateInfo = checkRateLimit(clientIp);
    if (!rateInfo.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "LOCKED_OUT",
          message: "تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى بعد 15 دقيقة.",
          lockedUntil: rateInfo.lockedUntil,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = validateBody(authSchema, body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    if (checkPassword(validation.data.password)) {
      clearLoginAttempts(clientIp);
      const token = generateToken();

      // Set token as httpOnly cookie - NOT returned in response body
      const response = NextResponse.json({ success: true });
      response.headers.set("Set-Cookie", buildAdminCookie(token));
      return response;
    }

    recordFailedAttempt(clientIp);
    const updatedInfo = checkRateLimit(clientIp);

    return NextResponse.json(
      {
        success: false,
        error: "INVALID_PASSWORD",
        message: "كلمة المرور غير صحيحة",
        remainingAttempts: updatedInfo.remainingAttempts,
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// Verify if current token is still valid (checks cookie automatically)
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (token && verifyToken(token)) {
    return NextResponse.json({ valid: true });
  }
  return NextResponse.json({ valid: false }, { status: 401 });
}

// Logout - clear the cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", buildAdminCookieClear());
  return response;
}
