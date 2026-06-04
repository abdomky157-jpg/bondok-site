"use client";

import { useState } from "react";
import { X, ShoppingBag, Tag, Trash2, Plus, Minus } from "lucide-react";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";

export default function CartDrawer() {
  const cartOpen = useBondokStore((s) => s.cartOpen);
  const setCartOpen = useBondokStore((s) => s.setCartOpen);
  const setCheckoutOpen = useBondokStore((s) => s.setCheckoutOpen);
  const cart = useBondokStore((s) => s.cart);
  const removeFromCart = useBondokStore((s) => s.removeFromCart);
  const updateQuantity = useBondokStore((s) => s.updateQuantity);
  const clearCart = useBondokStore((s) => s.clearCart);
  const discountPct = useBondokStore((s) => s.discountPct);
  const applyDiscount = useBondokStore((s) => s.applyDiscount);
  const getCartSubtotal = useBondokStore((s) => s.getCartSubtotal);
  const getCartDiscount = useBondokStore((s) => s.getCartDiscount);
  const getCartTotal = useBondokStore((s) => s.getCartTotal);

  const [discCode, setDiscCode] = useState("");
  const [discMsg, setDiscMsg] = useState("");

  // Scroll lock when cart drawer is open
  useScrollLock(cartOpen);

  const handleApply = () => {
    if (applyDiscount(discCode)) {
      setDiscMsg("✅ تم تطبيق الخصم بنجاح!");
    } else {
      setDiscMsg("❌ كود الخصم غير صالح");
    }
  };

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  const handleConfirm = () => {
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 300);
  };

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[10000] opacity-100 pointer-events-auto"
          tabIndex={-1}
          onClick={() => setCartOpen(false)}
          onKeyDown={(e) => { if (e.key === "Escape") { setCartOpen(false); } }}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[380px] max-w-[90vw] z-[10001] transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-y-auto ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "linear-gradient(180deg,#2D1B11,#1A0F0A)", borderLeft: "1px solid rgba(212,164,76,.3)" }}
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-playfair text-xl font-bold text-gold-400">
              <ShoppingBag size={20} className="inline ml-2" /> السلة
            </h3>
            <button onClick={() => setCartOpen(false)} className="text-gold-500/70 hover:text-gold-400 transition touch-target">
              <X size={24} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="text-gold-500/20 mx-auto mb-4" />
              <p className="text-subtle">السلة فارغة</p>
              <a href="#prod" onClick={() => setCartOpen(false)} className="mt-4 inline-block px-6 py-2 rounded-full border border-gold-500/20 text-gold-400 text-sm hover:bg-gold-500/10 transition">
                تصفح المنتجات
              </a>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((c, i) => (
                  <div key={`${c.id}-${c.size}-${i}`} className="flex items-center gap-3 p-3 rounded-xl border border-gold-500/10 bg-wood-950/30">
                    <img src={c.img} className="w-12 h-12 rounded-lg object-cover" alt={c.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-playfair text-gold-300 text-sm font-semibold truncate">{c.name}</p>
                      <p className="text-gold-100/40 text-xs">{c.size} · {c.price.toLocaleString()} ج.م</p>
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => updateQuantity(i, c.qty - 1)}
                          className="w-8 h-8 rounded-md border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 transition text-xs"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-gold-300 text-sm font-bold min-w-[20px] text-center">{c.qty}</span>
                        <button
                          onClick={() => updateQuantity(i, c.qty + 1)}
                          className="w-8 h-8 rounded-md border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500/10 transition text-xs"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-gold-400 text-sm font-bold">{(c.price * c.qty).toLocaleString()} ج.م</span>
                      <button onClick={() => removeFromCart(i)} className="text-gold-500/60 hover:text-red-400 transition touch-target">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="border-t border-gold-500/10 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="كود الخصم"
                    value={discCode}
                    onChange={(e) => setDiscCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50"
                  />
                  <button onClick={handleApply} className="px-4 py-2 rounded-lg bg-gold-500/20 text-gold-400 text-sm font-bold hover:bg-gold-500/30 transition">
                    <Tag size={14} className="inline ml-1" /> تطبيق
                  </button>
                </div>
                {discMsg && (
                  <p className={`mb-3 p-2 rounded-lg text-xs ${discMsg.startsWith("✅") ? "bg-green-900/30 text-green-400 border border-green-500/20" : "bg-red-900/30 text-red-400 border border-red-500/20"}`}>
                    {discMsg}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-subtle">المجموع</span>
                    <span className="text-gold-300">{subtotal.toLocaleString()} ج.م</span>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">الخصم ({discountPct}%)</span>
                      <span className="text-green-400">-{discount.toLocaleString()} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t border-gold-500/10 pt-2">
                    <span className="text-gold-400">الإجمالي</span>
                    <span className="text-gold-400">{total.toLocaleString()} ج.م</span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,164,76,.3)] transition-all"
                >
                  تأكيد الطلب
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
