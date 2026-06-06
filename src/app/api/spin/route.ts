import { NextResponse } from "next/server";
import { PRIZES } from "@/lib/spin-prizes";

export async function GET() {
  // Server-side random selection prevents client manipulation
  const idx = Math.floor(Math.random() * PRIZES.length);
  return NextResponse.json(PRIZES[idx]);
}
