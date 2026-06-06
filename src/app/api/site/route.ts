import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Auto-seed if database is empty
    await ensureSeeded();

    const [products, bundles, settings] = await Promise.all([
      db.siteProduct.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      db.siteBundle.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
      db.siteSetting.findMany(),
    ]);

    const settingsMap: Record<string, string> = {};
    for (const s of settings) settingsMap[s.key] = s.value;

    return NextResponse.json({ products, bundles, settings: settingsMap });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/site] Error:", message);
    // Return empty data on error so the site doesn't crash
    return NextResponse.json({ products: [], bundles: [], settings: {} });
  }
}
