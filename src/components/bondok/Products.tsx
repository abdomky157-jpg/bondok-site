"use client";

import { useState, useEffect } from "react";
import { Wine } from "lucide-react";
import { TYPE_AR, type Product } from "@/data/products";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import ProductCard from "./ProductCard";

const genderFilters = [
  { key: "all", label: "الكل" },
  { key: "men", label: "♂ رجالي" },
  { key: "women", label: "♀ نسائي" },
  { key: "unisex", label: "⚥ مشترك" },
];

const typeFilters = ["woody", "floral", "oriental", "fresh", "sweet", "spicy"];

const priceFilters = [
  { key: "all", label: "الكل" },
  { key: "u3", label: "أقل من 3000" },
  { key: "3-5", label: "3000-5000" },
  { key: "o5", label: "أكتر من 5000" },
];

const sortOptions = [
  { key: "default", label: "الافتراضي" },
  { key: "price-asc", label: "السعر: من الأقل" },
  { key: "price-desc", label: "السعر: من الأعلى" },
  { key: "name", label: "الاسم" },
  { key: "longevity", label: "الثبات" },
];

export default function Products() {
  const { products } = useSiteData();
  const [occasionFilter, setOccasionFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("default");
  const categoryFilter = useBondokStore((s) => s.categoryFilter);
  const setCategoryFilter = useBondokStore((s) => s.setCategoryFilter);
  const priceFilter = useBondokStore((s) => s.priceFilter);
  const setPriceFilter = useBondokStore((s) => s.setPriceFilter);

  // Listen for occasion filter events
  useEffect(() => {
    const h = (e: Event) => {
      const ce = e as CustomEvent<string>;
      setOccasionFilter(ce.detail);
    };
    window.addEventListener("filter-occasion", h);
    return () => window.removeEventListener("filter-occasion", h);
  }, []);

  const getFiltered = () => {
    let filtered = [...products];
    if (occasionFilter) {
      filtered = filtered.filter((p) => p.occ.includes(occasionFilter));
      // Apply sort even with occasion filter
    } else if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.g === categoryFilter || p.t === categoryFilter);
    }
    if (priceFilter === "u3") filtered = filtered.filter((p) => p.sz[0].p < 3000);
    else if (priceFilter === "3-5")
      filtered = filtered.filter((p) => p.sz[0].p >= 3000 && p.sz[0].p <= 5000);
    else if (priceFilter === "o5") filtered = filtered.filter((p) => p.sz[0].p > 5000);

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.sz[0].p - b.sz[0].p);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.sz[0].p - a.sz[0].p);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "longevity":
        filtered.sort((a, b) => b.lon - a.lon);
        break;
    }

    return filtered;
  };

  const filtered = getFiltered();

  const clearOccasion = () => {
    setOccasionFilter(null);
    setCategoryFilter("all");
    setPriceFilter("all");
  };

  return (
    <section id="prod" className="relative py-20 wood-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            المنتجات
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>

        {occasionFilter && (
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-sm">
              تصفية حسب المناسبة
              <button onClick={clearOccasion} className="text-gold-400 hover:text-gold-200">✕</button>
            </span>
          </div>
        )}

        {/* Gender Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {genderFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => { setOccasionFilter(null); setCategoryFilter(f.key); }}
              className={`fb px-5 py-2 rounded-full border border-gold-500/30 text-sm transition-all ${
                categoryFilter === f.key && !occasionFilter
                  ? "active"
                  : "text-gold-300 hover:bg-gold-500/10"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-gold-500/20">|</span>
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => { setOccasionFilter(null); setCategoryFilter(t); }}
              className={`fb px-4 py-2 rounded-full border border-gold-500/30 text-sm transition-all ${
                categoryFilter === t && !occasionFilter
                  ? "active"
                  : "text-gold-300 hover:bg-gold-500/10"
              }`}
            >
              {TYPE_AR[t]}
            </button>
          ))}
        </div>

        {/* Price Filters + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gold-500/50 text-xs ml-2">السعر:</span>
            {priceFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setPriceFilter(f.key)}
                className={`pb px-4 py-1.5 rounded-full border border-gold-500/20 text-xs transition-all ${
                  priceFilter === f.key
                    ? "active"
                    : "text-gold-300/70 hover:bg-gold-500/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold-500/50 text-xs">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-300 text-xs focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Wine size={64} className="text-gold-500/30 mx-auto mb-4" />
            <p className="font-amiri text-xl text-gold-300/50">لا توجد منتجات</p>
            <button
              onClick={() => { setOccasionFilter(null); setCategoryFilter("all"); setPriceFilter("all"); setSortBy("default"); }}
              className="mt-4 px-6 py-2 rounded-full border border-gold-500/20 text-gold-400 text-sm hover:bg-gold-500/10 transition"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
