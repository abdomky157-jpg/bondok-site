import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/csrf";

// Allowed file types for upload
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkCsrf(req)) {
    return NextResponse.json({ error: "طلب غير مصرح به" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not allowed. Use JPEG, PNG, GIF, WebP, or SVG.` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 5MB.` },
        { status: 400 }
      );
    }

    // Convert file to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let base64: string;

    if (file.type === "image/svg+xml") {
      // SVG is text — sanitize to prevent XSS, then encode to base64
      let svgText = buffer.toString("utf-8");
      svgText = svgText
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
        .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
        .replace(/javascript\s*:/gi, "")
        .replace(/<\?xml[\s\S]*?\?>/gi, "")
        .replace(/<!DOCTYPE[\s\S]*?>/gi, "");
      base64 = Buffer.from(svgText).toString("base64");
    } else {
      // Binary images (JPEG, PNG, GIF, WebP) — convert directly to base64
      // Do NOT convert to UTF-8 string first — that corrupts binary data
      base64 = buffer.toString("base64");
    }

    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl, name: file.name, size: file.size });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[/api/admin/upload] Error:", message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
