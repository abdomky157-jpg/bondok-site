import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/auto-seed";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// GET single customer
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const { id } = await params;
    const customer = await db.siteCustomer.findUnique({ where: { id: Number(id) } });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }
    return NextResponse.json(customer);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/customers/:id] GET error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update customer
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const { id } = await params;
    const body = await req.json();

    const existing = await db.siteCustomer.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = String(body.name).trim();
    if (body.phone !== undefined) {
      const newPhone = String(body.phone).trim();
      // Check uniqueness if phone changed
      if (newPhone !== existing.phone) {
        const phoneExists = await db.siteCustomer.findFirst({ where: { phone: newPhone } });
        if (phoneExists) {
          return NextResponse.json({ error: "رقم التليفون مسجل بالفعل عند عميل آخر" }, { status: 409 });
        }
      }
      updateData.phone = newPhone;
    }
    if (body.email !== undefined) updateData.email = String(body.email).trim();
    if (body.address !== undefined) updateData.address = String(body.address).trim();
    if (body.governorate !== undefined) updateData.governorate = String(body.governorate).trim();
    if (body.notes !== undefined) updateData.notes = String(body.notes).trim();

    const customer = await db.siteCustomer.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(customer);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/customers/:id] PUT error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE customer
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const { id } = await params;
    await db.siteCustomer.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/customers/:id] DELETE error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
