import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; color: string; description: string }> = {
  new: { label: "جديد", color: "blue", description: "تم استلام طلبك وهنراجعه قريباً" },
  preparing: { label: "قيد التحضير", color: "yellow", description: "جاري تجهيز طلبك في المخزن" },
  shipped: { label: "تم الشحن", color: "purple", description: "طلبك في الطريق إليك" },
  delivered: { label: "تم التوصيل", color: "green", description: "تم تسليم طلبك بنجاح" },
  cancelled: { label: "ملغي", color: "red", description: "تم إلغاء هذا الطلب" },
};

// GET /api/orders/track?id=123&phone=01012345678
export async function GET(req: NextRequest) {
  try {
    // Rate limit: 10 requests per 10 minutes
    const rl = rateLimit({ limit: 10, window: "10m" });
    if (!rl.success) {
      return NextResponse.json({ error: "عدد المحاولات كثير. حاول بعد قليل" }, { status: 429 });
    }

    const url = new URL(req.url);
    const orderId = url.searchParams.get("id");
    const phone = url.searchParams.get("phone");

    if (!orderId) {
      return NextResponse.json({ error: "يرجى إدخال رقم الطلب" }, { status: 400 });
    }
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: "يرجى إدخال رقم التليفون" }, { status: 400 });
    }

    await ensureSeeded();

    const order = await db.siteOrder.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      return NextResponse.json({ error: "لم يتم العثور على هذا الطلب" }, { status: 404 });
    }

    // Verify phone number (normalized comparison)
    const normalizedPhone = phone.replace(/[^0-9]/g, "");
    const orderPhone = order.phone.replace(/[^0-9]/g, "");
    if (!orderPhone.includes(normalizedPhone.slice(-10)) && !normalizedPhone.includes(orderPhone.slice(-10))) {
      return NextResponse.json({ error: "رقم التليفون لا يتطابق مع هذا الطلب" }, { status: 403 });
    }

    const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.new;

    let items: unknown[] = [];
    try {
      items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    } catch {
      items = [];
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      statusLabel: statusInfo.label,
      statusDescription: statusInfo.description,
      name: order.name,
      items,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      payment: order.payment,
      address: order.address,
      createdAt: order.createdAt,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/orders/track] GET error:", message);
    return NextResponse.json({ error: "فشل تتبع الطلب" }, { status: 500 });
  }
}
