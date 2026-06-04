import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { productCreateSchema, validateBody } from "@/lib/validators";

// GET all products (public)
export async function GET() {
  try {
    await ensureSeeded();
    const products = await db.siteProduct.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(products);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/products] GET error:", message);
    return NextResponse.json([]);
  }
}

// POST create product (admin only)
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const validation = validateBody(productCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data = validation.data;
    const p = await db.siteProduct.create({
      data: {
        name: data.name,
        ar: data.ar,
        brand: data.brand,
        gender: data.gender,
        type: data.type,
        sizes: JSON.stringify(data.sizes),
        image: data.image,
        badge: data.badge,
        longevity: data.longevity,
        sillage: data.sillage,
        topNotes: JSON.stringify(data.topNotes),
        heartNotes: JSON.stringify(data.heartNotes),
        baseNotes: JSON.stringify(data.baseNotes),
        occasions: JSON.stringify(data.occasions),
        seasons: JSON.stringify(data.seasons),
        desc: data.desc,
        top: data.top,
        order: data.order,
        active: data.active,
      },
    });
    return NextResponse.json(p);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
