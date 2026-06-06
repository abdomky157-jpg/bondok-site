import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/csrf";

export const dynamic = "force-dynamic";

// GET all customers (admin only)
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50") || 50));

    const [customers, total] = await Promise.all([
      db.siteCustomer.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.siteCustomer.count(),
    ]);
    return NextResponse.json({ customers, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/customers] GET error:", message);
    return NextResponse.json({ error: "فشل جلب العملاء" }, { status: 500 });
  }
}

// POST create new customer (admin only)
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkCsrf(req)) {
    return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
  }
  try {
    await ensureSeeded();
    const body = await req.json();
    const { name, phone, email, address, governorate, notes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "الاسم ورقم التليفون مطلوبين" }, { status: 400 });
    }

    // Check if phone already exists
    const existing = await db.siteCustomer.findUnique({ where: { phone: phone.trim() } });
    if (existing) {
      return NextResponse.json({ error: "رقم التليفون مسجل بالفعل" }, { status: 409 });
    }

    const customer = await db.siteCustomer.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || "",
        address: address?.trim() || "",
        governorate: governorate?.trim() || "",
        notes: notes?.trim() || "",
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/customers] POST error:", message);
    return NextResponse.json({ error: "فشل إنشاء العميل" }, { status: 500 });
