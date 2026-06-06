import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/csrf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkCsrf(req)) {
    return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
  }
  try {
    // Support force reset via query param
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    if (force) {
      // Delete all existing data
      await db.siteProduct.deleteMany();
      await db.siteBundle.deleteMany();
      await db.siteSetting.deleteMany();
    }

    // Use auto-seed (handles table creation + seeding)
    const seeded = await ensureSeeded();
    return NextResponse.json({ message: seeded ? "Seeded successfully" : "Already seeded" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
