"use client";

import { useState } from "react";
import { X, ShoppingBag, Loader2, MapPin, User, Phone, FileText, CreditCard, Banknote, Smartphone, Building2 } from "lucide-react";
import { useBondokStore } from "@/store/bondok";
import { useSiteData } from "@/context/SiteContext";
import { useScrollLock } from "@/hooks/useScrollLock";

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الشرقية",
  "الدقهلية",
  "البحيرة",
  "المنيا",
  "الغربية",
  "المنوفية",
  "القليوبية",
  "سوهاج",
  "أسيوط",
  "الفيوم",
  "بني سويف",
  "قنا",
  "الأقصر",
  "أسوان",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "كفر الشيخ",
  "مطروح",
  "البحر الأحمر",
  "الوادي الجديد",
  "شمال سيناء",
  "جنوب سيناء",
];

const PAYMENT_OPTIONS = [
  { id: "cash", label: "كاش عند الاستلام", icon: Banknote },
  { id: "vodafone", label: "فودافون كاش", icon: Smartphone },
  { id: "bank", label: "تحويل بنكي", icon: Building2 },
  { id: "card", label: "بطاقة ائتمان", icon: CreditCard },
];

export default function CheckoutModal() {
  const checkoutOpen = useBondokStore((s) => s.checkoutOpen);
  const setCheckoutOpen = useBondokStore((s) => s.setCheckoutOpen);
  const setCartOpen = useBondokStore((s) => s.setCartOpen);
  const cart = useBondokStore((s) => s.cart);
  const discountPct = useBondokStore((s) => s.discountPct);
  const discountCode = useBondokStore((s) => s.discountCode);
  const clearCart = useBondokStore((s) => s.clearCart);
  const getCartSubtotal = useBondokStore((s) => s.getCartSubtotal);
  const getCartDiscount = useBondokStore((s) => s.getCartDiscount);
  const getCartTotal = useBondokStore((s) => s.getCartTotal);
  const { getSetting } = useSiteData();

  // Scroll lock when checkout modal is open
  useScrollLock(checkoutOpen);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("cash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  if (!checkoutOpen) return null;

  const handleClose = () => {
    setCheckoutOpen(false);
  };

  const buildWhatsAppMessage = (orderId?: number) => {
    const orderRef = orderId ? `#${orderId}` : "";
    const paymentLabel = PAYMENT_OPTIONS.find((p) => p.id === payment)?.label || payment;
    const itemsList = cart
      .map((item) => `🧴 ${item.name} (${item.size}) x${item.qty} - ${(item.price * item.qty).toLocaleString()} ج.م`)
      .join("\n");

    let msg = `🛍️ طلب جديد من Bondok Perfumes ${orderRef}\n`;
    msg += `👤 الاسم: ${name}\n`;
    msg += `📱 التليفون: ${phone}\n`;
    msg += `📍 العنوان: ${governorate}, ${address}\n`;
    msg += `---\n`;
    msg += `${itemsList}\n`;
    msg += `---\n`;
    msg += `💰 المجموع: ${subtotal.toLocaleString()} ج.م\n`;
    if (discount > 0) {
      msg += `💵 الخصم: -${discount.toLocaleString()} ج.م\n`;
    }
    msg += `📊 الإجمالي: ${total.toLocaleString()} ج.م\n`;
    msg += `💳 الدفع: ${paymentLabel}\n`;
    if (notes) {
      msg += `📝 ملاحظات: ${notes}\n`;
    }
    msg += `\n---\n`;
    msg += `🔗 تتبع طلبك: ${window.location.origin}#track`;

    return msg;
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) return setError("يرجى إدخال الاسم");
    if (!phone.trim() || phone.length < 10) return setError("يرجى إدخال رقم تليفون صحيح");
    if (!governorate) return setError("يرجى اختيار المحافظة");
    if (!address.trim()) return setError("يرجى إدخال العنوان");
    setError("");

    setSubmitting(true);

    try {
      // Build order items from cart (already has qty)
      const orderItems = cart.map((item) => ({
        name: item.name,
        size: item.size,
        price: item.price,
        qty: item.qty,
      }));

      // Save order to database (server calculates prices from items)
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: `${governorate}, ${address.trim()}`,
          notes: notes.trim(),
          items: orderItems,
          discountCode: discountPct > 0 ? discountCode : null,
          payment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل في حفظ الطلب");

      const orderId = data.id;

      // Build WhatsApp message and open
      const whatsappNumber = getSetting("contactWhatsapp", "+201067278639").replace(/[^0-9+]/g, "");
      const msg = buildWhatsAppMessage(orderId);
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");

      // Clear cart and show success with order ID
      clearCart();
      setSuccessOrderId(orderId);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "حدث خطأ أثناء تقديم الطلب");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10002] flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80"
        tabIndex={-1}
        onClick={handleClose}
        onKeyDown={(e) => { if (e.key === "Escape") { handleClose(); } }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg mx-4 my-8 rounded-2xl border border-gold-500/30 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1A0F0A, #2D1B11)" }}
        role="dialog"
        aria-modal="true"
        aria-label="إتمام الطلب"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold-500/20">
          <h3 className="font-playfair text-xl font-bold gold-shimmer flex items-center gap-2">
            <ShoppingBag size={20} /> إتمام الطلب
          </h3>
          <button onClick={handleClose} className="text-gold-500/70 hover:text-gold-400 transition touch-target">
            <X size={24} />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="font-playfair text-2xl font-bold text-gold-400 mb-3">تم تقديم طلبك بنجاح!</h3>
            {successOrderId && (
              <div className="mb-4 p-3 rounded-xl border border-gold-500/20" style={{ background: "rgba(45,27,17,.5)" }}>
                <p className="text-subtle text-xs mb-1">رقم الطلب</p>
                <p className="font-playfair text-2xl font-bold text-gold-400">#{successOrderId}</p>
                <p className="text-gold-100/30 text-xs mt-2">احتفظ بالرقم ده عشان تتبع طلبك</p>
              </div>
            )}
            <p className="text-subtle-light mb-6">هنتواصل معاك على الواتساب لتأكيد الطلب</p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl font-bold text-sm gold-gradient"
            >
              حسناً
            </button>
          </div>
        ) : (
          /* Form */
          <div className="p-5 space-y-4">
            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                  <User size={12} /> الاسم
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أحمد محمد"
                  className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                  <Phone size={12} /> التليفون
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Governorate + Address */}
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                <MapPin size={12} /> المحافظة
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  اختر المحافظة
                </option>
                {GOVERNORATES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                <MapPin size={12} /> العنوان بالتفصيل
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="المعادي، شارع 9، عمارة 15"
                className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-2">
                <CreditCard size={12} /> طريقة الدفع
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = payment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayment(opt.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition ${
                        isActive
                          ? "border-gold-500/60 bg-gold-500/15 text-gold-400"
                          : "border-gold-500/15 bg-wood-950/30 text-subtle hover:border-gold-500/30"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                <FileText size={12} /> ملاحظات (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="ملاحظات إضافية..."
                className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50 resize-none"
              />
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border border-gold-500/15 p-4" style={{ background: "rgba(45,27,17,.5)" }}>
              <h4 className="font-playfair text-gold-400 text-sm font-semibold mb-3">ملخص الطلب</h4>

              {/* Items */}
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-subtle-light">
                        {item.name} ({item.size}) {item.qty > 1 && `x${item.qty}`}
                      </span>
                      <span className="text-gold-300">{(item.price * item.qty).toLocaleString()} ج.م</span>
                    </div>
                  ))}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 border-t border-gold-500/10 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-subtle">المجموع</span>
                  <span className="text-gold-300">{subtotal.toLocaleString()} ج.م</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">الخصم ({discountPct}%)</span>
                    <span className="text-green-400">-{discount.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-gold-500/10 pt-1.5">
                  <span className="text-gold-400">الإجمالي</span>
                  <span className="text-gold-400">{total.toLocaleString()} ج.م</span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg text-xs bg-red-900/30 text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(212,164,76,.3)] gold-gradient"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  جاري التقديم...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  تأكيد الطلب عبر واتساب
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
