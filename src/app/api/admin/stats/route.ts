import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDbStats, ensureSeeded } from "@/lib/auto-seed";

export const dynamic = "force-dynamic";

// GET database stats + connection test
export async function GET() {
  try {
    // Test DB connection by getting stats
    const stats = await getDbStats();
    const dbUrl = process.env.DATABASE_URL || "";
    const hasTurso = dbUrl.startsWith("libsql://");

    return NextResponse.json({
      connected: true,
      turso: hasTurso,
      database: hasTurso ? dbUrl.replace(/\/\/.*@/, "//***@") : "local",
      ...stats,
      total: stats.products + stats.bundles + stats.settings + stats.customers + stats.orders,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({
      connected: false,
      error: message,
      products: 0,
      bundles: 0,
      settings: 0,
      customers: 0,
      orders: 0,
      total: 0,
    });
  }
}

// POST seed database
export async function POST() {
  try {
    const seeded = await ensureSeeded(true);
    if (seeded) {
      const stats = await getDbStats();
      return NextResponse.json({ success: true, message: "تمت تعبئة البيانات بنجاح", ...stats });
    }
    return NextResponse.json({ success: false, message: "لم تتم التعبئة - حاول مرة أخرى" });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
