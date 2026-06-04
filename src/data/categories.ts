export interface Occasion {
  id: string;
  n: string;
  e: string;
}

export interface Season {
  id: string;
  n: string;
  e: string;
}

export const occasions: Occasion[] = [
  { id: "work", n: "الشغل", e: "💼" },
  { id: "university", n: "الجامعة", e: "🎓" },
  { id: "wedding", n: "الفرح", e: "💍" },
  { id: "date", n: "ديت", e: "❤️" },
  { id: "casual", n: "خروجة شبابي", e: "🎉" },
  { id: "classic", n: "كلاسيك", e: "🧥" },
];

export const seasons: Season[] = [
  { id: "summer", n: "الصيف", e: "☀️" },
  { id: "winter", n: "الشتاء", e: "❄️" },
  { id: "spring", n: "الربيع", e: "🌸" },
  { id: "fall", n: "الخريف", e: "🍂" },
];

export const SEASON_AR: Record<string, string> = {
  summer: "الصيف",
  winter: "الشتاء",
  spring: "الربيع",
  fall: "الخريف",
};
