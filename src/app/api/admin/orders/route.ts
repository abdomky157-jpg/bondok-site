import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { rateLimit, rateLimitKey, STRICT_CONFIG } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/csrf";
import { orderCreateSchema, validateBody } from "@/lib/validators";

export const dynamic = "force-dynamic";

// ─── Valid discount codes (server-side) ──────────────────────────
const VALID_DISCOUNT_CODES: Record<string, number> = {
  BONDOK10: 10,
  SURPRISE20: 20,
};

// GET all orders (admin only)
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const orders = await db.siteOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders] GET error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create new order (public - customers place orders)
export async function POST(req: NextRequest) {
  try {
    // ─── Rate limiting (strict: 5 per 10 min) ────────────────────
    const rlKey = rateLimitKey(req, "orders:POST");
    const rl = rateLimit(rlKey, STRICT_CONFIG);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "تم تجاوز عدد الطلبات المسموح. حاول مرة أخرى لاحقاً.", retryAfter: rl.retryAfter },
        { status: 429 }
      );
    }

    // ─── CSRF protection ────────────────────────────────────────
    if (!checkCsrf(req)) {
      return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
    }

    await ensureSeeded();
    const body = await req.json();

    // ─── Zod validation ──────────────────────────────────────────
    const validation = validateBody(orderCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, phone, address, notes, items, discountCode, payment } = validation.data;

    // ─── SERVER-SIDE price calculation ──────────────────────────
    const serverSubtotal = items.reduce(
      (sum, item) => sum + (item.price * item.qty),
      0
    );

    // ─── Validate discount code server-side ─────────────────────
    const discountPct = discountCode && VALID_DISCOUNT_CODES[discountCode.toUpperCase()]
      ? VALID_DISCOUNT_CODES[discountCode.toUpperCase()]
      : 0;

    const serverDiscount = Math.round((serverSubtotal * discountPct) / 100);
    const serverTotal = serverSubtotal - serverDiscount;

    // ─── Sanity check total (must be >= 0) ──────────────────────
    if (serverTotal < 0) {
      return NextResponse.json({ error: "خطأ في حساب الأسعار" }, { status: 400 });
    }

    // ─── Create order with SERVER-CALCULATED values ──────────────
    const order = await db.siteOrder.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        items: JSON.stringify(items),
        subtotal: serverSubtotal,
        discount: serverDiscount,
        total: serverTotal,
        payment: payment,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders] POST error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
