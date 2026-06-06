"use client";

import { Heart, ShoppingCart, Star, Clock, Wind } from "lucide-react";
import { TYPE_AR, GENDER_AR, type Product } from "@/data/products";
import { useBondokStore } from "@/store/bondok";
import { useSiteData } from "@/context/SiteContext";

interface ProductCardProps {
  product: Product;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={10}
          className={i <= Math.round(rating) ? "fill-gold-400 text-gold-400" : "fill-wood-800 text-wood-800"}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product: p }: ProductCardProps) {
  const { toggleWishlist, wishlist, setSelectedProduct, addToCart } = useBondokStore();
  const isWished = wishlist.includes(p.id);
  const rating = Math.min(5, (p.lon + p.sil) / 4);

  return (
    <div
      className="pc rounded-2xl overflow-hidden gold-border relative group"
      style={{ background: "rgba(45,27,17,.6)" }}
    >
      {p.badge && (
        <span
          className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold gold-gradient shadow-lg"
          style={{ boxShadow: "0 0 15px rgba(212,164,76,.3)" }}
        >
          {p.badge}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
        className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-wood-950/60 border border-gold-500/20 flex items-center justify-center transition-all duration-300 hover:bg-gold-500/20 hover:scale-110 touch-target"
        aria-label={isWished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        <Heart size={16} className={`transition-all duration-300 ${isWished ? "fill-red-500 text-red-500 scale-110" : "fill-gold-400 text-gold-400"}`} />
      </button>
      <div
        onClick={() => setSelectedProduct(p)}
        className="relative overflow-hidden aspect-square bg-wood-950/30 cursor-pointer block w-full"
        role="button"
        tabIndex={0}
        aria-label={`عرض ${p.name}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedProduct(p); }}
      >
        <img
          src={p.img}
          className="pimg w-full h-full object-cover transition-transform duration-700"
          alt={`${p.name} - ${p.ar}`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-950/60 via-transparent to-transparent" />
        <div className="absolute top-12 left-3 flex flex-col gap-1">
          <div className="acb flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-wood-950/70 border border-gold-500/20 text-gold-300">
            <Clock size={10} className="text-gold-400" /> {p.lon}/10
          </div>
          <div className="acb flex items-center gap-1 px-2 py-1 rounded-full text-[10px] bg-wood-950/70 border border-gold-500/20 text-gold-300">
            <Wind size={10} className="text-gold-400" /> {p.sil}/10
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart({
              id: p.id,
              name: p.ar,
              size: p.sz[0].s,
              price: p.sz[0].p,
              img: p.img,
            });
          }}
          className="acb absolute bottom-4 left-4 right-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 opacity-0 translate-y-4 flex items-center justify-center gap-2 gold-gradient"
          style={{ boxShadow: "0 4px 15px rgba(212,164,76,.3)" }}
        >
          <ShoppingCart size={16} /> أضف للسلة
        </button>
      </div>
      <div className="p-4 pt-3">
        <div className="flex items-center justify-between mb-1">
          <p className="font-playfair text-gold-500/50 text-[10px] tracking-widest uppercase">{p.br}</p>
          <RatingStars rating={rating} />
        </div>
        <h3 className="font-playfair text-gold-200 font-semibold text-sm mb-0.5 truncate">{p.name}</h3>
        <p className="text-subtle text-xs mb-2 truncate">{p.ar}</p>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-gold-500/8 border border-gold-500/15 text-gold-400/70">
            {GENDER_AR[p.g]}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] bg-gold-500/8 border border-gold-500/15 text-gold-400/70">
            {TYPE_AR[p.t]}
          </span>
          {p.sz.length > 1 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-gold-500/8 border border-gold-500/15 text-gold-400/70">
              {p.sz.length} أحجام
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-playfair text-gold-300 font-bold text-base">
            {p.sz[0].p.toLocaleString()} <span className="text-gold-400/50 text-xs font-normal">ج.م</span>
          </span>
          {p.sz.length > 1 && (
            <span className="text-[10px] text-gold-400/40">{p.sz[0].s}</span>
          )}
        </div>
      </div>
    </div>
  );
}
