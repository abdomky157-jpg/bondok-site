import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { bundleUpdateSchema, validateBody } from "@/lib/validators";
import { checkCsrf } from "@/lib/csrf";

function parseId(id: string): number {
  const num = parseInt(id);
  if (isNaN(num)) throw new Error("Invalid ID");
  return num;
}

// GET single bundle (public)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const b = await db.siteBundle.findUnique({ where: { id: parseId(id) } });
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(b);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PUT update bundle (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkCsrf(req)) {
    return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const numId = parseId(id);
    const body = await req.json();
    const validation = validateBody(bundleUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data = validation.data;
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.desc !== undefined) updateData.desc = data.desc;
    if (data.items !== undefined) updateData.items = JSON.stringify(data.items);
    if (data.order !== undefined) updateData.order = data.order;
    if (data.active !== undefined) updateData.active = data.active;

    const b = await db.siteBundle.update({ where: { id: numId }, data: updateData });
    return NextResponse.json(b);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE bundle (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkCsrf(req)) {
    return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const numId = parseId(id);
    await db.siteBundle.delete({ where: { id: numId } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
