import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
