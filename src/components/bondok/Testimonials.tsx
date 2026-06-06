"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد محمود",
    location: "القاهرة",
    text: "عطور أصلية 100% وبأسعار كويسة جداً. طلبت Creed Aventus والتوصيل كان في اليوم التالي. خدمة ممتازة!",
    rating: 5,
    product: "Creed Aventus",
  },
  {
    id: 2,
    name: "سارة حسن",
    location: "الإسكندرية",
    text: "من أفضل مواقع العطور اللي اتعاملت معاها. العطور كلها أصلية والتغليف كان في مستوى عالي جداً.",
    rating: 5,
    product: "Tom Ford Black Orchid",
  },
  {
    id: 3,
    name: "محمد عبدالله",
    location: "الجيزة",
    text: "عايز أشكر فريق Bondok على خدمتهم المميزة. استفساراتهم كانت سريعة والعطر وصل في حالة ممتازة.",
    rating: 4,
    product: "Dior Sauvage",
  },
  {
    id: 4,
    name: "نورهان أحمد",
    location: "المنصورة",
    text: "أول مرة أشتري عطور أونلاين وكانت تجربة رائعة! العطر مطابق للوصف 100%. هشتري تاني أكيد.",
    rating: 5,
    product: "Chanel No.5",
  },
  {
    id: 5,
    name: "عمر خالد",
    location: "طنطا",
    text: "الباقات مميزة جداً وقيمة ممتازة مقابل السعر. التوصيل كان سريع والتغليف احترافي.",
    rating: 5,
    product: "باقة الصداقة",
  },
  {
    id: 6,
    name: "ياسمين علي",
    location: "أسيوط",
    text: "كنت خايفة أشتري أونلاين بس جربت Bondok وكنت مرتاحة. العطور أصلية والأسعار أفضل من المحلات.",
    rating: 4,
    product: "Versace Bright Crystal",
  },
];

function RatingStars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= count ? "fill-gold-400 text-gold-400" : "fill-wood-800 text-wood-800"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) setVisibleCount(3);
      else if (window.innerWidth >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisible = () => {
    const items: typeof testimonials = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(testimonials[(activeIndex + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <section className="relative py-20 wood-bg-lt">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-amiri text-gold-400 text-lg mb-2">آراء عملائنا</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            شهادات العملاء
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getVisible().map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl gold-border transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "rgba(45,27,17,.6)" }}
            >
              <Quote size={24} className="text-gold-500/20 mb-3" />
              <p className="text-gold-100/70 text-sm leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gold-500/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-wood-950 font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-playfair text-gold-300 font-semibold text-sm">{t.name}</p>
                  <p className="text-gold-100/30 text-xs">{t.location} · {t.product}</p>
                </div>
                <RatingStars count={t.rating} />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 transition-all hover:scale-110 touch-target"
            aria-label="السابق"
          >
            <ChevronRight size={18} />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeIndex ? "bg-gold-400 w-6" : "bg-gold-500/20 hover:bg-gold-500/40"
                }`}
                aria-label={`شهادة ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 transition-all hover:scale-110 touch-target"
            aria-label="التالي"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
