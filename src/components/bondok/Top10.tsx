"use client";

import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";

export default function Top10() {
  const { products } = useSiteData();
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);
  const topProducts = products.filter((p) => p.top).slice(0, 10);

  return (
    <section id="t10" className="relative py-20 wood-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
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
              className="pc rounded-2xl overflow-hidden gold-border relative cursor-pointer"
              style={{ background: "rgba(45,27,17,.6)" }}
              onClick={() => setSelectedProduct(p)}
            >
              <div
                className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center font-playfair font-bold text-sm ${
                  i < 3
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-600 text-wood-950"
                    : "bg-wood-950/80 text-gold-400 border border-gold-500/30"
                }`}
              >
                {i + 1}
              </div>
              <div className="aspect-square overflow-hidden">
                <img
                  src={p.img}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  alt={p.name}
                />
              </div>
              <div className="p-3">
                <p className="font-playfair text-gold-300 font-semibold text-xs truncate">{p.name}</p>
                <p className="text-gold-400 text-[10px]">{p.sz[0].p.toLocaleString()} ج</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
