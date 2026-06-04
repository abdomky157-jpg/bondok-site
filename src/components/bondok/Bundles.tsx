"use client";

import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { Crown, Users, GraduationCap, Heart, Building2, Snowflake, CheckCircle, ShoppingCart, Gift } from "lucide-react";

const bundleIcons: Record<string, React.ReactNode> = {
  "mdi:account-group": <Users size={40} className="text-gold-400 mb-3 mx-auto" />,
  "mdi:crown": <Crown size={40} className="text-gold-400 mb-3 mx-auto" />,
  "mdi:school": <GraduationCap size={40} className="text-gold-400 mb-3 mx-auto" />,
  "mdi:heart-multiple": <Heart size={40} className="text-gold-400 mb-3 mx-auto" />,
  "mdi:office-building": <Building2 size={40} className="text-gold-400 mb-3 mx-auto" />,
  "mdi:snowflake": <Snowflake size={40} className="text-gold-400 mb-3 mx-auto" />,
};

export default function Bundles() {
  const { bundles } = useSiteData();
  const addToCart = useBondokStore((s) => s.addToCart);

  return (
    <section id="bun" className="relative py-20 wood-bg-lt">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
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
              className="rounded-2xl gold-border overflow-hidden"
              style={{ background: "rgba(45,27,17,.6)" }}
            >
              <div className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(212,164,76,.15),rgba(160,112,32,.08))", border: "1px solid rgba(212,164,76,.2)" }}>
                  <Gift size={32} className="text-gold-400" />
                </div>
                {bundleIcons[b.icon]}
                <h3 className="font-playfair text-xl font-bold text-gold-300 mb-1">{b.name}</h3>
                <p className="text-gold-100/50 text-sm mb-4">{b.desc}</p>
                <p className="font-playfair text-3xl font-bold text-gold-400 mb-4">
                  {b.price.toLocaleString()}{" "}
                  <span className="text-sm text-gold-400/40">ج.م</span>
                </p>
              </div>
              <div className="px-6 pb-4">
                <p className="text-gold-100/40 text-xs mb-2">المحتويات:</p>
                <ul className="space-y-1 mb-4">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-gold-300/70 text-sm">
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
                  className="w-full py-2.5 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> اطلب الباقة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
