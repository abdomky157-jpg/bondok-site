"use client";

import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { TYPE_AR } from "@/data/products";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";

export default function WishlistDrawer() {
  const wishlistOpen = useBondokStore((s) => s.wishlistOpen);
  const setWishlistOpen = useBondokStore((s) => s.setWishlistOpen);
  const wishlist = useBondokStore((s) => s.wishlist);
  const toggleWishlist = useBondokStore((s) => s.toggleWishlist);
  const addToCart = useBondokStore((s) => s.addToCart);
  const setSelectedProduct = useBondokStore((s) => s.setSelectedProduct);
  const { products } = useSiteData();

  // Scroll lock when wishlist drawer is open
  useScrollLock(wishlistOpen);

  if (!wishlistOpen) return null;

  const wishProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAdd = (p: (typeof products)[0]) => {
    addToCart({
      id: p.id,
      name: p.ar,
      size: p.sz[0].s,
      price: p.sz[0].p,
      img: p.img,
    });
  };

  return (
    <div className="fixed inset-0 z-[10001]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        tabIndex={-1}
        onClick={() => setWishlistOpen(false)}
        onKeyDown={(e) => { if (e.key === "Escape") { setWishlistOpen(false); } }}
      />

      {/* Drawer */}
      <div
        className="absolute top-0 left-0 h-full w-full max-w-md shadow-2xl overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #1A0F0A, #2D1B11)",
          borderRight: "1px solid rgba(212,164,76,.2)",
          animation: "slideInRight 0.3s ease-out",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="المفضلة"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold-500/20">
          <h3 className="font-playfair text-xl font-bold gold-shimmer flex items-center gap-2">
            <Heart size={20} className="text-red-500" /> المفضلة
            {wishProducts.length > 0 && (
              <span className="text-gold-400/50 text-sm font-normal">
                ({wishProducts.length})
              </span>
            )}
          </h3>
          <button
            onClick={() => setWishlistOpen(false)}
            className="text-gold-500/70 hover:text-gold-400 transition touch-target"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {wishProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart
                size={48}
                className="text-gold-500/20 mx-auto mb-4"
              />
              <p className="font-amiri text-lg text-gold-300/50">
                مفيش منتجات في المفضلة
              </p>
              <p className="text-subtle text-xs mt-2">
                اضغط على &#10084;&#65039; عشان تضيف منتجات
              </p>
              <button
                onClick={() => setWishlistOpen(false)}
                className="mt-6 px-6 py-2 rounded-full border border-gold-500/20 text-gold-400 text-sm hover:bg-gold-500/10 transition"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-3 p-3 rounded-xl border border-gold-500/15 bg-wood-950/30 hover:bg-wood-950/50 transition"
                >
                  {/* Image */}
                  <button
                    onClick={() => { setSelectedProduct(p); setWishlistOpen(false); }}
                    className="shrink-0 w-20 h-20 rounded-lg overflow-hidden gold-border"
                  >
                    <img
                      src={p.img}
                      className="w-full h-full object-cover"
                      alt={`${p.name} - ${p.ar}`}
                    />
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => { setSelectedProduct(p); setWishlistOpen(false); }}
                      className="font-playfair text-gold-300 text-sm font-semibold hover:text-gold-400 transition block truncate w-full text-right"
                    >
                      {p.name}
                    </button>
                    <p className="text-subtle text-xs mb-1">
                      {p.br} &middot; {TYPE_AR[p.t]}
                    </p>
                    <p className="font-playfair text-gold-400 text-sm font-bold">
                      {p.sz[0].p.toLocaleString()} ج.م
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleAdd(p)}
                      className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500/20 transition"
                      title="أضف للسلة"
                    >
                      <ShoppingCart size={14} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition"
                      title="إزالة من المفضلة"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Clear All */}
              <button
                onClick={() => {
                  wishProducts.forEach((p) => toggleWishlist(p.id));
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400/60 text-xs hover:bg-red-500/10 transition mt-2"
              >
                مسح الكل ({wishProducts.length} منتج)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
