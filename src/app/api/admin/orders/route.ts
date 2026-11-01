import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { rateLimit, rateLimitKey, STRICT_CONFIG } from "@/lib/rate-limit";
import { checkCsrf } from "@/lib/csrf";
import { orderCreateSchema, validateBody } from "@/lib/validators";
import { DISCOUNT_CODES } from "@/lib/discount-codes";
import { products as staticProducts } from "@/data/products";
import { bundles as staticBundles } from "@/data/bundles";

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

    try {
      await ensureSeeded();
    } catch {
      // Continue even if seed fails
    }

    const body = await req.json();

    // ─── Zod validation ──────────────────────────────────────────
    const validation = validateBody(orderCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { name, phone, address, notes, items, discountCode, payment } = validation.data;

    // ─── SERVER-SIDE price verification ─────────────────────────
    // Checks DB, falls back to static catalog or cart item price
    let serverSubtotal = 0;
    for (const item of items) {
      const productId = parseInt(item.id, 10);
      let actualPrice = typeof item.price === "number" && item.price > 0 ? item.price : 0;

      if (!isNaN(productId)) {
        // 1. Sample bundle
        if (productId === 999) {
          actualPrice = 80;
        }
        // 2. Bundles (id >= 9000)
        else if (productId >= 9000) {
          const bundleId = productId - 9000;
          const staticBundle = staticBundles.find((b) => b.id === bundleId);
          if (staticBundle) {
            actualPrice = staticBundle.price;
          } else {
            try {
              const dbBundle = await db.siteBundle.findUnique({ where: { id: bundleId } });
              if (dbBundle) actualPrice = dbBundle.price;
            } catch {
              // fallback
            }
          }
        }
        // 3. Perfumes
        else {
          let found = false;
          try {
            const product = await db.siteProduct.findUnique({ where: { id: productId } });
            if (product) {
              const sizes = JSON.parse(product.sizes as string) as Array<{ s: string; p: number }>;
              const sizeObj = sizes.find((sz) => sz.s === item.size) || sizes[0];
              actualPrice = sizeObj?.p ?? actualPrice;
              found = true;
            }
          } catch {
            // DB lookup failed, check static
          }

          if (!found) {
            const staticProd = staticProducts.find((p) => p.id === productId);
            if (staticProd) {
              const sizeObj = staticProd.sz.find((sz) => sz.s === item.size) || staticProd.sz[0];
              actualPrice = sizeObj?.p ?? actualPrice;
            }
          }
        }
      }

      serverSubtotal += actualPrice * item.qty;
    }

    // ─── Validate discount code server-side ─────────────────────
    const discountPct = discountCode && DISCOUNT_CODES[discountCode.toUpperCase()]
      ? DISCOUNT_CODES[discountCode.toUpperCase()]
      : 0;

    const serverDiscount = Math.round((serverSubtotal * discountPct) / 100);
    const serverTotal = Math.max(0, serverSubtotal - serverDiscount);

    // ─── Create order + update customer record ─────────────────
    const cleanPhone = phone.trim();
    const addressParts = address.trim().split(",").map(s => s.trim()).filter(Boolean);
    const governorate = addressParts[0] || "";

    const newOrder = await db.siteOrder.create({
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
        status: "new",
      },
    });

    // Customer record (graceful update)
    try {
      const existingCustomer = await db.siteCustomer.findUnique({ where: { phone: cleanPhone } });
      if (existingCustomer) {
        await db.siteCustomer.update({
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
        await db.siteCustomer.create({
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
    } catch (custErr) {
      console.warn("[/api/admin/orders] Customer update skipped:", custErr);
    }

    console.log(`[ORDER CREATED #${newOrder.id}] Customer: ${name.trim()} (${cleanPhone}) | Address: ${address.trim()} | Total: ${serverTotal} EGP`);

    // Optional webhook notification (e.g. Discord, Telegram or Webhook)
    const webhookUrl = process.env.ORDER_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "new_order",
            orderId: newOrder.id,
            name: name.trim(),
            phone: cleanPhone,
            address: address.trim(),
            total: serverTotal,
            payment,
            items,
          }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders] POST error:", message);
    return NextResponse.json({ error: "فشل تقديم الطلب. يرجى المحاولة مرة أخرى." }, { status: 500 });
  }
}
