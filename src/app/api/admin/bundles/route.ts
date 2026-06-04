import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { bundleCreateSchema, validateBody } from "@/lib/validators";

// GET all bundles (public)
export async function GET() {
  try {
    await ensureSeeded();
    const bundles = await db.siteBundle.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(bundles);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/bundles] GET error:", message);
    return NextResponse.json([]);
  }
}

// POST create bundle (admin only)
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const validation = validateBody(bundleCreateSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const data = validation.data;
    const b = await db.siteBundle.create({
      data: {
        name: data.name,
        icon: data.icon,
        price: data.price,
        desc: data.desc,
        items: JSON.stringify(data.items),
        order: data.order,
        active: data.active,
      },
    });
    return NextResponse.json(b);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
