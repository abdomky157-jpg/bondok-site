"use client";

import { useState, useEffect, useRef } from "react";
import { X, ShoppingCart, RefreshCw, Star } from "lucide-react";
import { products, TYPE_AR } from "@/data/products";
import { SURPRISE_REASONS } from "@/data/quiz";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";

export default function SurpriseModal() {
  const surpriseOpen = useBondokStore((s) => s.surpriseOpen);
  const setSurpriseOpen = useBondokStore((s) => s.setSurpriseOpen);
  const addToCart = useBondokStore((s) => s.addToCart);
  const applyDiscount = useBondokStore((s) => s.applyDiscount);
  useScrollLock(surpriseOpen);

  const getRandomProduct = () => {
    const idx = Math.floor(Math.random() * products.length);
    return products[idx];
  };

  const [product, setProduct] = useState(getRandomProduct);
  const [key, setKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const type = product.t;
  const reasons = SURPRISE_REASONS[type] || SURPRISE_REASONS.woody;
  const reason = reasons[Math.floor(Math.random() * reasons.length)];

  // Calculate the discounted price (20% off)
  const originalPrice = product.sz[0].p;
  const discountedPrice = Math.round(originalPrice * 0.8);

  // Real countdown timer
  useEffect(() => {
    if (!surpriseOpen) {
      setTimeLeft(3600);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [surpriseOpen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = (timeLeft / 3600) * 100;

  const refresh = () => {
    setProduct(getRandomProduct());
    setKey((k) => k + 1);
  };

  const handleAdd = () => {
    if (timeLeft <= 0) return;
    // Add to cart at discounted price
    addToCart({
      id: product.id,
      name: product.ar,
      size: product.sz[0].s,
      price: discountedPrice,
      img: product.img,
    });
    // Auto-apply 20% discount code for the rest of the cart
    applyDiscount("SURPRISE20");
    setSurpriseOpen(false);
  };

  if (!surpriseOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.8)", backdropFilter: "blur(5px)" }}
      tabIndex={-1}
      onClick={() => setSurpriseOpen(false)}
      onKeyDown={(e) => { if (e.key === "Escape") { setSurpriseOpen(false); } }}
    >
      <div
        key={key}
        className="rounded-2xl max-w-[550px] w-full p-8 text-center"
        style={{
          background: "linear-gradient(135deg,#2D1B11,#1A0F0A)",
          border: "1px solid rgba(212,164,76,.3)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="فاجئني"
      >
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(212,164,76,.2),rgba(160,112,32,.2))" }}>
          <Star size={32} className="text-gold-400" />
        </div>
        <h3 className="font-playfair text-2xl font-bold gold-shimmer mb-2">عطرك الليلة:</h3>
        <img src={product.img} className="w-32 h-32 object-cover rounded-2xl mx-auto my-4 gold-border" alt={product.name} />
        <h4 className="font-playfair text-2xl font-bold text-gold-300 mb-1">{product.name}</h4>
        <p className="text-gold-100/50 text-sm mb-4">{product.ar} · {TYPE_AR[product.t]}</p>

        <div className="p-4 rounded-xl gold-border mb-4 text-right">
          <p className="text-gold-200 text-sm">💡 {reason}</p>
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ background: "linear-gradient(135deg,rgba(212,164,76,.1),rgba(160,112,32,.05))", border: "1px dashed rgba(212,164,76,.3)" }}>
          <p className="font-playfair text-gold-400 font-bold text-lg mb-1">🔥 خصم 20% لو طلبت خلال ساعة!</p>
          {/* Show original and discounted price */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-gold-100/40 line-through text-sm">{originalPrice.toLocaleString()} ج.م</span>
            <span className="text-green-400 font-bold text-lg">{discountedPrice.toLocaleString()} ج.م</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className={`font-mono text-sm font-bold ${timeLeft > 300 ? "text-gold-300" : timeLeft > 60 ? "text-yellow-400" : "text-red-400"}`}>
              ⏱️ {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gold-500/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-gold-500 to-gold-700 transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-gold-100/40 text-xs mt-1">
            {timeLeft > 0 ? `العرض ينتهي بعد ${formatTime(timeLeft)}` : "انتهى وقت العرض!"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAdd}
            disabled={timeLeft <= 0}
            className={`flex-1 py-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${timeLeft > 0 ? "bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 hover:scale-[1.02]" : "bg-gold-500/20 text-gold-400/50 cursor-not-allowed"}`}
          >
            <ShoppingCart size={16} /> {timeLeft > 0 ? "اطلب بخصم 20% 🎁" : "انتهى العرض"}
          </button>
          <button
            onClick={refresh}
            className="px-4 py-3 rounded-xl border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
