"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { TYPE_AR, GENDER_AR } from "@/data/products";
import { occasions, SEASON_AR } from "@/data/categories";
import Navbar from "@/components/bondok/Navbar";
import Footer from "@/components/bondok/Footer";
import CartDrawer from "@/components/bondok/CartDrawer";
import CheckoutModal from "@/components/bondok/CheckoutModal";
import WishlistDrawer from "@/components/bondok/WishlistDrawer";
import FloatingButtons from "@/components/bondok/FloatingButtons";
import { CircleProgress, NoteRow } from "@/components/bondok/shared/ProductComponents";
import {
  ShoppingCart, Heart, ArrowRight, Star, Share2,
  Clock, Wind, MapPin, Phone, MessageCircle, Sparkles,
} from "lucide-react";
import { triggerAddToCartEvent } from "@/lib/cart-events";

export default function ProductPageClient({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 15+ with React 19, params is a Promise that needs to be unwrapped with `use()`
  // But since this is "use client", we use the hook pattern instead
  const routeParams = useParams();
  const router = useRouter();
  const { products } = useSiteData();
  const addToCart = useBondokStore((s) => s.addToCart);
  const toggleWishlist = useBondokStore((s) => s.toggleWishlist);
  const wishlist = useBondokStore((s) => s.wishlist);
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);
  const toggleCart = useBondokStore((s) => s.toggleCart);

  const productId = parseInt(routeParams.id as string, 10);
  const product = products.find((p) => p.id === productId);

  // Size selection state
  const [selectedSize, setSelectedSize] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center wood-bg">
        <div className="text-center px-6">
          <p className="text-6xl mb-6">🧴</p>
          <h2 className="font-playfair text-3xl font-bold text-gold-400 mb-3">المنتج غير موجود</h2>
          <p className="text-gold-100/50 mb-6">المنتج اللي بتدور عليه مش موجود أو اتمسح</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 gold-gradient rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(212,164,76,.3)] transition-all hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <ArrowRight size={18} />
              الرجوع للرئيسية
            </span>
          </button>
        </div>
      </div>
    );
  }

  const p = product;
  const isWished = wishlist.includes(p.id);
  const sameFamily = products.filter((x) => x.t === p.t && x.id !== p.id).slice(0, 6);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${p.name} - ${p.ar} | Bondok Perfumes`,
        text: `${p.ar} - ${p.sz[selectedSize].p} ج.م`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gold-100/40">
            <button onClick={() => router.push("/")} className="hover:text-gold-400 transition">الرئيسية</button>
            <span>/</span>
            <button onClick={() => router.push("/#prod")} className="hover:text-gold-400 transition">المنتجات</button>
            <span>/</span>
            <span className="text-gold-300 truncate max-w-[150px] sm:max-w-none">{p.ar}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            {/* Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden gold-border relative">
                <img
                  src={p.img}
                  className="w-full aspect-square object-cover"
                  alt={`${p.name} - ${p.ar}`}
                />
                <div className="absolute inset-0 pc-image-overlay" />
              </div>
              {/* Wishlist + Share */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="w-12 h-12 rounded-full bg-wood-950/80 border border-gold-500/20 flex items-center justify-center transition-all hover:bg-gold-500/20 hover:scale-110 touch-target"
                  aria-label={isWished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                  <Heart size={20} className={isWished ? "fill-red-500 text-red-500" : "fill-gold-400 text-gold-400"} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full bg-wood-950/80 border border-gold-500/20 flex items-center justify-center transition-all hover:bg-gold-500/20 hover:scale-110 touch-target"
                  aria-label="مشاركة"
                >
                  <Share2 size={20} className="text-gold-400" />
                </button>
              </div>
              {/* Badge */}
              {p.badge && (
                <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold gold-gradient shadow-lg" style={{ boxShadow: "0 0 15px rgba(212,164,76,.3)" }}>
                  {p.badge}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                <p className="font-playfair text-gold-500/60 text-xs sm:text-sm tracking-[0.15em] mb-1">{p.br.toUpperCase()}</p>
                <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-gold-300 mb-1">{p.name}</h1>
                <p className="text-gold-100/50 text-sm sm:text-base mb-2">{p.ar} &middot; {TYPE_AR[p.t]} &middot; {GENDER_AR[p.g]}</p>

                {/* Rating from reviews */}
                {p.rev.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} className={i <= Math.round(p.rev.reduce((a, r) => a + r.r, 0) / p.rev.length) ? "fill-gold-400 text-gold-400" : "fill-wood-800 text-wood-800"} />
                      ))}
                    </div>
                    <span className="text-gold-100/40 text-xs">({p.rev.length} تقييم)</span>
                  </div>
                )}

                <p className="text-gold-100/60 text-sm sm:text-base leading-relaxed mb-6">{p.desc}</p>

                {/* Longevity & Sillage */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <div className="p-3 sm:p-4 rounded-xl gold-border text-center">
                    <p className="text-gold-100/40 text-xs mb-2 flex items-center justify-center gap-1"><Clock size={14} className="text-gold-400" /> الثبات</p>
                    <CircleProgress value={p.lon} />
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl gold-border text-center">
                    <p className="text-gold-100/40 text-xs mb-2 flex items-center justify-center gap-1"><Wind size={14} className="text-gold-400" /> الفوحان</p>
                    <CircleProgress value={p.sil} color="#C4912E" />
                  </div>
                </div>

                {/* Note Pyramid */}
                <div className="mb-6">
                  <p className="font-playfair text-gold-300 font-semibold text-sm sm:text-base mb-3">خريطة النوتات</p>
                  <div className="space-y-2">
                    <NoteRow type="top" label="الافتتاحية" notes={p.tn} />
                    <NoteRow type="mid" label="القلب" notes={p.hn} />
                    <NoteRow type="base" label="القاعدة" notes={p.bn} />
                  </div>
                </div>

                {/* Sizes - NOW WITH WORKING SELECTION */}
                <div className="mb-6">
                  <p className="font-playfair text-gold-300 font-semibold text-sm sm:text-base mb-3">الأحجام والأسعار</p>
                  <div className="flex flex-wrap gap-2">
                    {p.sz.map((s, i) => (
                      <button
                        key={s.s}
                        onClick={() => setSelectedSize(i)}
                        className={`px-4 py-2.5 rounded-lg border text-gold-300 text-sm transition-all hover:bg-gold-500/10 ${selectedSize === i ? "border-gold-500 ring-2 ring-gold-500 bg-gold-500/10" : "border-gold-500/20"}`}
                      >
                        {s.s} - {s.p.toLocaleString()} ج.م
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.occ.map((o) => {
                    const oc = occasions.find((x) => x.id === o);
                    return oc ? (
                      <span key={o} className="px-3 py-1 rounded-full text-xs border border-gold-500/20 text-gold-400/60">{oc.e} {oc.n}</span>
                    ) : null;
                  })}
                  {p.sea.map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs border border-gold-500/20 text-gold-400/60">{SEASON_AR[s]}</span>
                  ))}
                </div>

                {/* Reviews */}
                {p.rev.length > 0 && (
                  <div className="mb-6">
                    <p className="font-playfair text-gold-300 font-semibold text-sm sm:text-base mb-3">آراء العملاء</p>
                    <div className="space-y-3">
                      {p.rev.map((r, i) => (
                        <div key={i} className="p-3 sm:p-4 rounded-xl border border-gold-500/10 bg-wood-950/30">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-gold-300 text-sm font-semibold">{r.n}</span>
                            <span className="text-gold-400 text-xs">{"★".repeat(r.r)}{"☆".repeat(5 - r.r)}</span>
                          </div>
                          <p className="text-gold-100/60 text-xs sm:text-sm">{r.t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Add to Cart - Mobile */}
              <div className="md:hidden sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-2" style={{ background: "linear-gradient(to top, #1A0F0A 60%, transparent)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="font-playfair text-gold-300 font-bold text-lg">{p.sz[selectedSize].p.toLocaleString()} <span className="text-gold-400/50 text-xs font-normal">ج.م</span></p>
                    <p className="text-gold-100/30 text-xs">{p.sz[selectedSize].s}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      addToCart({ id: p.id, name: p.ar, size: p.sz[selectedSize].s, price: p.sz[selectedSize].p, img: p.img });
                      triggerAddToCartEvent({ productImg: p.img, startX: rect.left + rect.width / 2, startY: rect.top + rect.height / 2, productName: p.ar, productSize: p.sz[selectedSize].s, productPrice: p.sz[selectedSize].p });
                    }}
                    className="px-6 py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl flex items-center gap-2 text-sm"
                  >
                    <ShoppingCart size={16} /> أضف للسلة
                  </button>
                </div>
              </div>

              {/* Desktop Add to Cart */}
              <div className="hidden md:block">
                <div className="flex items-center gap-4 p-4 rounded-xl gold-border" style={{ background: "rgba(45,27,17,.3)" }}>
                  <div className="flex-1">
                    <span className="font-playfair text-2xl font-bold text-gold-300">{p.sz[selectedSize].p.toLocaleString()}</span>
                    <span className="text-gold-400/50 text-sm mr-1">ج.م</span>
                    <p className="text-gold-100/30 text-xs mt-0.5">{p.sz[selectedSize].s} - أسعار تبدأ من {p.sz[p.sz.length - 1].p.toLocaleString()} ج.م</p>
                  </div>
                  <button
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      addToCart({ id: p.id, name: p.ar, size: p.sz[selectedSize].s, price: p.sz[selectedSize].p, img: p.img });
                      triggerAddToCartEvent({ productImg: p.img, startX: rect.left + rect.width / 2, startY: rect.top + rect.height / 2, productName: p.ar, productSize: p.sz[selectedSize].s, productPrice: p.sz[selectedSize].p });
                    }}
                    className="px-8 py-3.5 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl flex items-center gap-2 transition-all hover:shadow-[0_4px_20px_rgba(212,164,76,.3)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ShoppingCart size={18} /> أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Products */}
        {sameFamily.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold gold-shimmer mb-2">
              من نفس العائلة - {TYPE_AR[p.t]}
            </h2>
            <div className="orn-div max-w-xs mb-8">
              <span className="text-gold-500">❖</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {sameFamily.map((s) => (
                <div
                  key={s.id}
                  onClick={() => router.push(`/product/${s.id}`)}
                  className="pc rounded-2xl overflow-hidden gold-border cursor-pointer group"
                  style={{ background: "rgba(45,27,17,.6)" }}
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={s.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={s.name} loading="lazy" />
                  </div>
                  <div className="p-3">
                    <p className="font-playfair text-gold-200 font-semibold text-xs sm:text-sm truncate">{s.name}</p>
                    <p className="text-gold-400/60 text-[10px] sm:text-xs truncate">{s.ar}</p>
                    <p className="text-gold-400 text-xs font-bold mt-1">{s.sz[0].p.toLocaleString()} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Contact CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-2xl gold-border p-6 sm:p-8 text-center" style={{ background: "rgba(45,27,17,.4)" }}>
            <p className="font-playfair text-xl sm:text-2xl font-bold text-gold-300 mb-2">محتاج مساعدة في اختيار العطر؟</p>
            <p className="text-gold-100/50 text-sm mb-6">تواصل معانا على الواتساب أو جرب اختبار العطور</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://wa.me/201067278639" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl flex items-center gap-2 text-sm hover:bg-green-500 transition">
                <MessageCircle size={16} /> تواصل واتساب
              </a>
              <button onClick={() => setQuizOpen(true)} className="px-6 py-3 gold-gradient rounded-xl font-bold flex items-center gap-2 text-sm hover:shadow-[0_0_15px_rgba(212,164,76,.3)] transition">
                <Sparkles size={16} /> اكتشف عطرك
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer />
    </div>
  );
}
