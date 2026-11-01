"use client";

import { useState } from "react";
import { X, ShoppingBag, Loader2, MapPin, User, Phone, FileText, Banknote, CreditCard, MessageCircle, CheckCircle2 } from "lucide-react";
import { useBondokStore } from "@/store/bondok";
import { useScrollLock } from "@/hooks/useScrollLock";

const GOVERNORATES = [
  "الإسكندرية",
  "القاهرة",
  "الجيزة",
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
  { id: "vodafone", label: "فودافون كاش", icon: Phone },
  { id: "instapay", label: "إنستاباي / تحويل بنكي", icon: CreditCard },
];

export default function CheckoutModal() {
  const checkoutOpen = useBondokStore((s) => s.checkoutOpen);
  const setCheckoutOpen = useBondokStore((s) => s.setCheckoutOpen);
  const cart = useBondokStore((s) => s.cart);
  const discountPct = useBondokStore((s) => s.discountPct);
  const discountCode = useBondokStore((s) => s.discountCode);
  const clearCart = useBondokStore((s) => s.clearCart);
  const getCartSubtotal = useBondokStore((s) => s.getCartSubtotal);
  const getCartDiscount = useBondokStore((s) => s.getCartDiscount);
  const getCartTotal = useBondokStore((s) => s.getCartTotal);

  // Scroll lock when checkout modal is open
  useScrollLock(checkoutOpen);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("الإسكندرية");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("cash");
  const [targetWhatsApp, setTargetWhatsApp] = useState("201067278639");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<number | string | null>(null);
  const [savedOrderDetails, setSavedOrderDetails] = useState<{
    name: string;
    phone: string;
    address: string;
    total: number;
    msg: string;
  } | null>(null);

  const subtotal = getCartSubtotal();
  const discount = getCartDiscount();
  const total = getCartTotal();

  if (!checkoutOpen) return null;

  const handleClose = () => {
    setCheckoutOpen(false);
    if (success) {
      setSuccess(false);
      setSuccessOrderId(null);
      setSavedOrderDetails(null);
    }
  };

  const buildWhatsAppMessage = (orderRef: string | number) => {
    const paymentLabel = PAYMENT_OPTIONS.find((p) => p.id === payment)?.label || payment;
    const itemsList = cart
      .map((item) => `🧴 ${item.name} (${item.size}) x${item.qty} - ${(item.price * item.qty).toLocaleString()} ج.م`)
      .join("\n");

    let msg = `🛍️ طلب جديد من متجر Bondok Perfumes #${orderRef}\n\n`;
    msg += `👤 الاسم: ${name.trim()}\n`;
    msg += `📱 التليفون: ${phone.trim()}\n`;
    msg += `📍 العنوان: ${governorate} - ${address.trim()}\n`;
    msg += `💳 طريقة الدفع: ${paymentLabel}\n`;
    if (notes.trim()) {
      msg += `📝 ملاحظات: ${notes.trim()}\n`;
    }
    msg += `\n📦 تفاصيل المنتجات:\n`;
    msg += `${itemsList}\n\n`;
    msg += `💰 المجموع: ${subtotal.toLocaleString()} ج.م\n`;
    if (discount > 0) {
      msg += `💵 الخصم: -${discount.toLocaleString()} ج.م\n`;
    }
    msg += `📊 الإجمالي المطلوب: ${total.toLocaleString()} ج.م\n`;
    msg += `\n---\n`;
    msg += `📅 تاريخ الطلب: ${new Date().toLocaleDateString("ar-EG")}`;

    return msg;
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) return setError("يرجى إدخال الاسم بالكامل");
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 10) {
      return setError("يرجى إدخال رقم تليفون صحيح (11 رقم)");
    }
    if (!governorate) return setError("يرجى اختيار المحافظة");
    if (!address.trim()) return setError("يرجى إدخال العنوان بالتفصيل");
    setError("");

    setSubmitting(true);

    try {
      // Build order items from cart
      const orderItems = cart.map((item) => ({
        id: String(item.id),
        name: item.name,
        size: item.size,
        price: item.price,
        qty: item.qty,
      }));

      const fullAddress = `${governorate} - ${address.trim()}`;
      let finalOrderId: string | number = `BNDK-${Date.now().toString().slice(-4)}`;

      // Save order to database via API
      try {
        const res = await fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            address: fullAddress,
            notes: notes.trim(),
            items: orderItems,
            discountCode: discountPct > 0 ? discountCode : null,
            payment,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.id) {
            finalOrderId = data.id;
          }
        }
      } catch (apiErr) {
        console.warn("Order saved locally with fallback reference:", apiErr);
      }

      // Build WhatsApp message
      const msg = buildWhatsAppMessage(finalOrderId);

      // Save details for success screen
      setSavedOrderDetails({
        name: name.trim(),
        phone: phone.trim(),
        address: fullAddress,
        total: total,
        msg: msg,
      });

      setSuccessOrderId(finalOrderId);
      setSuccess(true);
      clearCart();

      // Open WhatsApp automatically
      const waUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "حدث خطأ أثناء تقديم الطلب");
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
        className="relative w-full max-w-lg mx-4 my-4 sm:my-8 rounded-2xl border border-gold-500/30 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1A0F0A, #2D1B11)" }}
        role="dialog"
        aria-modal="true"
        aria-label="إتمام الطلب"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gold-500/20">
          <h3 className="font-playfair text-xl font-bold gold-shimmer flex items-center gap-2">
            <ShoppingBag size={20} /> إتمام وتأكيد الطلب
          </h3>
          <button onClick={handleClose} className="text-gold-500/70 hover:text-gold-400 transition touch-target">
            <X size={24} />
          </button>
        </div>

        {success && savedOrderDetails ? (
          /* Success State with Direct WhatsApp Buttons */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-400">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="font-playfair text-2xl font-bold text-gold-400 mb-1">تم تسجيل طلبك بنجاح!</h3>
              <p className="text-gold-100/60 text-xs">تم حفظ الطلب في النظام وتجهيز رسالة التأكيد</p>
            </div>

            {/* Order Info Card */}
            <div className="p-4 rounded-xl border border-gold-500/20 bg-wood-950/50 text-right space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-gold-500/10">
                <span className="text-gold-400 font-bold font-playfair text-base">#{successOrderId}</span>
                <span className="text-gold-100/50">رقم الطلب</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-200 font-medium">{savedOrderDetails.name}</span>
                <span className="text-gold-100/50">الاسم:</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-200 font-mono" dir="ltr">{savedOrderDetails.phone}</span>
                <span className="text-gold-100/50">الهاتف:</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gold-200 text-left max-w-[200px] truncate">{savedOrderDetails.address}</span>
                <span className="text-gold-100/50">العنوان:</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-gold-500/10 font-bold text-sm">
                <span className="text-gold-400">{savedOrderDetails.total.toLocaleString()} ج.م</span>
                <span className="text-gold-300">الإجمالي:</span>
              </div>
            </div>

            {/* Action Prompt */}
            <div className="pt-2">
              <p className="text-sm font-semibold text-gold-300 mb-3">
                اضغط على الزر لإرسال تفاصيل الفاتورة لتأكيد الشحن فوراً:
              </p>
              
              <div className="flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/201067278639?text=${encodeURIComponent(savedOrderDetails.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle size={20} />
                  <span>إرسال الطلب لواتساب 1 (01067278639)</span>
                </a>

                <a
                  href={`https://wa.me/201010733294?text=${encodeURIComponent(savedOrderDetails.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-green-700/80 hover:bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 border border-green-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle size={20} />
                  <span>إرسال الطلب لواتساب 2 (01010733294)</span>
                </a>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-3 text-gold-400/60 hover:text-gold-300 text-xs underline transition"
            >
              إغلاق ومتابعة التسوق
            </button>
          </div>
        ) : (
          /* Order Form */
          <div className="p-4 sm:p-5 space-y-4">
            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                  <User size={12} /> الاسم بالكامل
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                  <Phone size={12} /> رقم الهاتف (واتساب)
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                  <MapPin size={12} /> المحافظة
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm focus:outline-none focus:border-gold-500/50 appearance-none cursor-pointer"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g} className="bg-wood-950 text-gold-100">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                  <MapPin size={12} /> العنوان بالتفصيل (الشارع - رقم العمارة - الشقة)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: الهانوفيل - شارع فتح الله - عمارة 4"
                  className="w-full px-3 py-2.5 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-2">
                <CreditCard size={12} /> طريقة الدفع
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = payment === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPayment(opt.id)}
                      className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs transition ${
                        isActive
                          ? "border-gold-500/60 bg-gold-500/15 text-gold-300 font-semibold"
                          : "border-gold-500/15 bg-wood-950/30 text-gold-100/50 hover:border-gold-500/30"
                      }`}
                    >
                      <Icon size={14} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target WhatsApp Selection */}
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-1.5">
                <MessageCircle size={12} /> إرسال الطلب إلى رقم واتساب:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetWhatsApp("201067278639")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition text-center ${
                    targetWhatsApp === "201067278639"
                      ? "border-green-500 bg-green-500/20 text-green-300"
                      : "border-gold-500/20 text-gold-100/60 hover:border-gold-500/40"
                  }`}
                >
                  واتساب 1 (01067278639)
                </button>
                <button
                  type="button"
                  onClick={() => setTargetWhatsApp("201010733294")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition text-center ${
                    targetWhatsApp === "201010733294"
                      ? "border-green-500 bg-green-500/20 text-green-300"
                      : "border-gold-500/20 text-gold-100/60 hover:border-gold-500/40"
                  }`}
                >
                  واتساب 2 (01010733294)
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-1 text-gold-400 text-xs mb-1">
                <FileText size={12} /> ملاحظات أو مواعيد استلام محددة (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="أي تعليمات إضافية للمندوب..."
                className="w-full px-3 py-2 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 text-sm placeholder:text-gold-100/30 focus:outline-none focus:border-gold-500/50 resize-none"
              />
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border border-gold-500/15 p-4 bg-wood-950/50">
              <h4 className="font-playfair text-gold-400 text-xs font-semibold mb-2.5">المنتجات في السلة ({cart.length})</h4>

              <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gold-100/70">
                      {item.name} ({item.size}) {item.qty > 1 && `× ${item.qty}`}
                    </span>
                    <span className="text-gold-300 font-mono">{(item.price * item.qty).toLocaleString()} ج.م</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 border-t border-gold-500/10 pt-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gold-100/40">المجموع الفرعي</span>
                  <span className="text-gold-300 font-mono">{subtotal.toLocaleString()} ج.م</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>الخصم ({discountPct}%)</span>
                    <span className="font-mono">-{discount.toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm border-t border-gold-500/10 pt-1.5">
                  <span className="text-gold-400">الإجمالي النهائي</span>
                  <span className="text-gold-400 font-mono">{total.toLocaleString()} ج.م</span>
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
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(212,164,76,.3)] gold-gradient active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  جاري تسجيل الطلب وفتح الواتساب...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  تأكيد الطلب وإرسال الفاتورة (واتساب)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
