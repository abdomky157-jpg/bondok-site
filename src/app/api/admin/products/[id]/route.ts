import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin-auth";
import { productUpdateSchema, validateBody } from "@/lib/validators";
import { checkCsrf } from "@/lib/csrf";

function parseId(id: string): number {
  const num = parseInt(id);
  if (isNaN(num)) throw new Error("Invalid ID");
  return num;
}

// GET single product (public)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const p = await db.siteProduct.findUnique({ where: { id: parseId(id) } });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(p);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// PUT update product (admin only)
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

    const p = await db.siteProduct.update({ where: { id: numId }, data: updateData });
    return NextResponse.json(p);
  } catch (e: unknown) {
    console.error("[/api/admin/products/:id] PUT error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "فشل تحديث المنتج" }, { status: 500 });
  }
}

// DELETE product (admin only)
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
    await db.siteProduct.delete({ where: { id: numId } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error("[/api/admin/products/:id] DELETE error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "فشل حذف المنتج" }, { status: 500 });
  }
}
