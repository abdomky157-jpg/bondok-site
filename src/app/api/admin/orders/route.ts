import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { rateLimit, rateLimitKey, STRICT_CONFIG } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/csrf";
import { orderCreateSchema, validateBody } from "@/lib/validators";
import { DISCOUNT_CODES } from "@/lib/discount-codes";

export const dynamic = "force-dynamic";

// GET all orders (admin only)
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50") || 50));

    const [orders, total] = await Promise.all([
      db.siteOrder.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.siteOrder.count(),
    ]);
    return NextResponse.json({ orders, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders] GET error:", message);
    return NextResponse.json({ error: "فشل جلب الطلبات" }, { status: 500 });
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

    // ─── SERVER-SIDE price verification (fetch actual prices from DB) ─
    let serverSubtotal = 0;
    for (const item of items) {
      const productId = parseInt(item.id, 10);
      if (isNaN(productId)) {
        return NextResponse.json({ error: "منتج غير موجود" }, { status: 400 });
      }
      const product = await db.siteProduct.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json({ error: "منتج غير موجود" }, { status: 400 });
      }
      const sizes = JSON.parse(product.sizes as string) as Array<{ s: string; p: number }>;
      const sizeObj = sizes.find((sz) => sz.s === item.size);
      const actualPrice = sizeObj?.p ?? sizes[0]?.p ?? 0;
      serverSubtotal += actualPrice * item.qty;
    }

    // ─── Validate discount code server-side ─────────────────────
    const discountPct = discountCode && DISCOUNT_CODES[discountCode.toUpperCase()]
      ? DISCOUNT_CODES[discountCode.toUpperCase()]
      : 0;

    const serverDiscount = Math.round((serverSubtotal * discountPct) / 100);
    const serverTotal = serverSubtotal - serverDiscount;

    // ─── Sanity check total (must be >= 0) ──────────────────────
    if (serverTotal < 0) {
      return NextResponse.json({ error: "خطأ في حساب الأسعار" }, { status: 400 });
    }

    // ─── Create order + update customer in a transaction ─────────
    const cleanPhone = phone.trim();
    const addressParts = address.trim().split(",").map(s => s.trim()).filter(Boolean);
    const governorate = addressParts[0] || "";

    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.siteOrder.create({
        data: {
          name: name.trim(),
          phone: cleanPhone,
          address: address.trim(),
          notes: notes.trim(),
          items: JSON.stringify(items),
          subtotal: serverSubtotal,
          discount: serverDiscount,
          total: serverTotal,
          payment: payment,
        },
      });

      // Auto-create or update customer record within the transaction
      const existingCustomer = await tx.siteCustomer.findUnique({ where: { phone: cleanPhone } });
      if (existingCustomer) {
        await tx.siteCustomer.update({
          where: { phone: cleanPhone },
          data: {
            name: name.trim(),
            totalOrders: { increment: 1 },
            totalSpent: { increment: serverTotal },
            lastOrderAt: new Date(),
            address: address.trim(),
            governorate: governorate,
          },
        });
      } else {
        await tx.siteCustomer.create({
          data: {
            name: name.trim(),
            phone: cleanPhone,
            address: address.trim(),
            governorate: governorate,
            totalOrders: 1,
            totalSpent: serverTotal,
            lastOrderAt: new Date(),
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders] POST error:", message);
    return NextResponse.json({ error: "فشل تقديم الطلب" }, { status: 500 });
  }
}
