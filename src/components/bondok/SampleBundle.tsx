"use client";

import { FlaskConical, Sparkles, Star, Package } from "lucide-react";
import { useBondokStore } from "@/store/bondok";

export default function SampleBundle() {
  const addToCart = useBondokStore((s) => s.addToCart);

  return (
    <section className="relative py-10 sm:py-16 wood-bg-lt overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-2xl gold-border p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden card-shine"
          style={{ background: "linear-gradient(135deg,rgba(45,27,17,.8),rgba(26,15,10,.9))" }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(212,164,76,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }} />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(212,164,76,.15),rgba(160,112,32,.08))", border: "1px solid rgba(212,164,76,.2)" }}>
              <FlaskConical size={32} className="text-gold-400" />
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold gold-shimmer mb-3">
              باقة السامبلز
            </h2>
            <p className="text-gold-100/50 text-lg mb-6">
              اختر 5 عطور سامبلز (3مل) وجربهم قبل ما تشتري
            </p>

            {/* Features */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-1.5 text-gold-400/70">
                <Package size={14} /> 5 عيارات
              </div>
              <div className="flex items-center gap-1.5 text-gold-400/70">
                <Sparkles size={14} /> عطور أصلية
              </div>
              <div className="flex items-center gap-1.5 text-gold-400/70">
                <Star size={14} /> تقييمات ممتازة
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-playfair text-5xl font-bold text-gold-400">80</span>
              <span className="text-gold-400/50 text-lg">ج.م</span>
            </div>
            <p className="text-gold-300/40 text-sm mb-8">
              ⭐ سعر الباقة بيتمخصم من أول أوردر ليك!
            </p>

            <button
              onClick={() =>
                addToCart({
                  id: 999,
                  name: "باقة السامبلز",
                  size: "5x3ml",
                  price: 80,
                  img: "https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=100",
                })
              }
              className="px-10 py-3.5 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-full hover:shadow-[0_0_30px_rgba(212,164,76,.4)] transition-all duration-300 hover:scale-105 active:scale-[0.98] text-lg"
            >
              اطلب باقة السامبلز
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
