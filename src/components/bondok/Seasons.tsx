"use client";

import { useState } from "react";
import { TYPE_AR, GENDER_AR, type Product } from "@/data/products";
import { seasons } from "@/data/categories";
import { Heart, ShoppingCart } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";

export default function Seasons() {
  const { products } = useSiteData();
  const [active, setActive] = useState("summer");
  const wishlist = useBondokStore((s) => s.wishlist);
  const toggleWishlist = useBondokStore((s) => s.toggleWishlist);
  const addToCart = useBondokStore((s) => s.addToCart);
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);

  const filtered = products.filter((p) => p.sea.includes(active));

  return (
    <section id="sea" className="relative py-20 wood-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            أفضل العطور للمواسم
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {seasons.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`sb px-6 py-2.5 rounded-full border border-gold-500/30 text-sm transition-all ${
                active === s.id
                  ? "active text-gold-950 font-bold"
                  : "text-gold-300 hover:bg-gold-500/10"
              }`}
              data-s={s.id}
            >
              {s.e} {s.n}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <MiniCard
              key={p.id}
              product={p}
              wishlisted={wishlist.includes(p.id)}
              onWish={() => toggleWishlist(p.id)}
              onCart={() =>
                addToCart({ id: p.id, name: p.ar, size: p.sz[0].s, price: p.sz[0].p, img: p.img })
              }
              onOpen={() => setSelectedProduct(p)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniCard({
  product: p,
  wishlisted,
  onWish,
  onCart,
  onOpen,
}: {
  product: Product;
  wishlisted: boolean;
  onWish: () => void;
  onCart: () => void;
  onOpen: () => void;
}) {
  return (
    <div
      className="pc rounded-2xl overflow-hidden gold-border relative group"
      style={{ background: "rgba(45,27,17,.6)" }}
    >
      {p.badge && (
        <span className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}>
          {p.badge}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onWish(); }}
        className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-wood-950/60 border border-gold-500/20 flex items-center justify-center transition hover:bg-gold-500/20"
      >
        <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : "fill-gold-400 text-gold-400"} />
      </button>
      <div className="relative overflow-hidden aspect-square bg-wood-950/30 cursor-pointer" onClick={onOpen} role="button" tabIndex={0} aria-label={`عرض ${p.name}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen(); }}>
        <img src={p.img} className="pimg w-full h-full object-cover transition-transform duration-500" alt={p.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-950/40 to-transparent" />
        <button
          onClick={(e) => { e.stopPropagation(); onCart(); }}
          className="acb absolute bottom-4 left-4 right-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 opacity-0 translate-y-4"
          style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}
        >
          أضف للسلة
        </button>
      </div>
      <div className="p-4">
        <p className="font-playfair text-gold-500/60 text-xs tracking-wider mb-1">{p.br.toUpperCase()}</p>
        <h3 className="font-playfair text-gold-300 font-semibold text-sm mb-1">{p.name}</h3>
        <p className="text-gold-100/40 text-xs mb-2">{p.ar}</p>
        <span className="font-playfair text-gold-400 font-bold text-sm">
          {p.sz[0].p.toLocaleString()} <span className="text-gold-400/40 text-xs">ج.م</span>
        </span>
      </div>
    </div>
  );
}
