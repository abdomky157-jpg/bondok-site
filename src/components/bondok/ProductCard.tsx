"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { TYPE_AR, GENDER_AR, type Product } from "@/data/products";
import { useBondokStore } from "@/store/bondok";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product: p }: ProductCardProps) {
  const { toggleWishlist, wishlist, setSelectedProduct, addToCart } = useBondokStore();
  const isWished = wishlist.includes(p.id);

  return (
    <div
      className="pc rounded-2xl overflow-hidden gold-border relative group"
      style={{ background: "rgba(45,27,17,.6)" }}
    >
      {p.badge && (
        <span
          className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold gold-gradient"
        >
          {p.badge}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
        className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-wood-950/60 border border-gold-500/20 flex items-center justify-center transition hover:bg-gold-500/20 touch-target"
      >
        <Heart size={16} className={isWished ? "fill-red-500 text-red-500" : "fill-gold-400 text-gold-400"} />
      </button>
      <button
        onClick={() => setSelectedProduct(p)}
        className="relative overflow-hidden aspect-square bg-wood-950/30 cursor-pointer block w-full"
      >
        <Image src={p.img} className="pimg w-full h-full object-cover transition-transform duration-500" alt={`${p.name} - ${p.ar}`} width={400} height={400} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-950/40 to-transparent" />
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
          className="acb absolute bottom-4 left-4 right-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 opacity-0 translate-y-4 flex items-center justify-center gap-2 gold-gradient"
        >
          <ShoppingCart size={14} /> أضف للسلة
        </button>
      </button>
      <div className="p-4">
        <p className="font-playfair text-gold-500/60 text-xs tracking-wider mb-1">{p.br.toUpperCase()}</p>
        <h3 className="font-playfair text-gold-300 font-semibold text-sm mb-1">{p.name}</h3>
        <p className="text-subtle text-xs mb-2">{p.ar}</p>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] border border-gold-500/20 text-gold-400/60">
            {GENDER_AR[p.g]}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] border border-gold-500/20 text-gold-400/60">
            {TYPE_AR[p.t]}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-gold-400 text-[10px]">⏱️</span>
            <span className="text-gold-400 text-[10px]">{p.lon}/10</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gold-400 text-[10px]">💨</span>
            <span className="text-gold-400 text-[10px]">{p.sil}/10</span>
          </div>
        </div>
        <span className="font-playfair text-gold-400 font-bold text-sm">
          {p.sz[0].p.toLocaleString()} <span className="text-gold-400/40 text-xs">ج.م</span>
        </span>
      </div>
    </div>
  );
}
