import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { productUpdateSchema, validateBody } from "@/lib/validators";

// GET single product (public)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await db.siteProduct.findUnique({ where: { id: parseInt(id) } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
}

// PUT update product (admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const validation = validateBody(productUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data = validation.data;
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.ar !== undefined) updateData.ar = data.ar;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.sizes !== undefined) updateData.sizes = JSON.stringify(data.sizes);
    if (data.image !== undefined) updateData.image = data.image;
    if (data.badge !== undefined) updateData.badge = data.badge;
    if (data.longevity !== undefined) updateData.longevity = data.longevity;
    if (data.sillage !== undefined) updateData.sillage = data.sillage;
    if (data.topNotes !== undefined) updateData.topNotes = JSON.stringify(data.topNotes);
    if (data.heartNotes !== undefined) updateData.heartNotes = JSON.stringify(data.heartNotes);
    if (data.baseNotes !== undefined) updateData.baseNotes = JSON.stringify(data.baseNotes);
    if (data.occasions !== undefined) updateData.occasions = JSON.stringify(data.occasions);
    if (data.seasons !== undefined) updateData.seasons = JSON.stringify(data.seasons);
    if (data.desc !== undefined) updateData.desc = data.desc;
    if (data.top !== undefined) updateData.top = data.top;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.active !== undefined) updateData.active = data.active;

    const p = await db.siteProduct.update({ where: { id: parseInt(id) }, data: updateData });
    return NextResponse.json(p);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE product (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.siteProduct.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
