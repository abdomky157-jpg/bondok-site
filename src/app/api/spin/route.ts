import { NextResponse } from "next/server";

const PRIZES = [
  { label: "خصم 10%", code: "BONDOK10" },
  { label: "30ml هدية", code: "" },
  { label: "حاول تاني 🔄", code: "" },
  { label: "بلية هدية ☕", code: "" },
  { label: "خصم 10%", code: "BONDOK10" },
  { label: "مخمرية 🫖", code: "" },
  { label: "حاول تاني 🔄", code: "" },
  { label: "باقة سامبلز 🧪", code: "" },
];

export async function GET() {
  // Server-side random selection prevents client manipulation
  const idx = Math.floor(Math.random() * PRIZES.length);
  return NextResponse.json(PRIZES[idx]);
}
