"use client";

import { useSiteData } from "@/context/SiteContext";
import { occasions } from "@/data/categories";
import { useBondokStore } from "@/store/bondok";

export default function Occasions() {
  const { products } = useSiteData();
  const setCategoryFilter = useBondokStore((s) => s.setCategoryFilter);
  const setPriceFilter = useBondokStore((s) => s.setPriceFilter);

  const handleOccasion = (occId: string) => {
    setCategoryFilter("all");
    setPriceFilter("all");
    // Scroll to products and filter by occasion
    setTimeout(() => {
      const el = document.getElementById("prod");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // Dispatch custom event for occasion filtering
        window.dispatchEvent(new CustomEvent("filter-occasion", { detail: occId }));
      }
    }, 100);
  };

  return (
    <section id="occ" className="relative py-20 wood-bg-lt">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="font-amiri text-gold-400 text-lg mb-2">
            العطر المناسب لكل لحظة
          </p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            أفضل عطر لكل مناسبة
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {occasions.map((o) => {
            const ps = products.filter((p) => p.occ.includes(o.id)).slice(0, 3);
            return (
              <button
                key={o.id}
                onClick={() => handleOccasion(o.id)}
                className="group cursor-pointer rounded-xl gold-border p-5 text-center hover:bg-gold-500/10 transition-all"
              >
                <span className="text-3xl mb-2 block">{o.e}</span>
                <h4 className="font-playfair text-gold-300 font-semibold text-sm mb-1">
                  {o.n}
                </h4>
                <p className="text-gold-100/40 text-xs mb-3">{ps.length} عطر</p>
                <div className="flex justify-center">
                  {ps.map((p) => (
                    <img
                      key={p.id}
                      src={p.img}
                      className="w-7 h-7 rounded-full border-2 border-wood-950 object-cover -mx-1 last:mx-0"
                      alt={p.name}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
