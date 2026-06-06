import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/csrf";

export const dynamic = "force-dynamic";

// GET single order (admin only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const { id } = await params;
    const order = await db.siteOrder.findUnique({ where: { id: Number(id) } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders/:id] GET error:", message);
    return NextResponse.json({ error: "فشل جلب الطلب" }, { status: 500 });
  }
}

// PUT update order (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkCsrf(req)) {
    return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
  }
  try {
    await ensureSeeded();
    const { id } = await params;
    const body = await req.json();

    const existing = await db.siteOrder.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.status) {
      const ALLOWED_STATUSES = ["new", "preparing", "shipped", "delivered", "cancelled"];
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "قيمة حالة الطلب غير صالحة" }, { status: 400 });
      }
      updateData.status = body.status;
    }
    if (body.name) updateData.name = String(body.name);
    if (body.phone) updateData.phone = String(body.phone);
    if (body.address) updateData.address = String(body.address);
    if (body.notes !== undefined) updateData.notes = String(body.notes);

    const order = await db.siteOrder.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(order);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/orders/:id] PUT error:", message);
    return NextResponse.json({ error: "فشل تحديث الطلب" }, { status: 500 });
  }
}
