import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";

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
  } catch (e: any) {
    console.error("[/api/admin/orders/:id] GET error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT update order (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const { id } = await params;
    const body = await req.json();

    const existing = await db.siteOrder.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (body.status) updateData.status = String(body.status);
    if (body.name) updateData.name = String(body.name);
    if (body.phone) updateData.phone = String(body.phone);
    if (body.address) updateData.address = String(body.address);
    if (body.notes !== undefined) updateData.notes = String(body.notes);

    const order = await db.siteOrder.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(order);
  } catch (e: any) {
    console.error("[/api/admin/orders/:id] PUT error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
