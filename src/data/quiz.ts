export interface QuizOption {
  t: string;
  v: string[];
}

export interface QuizQuestion {
  q: string;
  ic: string;
  m: boolean; // multi-select
  o: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    q: "إيه شخصيتك؟",
    ic: "mdi:account-question",
    m: false,
    o: [
      { t: "🦁 جريء ومغامر", v: ["fresh", "spicy"] },
      { t: "🌹 رومانسي وعاطفي", v: ["floral", "sweet"] },
      { t: "👑 أنيق وكلاسيكي", v: ["woody", "oriental"] },
      { t: "🌙 غامض وعميق", v: ["oriental", "woody"] },
      { t: "🎨 إبداعي ومختلف", v: ["spicy", "fresh"] },
    ],
  },
  {
    q: "أي روائح بتجذبك؟",
    ic: "mdi:nose",
    m: true,
    o: [
      { t: "🌲 خشبي - أرز وصندل وعود", v: ["woody"] },
      { t: "🌸 زهري - ورد وياسمين", v: ["floral"] },
      { t: "🕌 شرقي - عنبر وبخور وزعفران", v: ["oriental"] },
      { t: "💧 منعش - حمضيات وبحر", v: ["fresh"] },
      { t: "🔥 حار - توابل وقرفة", v: ["spicy"] },
      { t: "🍬 حلو - فانيليا وكاراميل", v: ["sweet"] },
    ],
  },
  {
    q: "بتحب العطر يكون إيه؟",
    ic: "mdi:volume-high",
    m: false,
    o: [
      { t: "🔊 فواح - كل الناس تسمعه", v: ["oriental", "woody"] },
      { t: "🔉 معتول - اللي قريب يسمعه", v: ["floral", "sweet"] },
      { t: "🔇 هادي - أنت بس تحسه", v: ["fresh", "spicy"] },
    ],
  },
  {
    q: "إيه المناسبة الأكتر؟",
    ic: "mdi:calendar-star",
    m: true,
    o: [
      { t: "💼 الشغل", v: ["work"] },
      { t: "🎓 الجامعة", v: ["university"] },
      { t: "💍 الأفراح", v: ["wedding"] },
      { t: "❤️ الديت", v: ["date"] },
      { t: "🎉 الخروجات", v: ["casual"] },
    ],
  },
  {
    q: "إيه فصلك المفضل؟",
    ic: "mdi:weather-sunny",
    m: false,
    o: [
      { t: "☀️ الصيف", v: ["summer"] },
      { t: "🍂 الخريف", v: ["fall"] },
      { t: "❄️ الشتاء", v: ["winter"] },
      { t: "🌸 الربيع", v: ["spring"] },
    ],
  },
  {
    q: "لو العطر كان شخص؟",
    ic: "mdi:drama-masks",
    m: false,
    o: [
      { t: "🎬 نجمة سينما لامعة", v: ["sweet", "floral"] },
      { t: "📚 شاعر مثقف", v: ["woody", "oriental"] },
      { t: "🏴‍☠️ قرصان مغامر", v: ["fresh", "spicy"] },
      { t: "🧘 حكيم وهادي", v: ["woody", "fresh"] },
      { t: "💃 راقصة شرقية", v: ["oriental", "sweet"] },
    ],
  },
];

export const TYPE_DESCRIPTIONS: Record<string, string> = {
  woody: "أنت واثق، بتحب الأناقة الكلاسيكية والعمق.",
  floral: "أنت رومانسي وعاطفي، بتحب الجمال والنعومة.",
  oriental: "أنت غامض وساحر، بتحب المغامرة والإثارة.",
  fresh: "أنت نشيط ومغامر، بتحب الحرية والانطلاق.",
  spicy: "أنت جريء ومختلف، بتحب تكسر المألوف.",
  sweet: "أنت حلو وحنين، بتحب الدفء والراحة.",
};

export const SURPRISE_REASONS: Record<string, string[]> = {
  woody: [
    "أنت واثق والعطر الخشبي بيعبر عن قوتك!",
    "الخشبية بتعكس عمق شخصيتك!",
    "الأناقة الكلاسيكية تبدأ من عطر خشبي!",
  ],
  floral: [
    "روحك الرومانسية محتاجة عطر زهري!",
    "الزهور بتعكس رقتك وجمالك!",
    "كل رشة بتذكرك بياسمين الصباح!",
  ],
  oriental: [
    "الغموض سحر والعطر الشرقي بيبرز جاذبيتك!",
    "العائلة الشرقية بتعبر عنك!",
    "العنبر والبخور بيحكوا قصتك!",
  ],
  fresh: [
    "نشاطك وحيويتك محتاجة عطر منعش!",
    "العطر المنعش زي شخصيتك!",
    "البحر والبرغموت بيمشوا مع روحك!",
  ],
  spicy: [
    "شخصيتك الجريئة محتاجة عطر حار!",
    "التوابل بتعكس طاقتك الإبداعية!",
    "الفلفل والقرفة بيمشوا مع جراتك!",
  ],
  sweet: [
    "قلبك الحلو محتاج عطر يمشى معاه!",
    "الفانيليا بيعبر عن طيبتك!",
    "العطر الحلو هيخلي الكل يحب يقرب!",
  ],
};

// Re-exported from shared constants for backwards compatibility
export { DISCOUNT_CODES } from "@/lib/discount-codes";
