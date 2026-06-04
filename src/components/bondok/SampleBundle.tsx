"use client";

import { FlaskConical } from "lucide-react";
import { useBondokStore } from "@/store/bondok";

export default function SampleBundle() {
  const addToCart = useBondokStore((s) => s.addToCart);

  return (
    <section className="relative py-16 wood-bg-lt">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div
          className="rounded-2xl gold-border p-8 sm:p-12 text-center"
          style={{ background: "linear-gradient(135deg,rgba(45,27,17,.8),rgba(26,15,10,.9))" }}
        >
          <FlaskConical size={48} className="text-gold-400 mb-4 mx-auto" />
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold gold-shimmer mb-4">
            باقة السامبلز
          </h2>
          <p className="text-gold-100/60 text-lg mb-6">
            اختر 5 عطور سامبلز (3مل) وجربهم
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-playfair text-4xl font-bold text-gold-400">80</span>
            <span className="text-gold-400/60">ج.م</span>
          </div>
          <p className="text-gold-300/50 text-sm mb-6">
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
            className="px-8 py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-full hover:shadow-[0_0_20px_rgba(212,164,76,.3)] transition-all hover:scale-105"
          >
            اطلب باقة السامبلز
          </button>
        </div>
      </div>
    </section>
  );
}
