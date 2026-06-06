"use client";

import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { Crown, Users, GraduationCap, Heart, Building2, Snowflake, CheckCircle, ShoppingCart, Gift, Sparkles } from "lucide-react";

const bundleIcons: Record<string, React.ReactNode> = {
  "mdi:account-group": <Users size={36} className="text-gold-400" />,
  "mdi:crown": <Crown size={36} className="text-gold-400" />,
  "mdi:school": <GraduationCap size={36} className="text-gold-400" />,
  "mdi:heart-multiple": <Heart size={36} className="text-gold-400" />,
  "mdi:office-building": <Building2 size={36} className="text-gold-400" />,
  "mdi:snowflake": <Snowflake size={36} className="text-gold-400" />,
};

export default function Bundles() {
  const { bundles } = useSiteData();
  const addToCart = useBondokStore((s) => s.addToCart);

  return (
    <section id="bun" className="relative py-10 sm:py-20 wood-bg-lt">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <p className="font-amiri text-gold-400 text-base sm:text-lg mb-2">وفر أكتر</p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold gold-shimmer mb-4">
            باقات مميزة
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((b) => (
            <div
              key={b.id}
              className="pc card-shine rounded-2xl gold-border overflow-hidden group"
              style={{ background: "rgba(45,27,17,.6)" }}
            >
              {/* Top decorative gradient */}
              <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(212,164,76,.4), transparent)" }} />
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg,rgba(212,164,76,.12),rgba(160,112,32,.06))", border: "1px solid rgba(212,164,76,.15)" }}>
                  <Gift size={28} className="text-gold-400" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-gold-200 mb-1">{b.name}</h3>
                <p className="text-gold-100/40 text-sm mb-5 leading-relaxed">{b.desc}</p>
                <div className="relative inline-block">
                  <span className="font-playfair text-3xl font-bold text-gold-400">
                    {b.price.toLocaleString()}
                  </span>
                  <span className="text-gold-400/40 text-sm mr-1">ج.م</span>
                  <div className="absolute -top-1 -left-3">
                    <Sparkles size={14} className="text-gold-400/40" />
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <p className="text-gold-100/30 text-xs mb-3 uppercase tracking-wider">المحتويات:</p>
                <ul className="space-y-2 mb-5">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-gold-300/60 text-sm">
                      <CheckCircle size={14} className="text-gold-500 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    addToCart({
                      id: 9000 + b.id,
                      name: b.name,
                      size: "باقة",
                      price: b.price,
                      img: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="16" fill="#2D1B11"/><rect x="5" y="5" width="90" height="90" rx="12" fill="none" stroke="%23D4A44C" stroke-width="2"/><text x="50" y="38" text-anchor="middle" font-size="28">🎁</text><text x="50" y="65" text-anchor="middle" font-size="9" font-family="sans-serif" fill="%23D4A44C" font-weight="bold">Bondok</text></svg>`),
                    })
                  }
                  className="w-full py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_4px_20px_rgba(212,164,76,.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart size={16} /> اطلب الباقة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
