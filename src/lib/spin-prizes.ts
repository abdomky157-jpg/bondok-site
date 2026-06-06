/**
 * Single source of truth for spin wheel prizes.
 * Used by both client (SpinWheel component) and server (spin API).
 */
export interface SpinPrize {
  label: string;
  code: string;
}

export const PRIZES: SpinPrize[] = [
  { label: "خصم 10%", code: "BONDOK10" },
  { label: "30ml هدية", code: "" },
  { label: "حاول تاني 🔄", code: "" },
  { label: "بلية هدية ☕", code: "" },
  { label: "خصم 10%", code: "BONDOK10" },
  { label: "مخمرية 🫖", code: "" },
  { label: "حاول تاني 🔄", code: "" },
  { label: "باقة سامبلز 🧪", code: "" },
];
