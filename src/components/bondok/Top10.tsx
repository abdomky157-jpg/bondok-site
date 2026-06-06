"use client";

import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

export default function Top10() {
  const { products } = useSiteData();
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);
  const router = useRouter();
  const topProducts = products.filter((p) => p.top).slice(0, 10);

  return (
    <section id="t10" className="relative py-10 sm:py-20 wood-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <p className="font-amiri text-gold-400 text-base sm:text-lg mb-2">الأكثر مبيعاً</p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold gold-shimmer mb-4">
            🏆 Top 10
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {topProducts.map((p, i) => (
            <div
              key={p.id}
              className="pc card-shine rounded-2xl overflow-hidden gold-border relative cursor-pointer group"
              style={{ background: "rgba(45,27,17,.6)" }}
              onClick={() => router.push(`/product/${p.id}`)}
            >
              {/* Rank Badge */}
              <div
                className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-playfair font-bold text-sm transition-transform duration-300 group-hover:scale-110 ${
                  i < 3
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-600 text-wood-950 shadow-lg"
                    : "bg-wood-950/80 text-gold-400 border border-gold-500/30"
                }`}
                style={i < 3 ? { boxShadow: "0 0 15px rgba(234,179,8,.4)" } : {}}
              >
                {i + 1}
              </div>
              {/* Top 3 Crown */}
              {i === 0 && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                  <Trophy size={18} className="text-yellow-400" style={{ filter: "drop-shadow(0 0 6px rgba(234,179,8,.6))" }} />
                </div>
              )}
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={p.img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={p.name}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-950/50 to-transparent" />
              </div>
              <div className="p-3">
                <p className="font-playfair text-gold-200 font-semibold text-xs truncate">{p.name}</p>
                <p className="text-gold-400/60 text-[10px] truncate mb-1">{p.ar}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold-400 text-xs font-bold">{p.sz[0].p.toLocaleString()} ج</span>
                  {i < 3 && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">
                      الأكثر مبيعاً
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
