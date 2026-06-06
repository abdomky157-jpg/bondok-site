"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ShoppingCart, Star } from "lucide-react";
import { TYPE_AR, GENDER_AR, type Product } from "@/data/products";
import { occasions, SEASON_AR } from "@/data/categories";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";
import { CircleProgress, NoteRow } from "./shared/ProductComponents";

export default function ProductModal() {
  const { products } = useSiteData();
  const selectedProduct = useBondokStore((s) => s.selectedProduct);
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);
  const addToCart = useBondokStore((s) => s.addToCart);
  const [selSize, setSelSize] = useState(0);

  // Reset selected size when product changes
  useEffect(() => {
    setSelSize(0);
  }, [selectedProduct?.id]);

  // Scroll lock when modal is open
  useScrollLock(!!selectedProduct);

  if (!selectedProduct) return null;
  const p = selectedProduct;

  const sameFamily = products
    .filter((x) => x.t === p.t && x.id !== p.id)
    .slice(0, 4);

  const handleAdd = () => {
    addToCart({
      id: p.id,
      name: p.ar,
      size: p.sz[selSize].s,
      price: p.sz[selSize].p,
      img: p.img,
    });
    setSelectedProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.8)", backdropFilter: "blur(5px)" }}
      tabIndex={-1}
      onClick={() => setSelectedProduct(null)}
      onKeyDown={(e) => { if (e.key === "Escape") { setSelectedProduct(null); } }}
    >
      <div
        className="rounded-2xl max-w-[900px] w-full max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg,#2D1B11,#1A0F0A)",
          border: "1px solid rgba(212,164,76,.3)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="تفاصيل المنتج"
      >
        <div className="relative">
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-wood-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500/20 transition touch-target"
          >
            <X size={18} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative">
              <img src={p.img} className="w-full h-48 sm:h-56 md:h-full object-cover rounded-t-2xl md:rounded-r-2xl md:rounded-tl-none" alt={`${p.name} - ${p.ar}`} />
            </div>

            <div className="p-6 sm:p-8">
              <p className="font-playfair text-gold-500/60 text-xs tracking-[0.15em] mb-1">{p.br.toUpperCase()}</p>
              <h2 className="font-playfair text-2xl font-bold text-gold-300 mb-1">{p.name}</h2>
              <p className="text-subtle-light mb-4">{p.ar} · {TYPE_AR[p.t]}</p>
              <p className="text-gold-100/60 text-sm leading-relaxed mb-6">{p.desc}</p>

              {/* Longevity & Sillage */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl gold-border text-center">
                  <p className="text-subtle text-xs mb-2">⏱️ الثبات</p>
                  <CircleProgress value={p.lon} />
                </div>
                <div className="p-3 rounded-xl gold-border text-center">
                  <p className="text-subtle text-xs mb-2">💨 الفوحان</p>
                  <CircleProgress value={p.sil} color="#C4912E" />
                </div>
              </div>

              {/* Note Pyramid */}
              <div className="mb-6">
                <p className="font-playfair text-gold-300 font-semibold text-sm mb-3">🗺️ خريطة النوتات</p>
                <div className="space-y-2">
                  <NoteRow type="top" label="🎵 الافتتاحية" notes={p.tn} />
                  <NoteRow type="mid" label="❤️ القلب" notes={p.hn} />
                  <NoteRow type="base" label="🏠 القاعدة" notes={p.bn} />
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="font-playfair text-gold-300 font-semibold text-sm mb-2">📏 الأحجام</p>
                <div className="flex flex-wrap gap-2">
                  {p.sz.map((s, i) => (
                    <button
                      key={s.s}
                      onClick={() => setSelSize(i)}
                      className={`px-4 py-2.5 rounded-lg border text-gold-300 text-sm transition ${
                        selSize === i
                          ? "border-gold-500 ring-2 ring-gold-500 bg-gold-500/10"
                          : "border-gold-500/20 hover:bg-gold-500/10"
                      }`}
                    >
                      {s.s} - {s.p.toLocaleString()} ج.م
                    </button>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 -mx-6 sm:-mx-8 px-6 sm:px-8 pt-4 pb-2" style={{ background: "linear-gradient(to top, #1A0F0A 60%, transparent)" }}>
                <button
                  onClick={handleAdd}
                  className="w-full py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingCart size={16} /> أضف للسلة
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="px-6 sm:px-8 pb-4">
            <div className="flex flex-wrap gap-2">
              {p.occ.map((o) => {
                const oc = occasions.find((x) => x.id === o);
                return oc ? (
                  <span key={o} className="px-3 py-1 rounded-full text-xs border border-gold-500/20 text-gold-400/60">
                    {oc.e} {oc.n}
                  </span>
                ) : null;
              })}
              {p.sea.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs border border-gold-500/20 text-gold-400/60">
                  {SEASON_AR[s]}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="px-6 sm:px-8 pb-6">
            <p className="font-playfair text-gold-300 font-semibold text-sm mb-3">⭐ آراء العملاء</p>
            <div className="space-y-3">
              {p.rev.map((r, i) => (
                <div key={i} className="p-3 rounded-xl border border-gold-500/10 bg-wood-950/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-300 text-sm font-semibold">{r.n}</span>
                    <span className="text-gold-400 text-xs">
                      {"★".repeat(r.r)}{"☆".repeat(5 - r.r)}
                    </span>
                  </div>
                  <p className="text-subtle-light text-xs">{r.t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar */}
          {sameFamily.length > 0 && (
            <div className="px-6 sm:px-8 pb-8">
              <p className="font-playfair text-gold-300 font-semibold text-sm mb-3">
                💡 من نفس العائلة ({TYPE_AR[p.t]})
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {sameFamily.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => { setSelectedProduct(s); }}
                    className="shrink-0 w-32 cursor-pointer group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden gold-border mb-2">
                      <img src={s.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={`${s.name} - ${s.ar}`} loading="lazy" />
                    </div>
                    <p className="font-playfair text-gold-300 text-xs font-semibold truncate">{s.name}</p>
                    <p className="text-gold-400 text-[10px]">{s.sz[0].p.toLocaleString()} ج</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
