"use client";

import { useState, useEffect } from "react";
import { Search, Package, Truck, Clock, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  new: <Clock size={24} className="text-blue-400" />,
  preparing: <Package size={24} className="text-yellow-400" />,
  shipped: <Truck size={24} className="text-purple-400" />,
  delivered: <CheckCircle size={24} className="text-green-400" />,
  cancelled: <AlertCircle size={24} className="text-red-400" />,
};

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  new: { bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400" },
  preparing: { bg: "bg-yellow-500/15", border: "border-yellow-500/30", text: "text-yellow-400" },
  shipped: { bg: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400" },
  delivered: { bg: "bg-green-500/15", border: "border-green-500/30", text: "text-green-400" },
  cancelled: { bg: "bg-red-500/15", border: "border-red-500/30", text: "text-red-400" },
};

const PAYMENT_MAP: Record<string, string> = {
  cash: "كاش عند الاستلام",
  vodafone: "فودافون كاش",
  bank: "تحويل بنكي",
  card: "بطاقة ائتمان",
};

export default function OrderTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState("");
  useScrollLock(isOpen);

  // Open when hash is #track
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#track") {
        setIsOpen(true);
        window.history.replaceState(null, "", window.location.pathname);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const handleTrack = async () => {
    if (!orderId.trim()) return setError("يرجى إدخال رقم الطلب");
    if (!phone.trim() || phone.length < 10) return setError("يرجى إدخال رقم التليفون");
    setError("");
    setLoading(true);
    setOrderData(null);
    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ");
      setOrderData(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "حدث خطأ أثناء تتبع الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleTrack();
  };

  const colorClass = orderData?.status ? (STATUS_COLORS[orderData.status] || STATUS_COLORS.new) : null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.8)", backdropFilter: "blur(5px)" }}>
      <div
        className="rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8"
        style={{ background: "linear-gradient(135deg,#2D1B11,#1A0F0A)", border: "1px solid rgba(212,164,76,.3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-xl font-bold gold-shimmer flex items-center gap-2">
            <Search size={20} /> تتبع طلبك
          </h3>
          <button onClick={() => { setIsOpen(false); setOrderData(null); }} className="text-gold-500/50 hover:text-gold-400 transition">
            <X size={20} />
          </button>
        </div>

        {!orderData ? (
          /* Input Form */
          <div className="space-y-4">
            <p className="text-gold-100/50 text-sm text-center">ادخل رقم الطلب ورقم التليفون عشان تتابع حالة طلبك</p>
            <div>
              <label className="block text-gold-400 text-xs mb-1">رقم الطلب</label>
              <input
                type="number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="مثال: 5"
                className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition text-sm"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-gold-400 text-xs mb-1">رقم التليفون</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="01012345678"
                className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition text-sm"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg text-xs bg-red-900/30 text-red-400 border border-red-500/20">{error}</div>
            )}

            <button
              onClick={handleTrack}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(212,164,76,.3)]"
              style={{ background: "linear-gradient(135deg,#D4A44C,#A07020)", color: "#1A0F0A" }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> جاري البحث...</> : <><Search size={16} /> تتبع</>}
            </button>
          </div>
        ) : (
          /* Order Result */
          <div className="space-y-4">
            {/* Status Badge */}
            <div className={`text-center p-4 rounded-xl border ${colorClass?.bg} ${colorClass?.border}`}>
              {STATUS_ICONS[orderData.status] || STATUS_ICONS.new}
              <p className={`font-playfair text-xl font-bold mt-2 ${colorClass?.text}`}>{orderData.statusLabel}</p>
              <p className="text-gold-100/40 text-sm mt-1">{orderData.statusDescription}</p>
            </div>

            {/* Order Info */}
            <div className="rounded-xl border border-gold-500/15 p-4" style={{ background: "rgba(45,27,17,.5)" }}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gold-100/40">رقم الطلب</span>
                  <p className="text-gold-400 font-bold text-sm">#{orderData.id}</p>
                </div>
                <div>
                  <span className="text-gold-100/40">الاسم</span>
                  <p className="text-gold-300 font-semibold">{orderData.name}</p>
                </div>
                <div>
                  <span className="text-gold-100/40">طريقة الدفع</span>
                  <p className="text-gold-300">{PAYMENT_MAP[orderData.payment] || orderData.payment}</p>
                </div>
                <div>
                  <span className="text-gold-100/40">التاريخ</span>
                  <p className="text-gold-300">{new Date(orderData.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              {orderData.address && (
                <div className="mt-3 pt-3 border-t border-gold-500/10">
                  <span className="text-gold-100/40 text-xs">📍 العنوان: </span>
                  <span className="text-gold-300 text-xs">{orderData.address}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-xl border border-gold-500/15 p-4" style={{ background: "rgba(45,27,17,.5)" }}>
              <p className="text-gold-400 text-xs font-semibold mb-3">المنتجات</p>
              <div className="space-y-1.5">
                {orderData.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gold-100/60">{it.name} ({it.size}) x{it.qty}</span>
                    <span className="text-gold-300">{(it.price * it.qty).toLocaleString()} ج.م</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gold-500/10 pt-2 mt-2 space-y-1">
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">الخصم</span>
                    <span className="text-green-400">-{orderData.discount.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm">
                  <span className="text-gold-400">الإجمالي</span>
                  <span className="text-gold-400">{orderData.total.toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            {/* Track another */}
            <button
              onClick={() => { setOrderData(null); setOrderId(""); setPhone(""); }}
              className="w-full py-2.5 rounded-xl border border-gold-500/20 text-gold-400 text-sm hover:bg-gold-500/10 transition"
            >
              تتبع طلب تاني
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
