"use client";

import { useState } from "react";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { Truck, Shield, RefreshCw, MessageCircle, X } from "lucide-react";

export default function Footer() {
  const { settings } = useSiteData();
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);
  const setSpinOpen = useBondokStore((s) => s.setSpinOpen);
  const setSurpriseOpen = useBondokStore((s) => s.setSurpriseOpen);
  const whatsappNumber = (settings.contactWhatsapp || "+201010733294").replace(/[^0-9+]/g, "");

  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative py-12 wood-bg border-t border-gold-500/10">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="text-center p-4 rounded-xl border border-gold-500/15" style={{ background: "rgba(45,27,17,.3)" }}>
            <Truck size={24} className="text-gold-400 mx-auto mb-2" />
            <p className="text-gold-300 text-xs font-semibold">توصيل لجميع المحافظات</p>
            <p className="text-gold-100/30 text-[10px] mt-1">في خلال 2-5 أيام عمل</p>
          </div>
          <div className="text-center p-4 rounded-xl border border-gold-500/15" style={{ background: "rgba(45,27,17,.3)" }}>
            <Shield size={24} className="text-gold-400 mx-auto mb-2" />
            <p className="text-gold-300 text-xs font-semibold">منتجات أصلية 100%</p>
            <p className="text-gold-100/30 text-[10px] mt-1">ضمان على كل المنتجات</p>
          </div>
          <div className="text-center p-4 rounded-xl border border-gold-500/15" style={{ background: "rgba(45,27,17,.3)" }}>
            <RefreshCw size={24} className="text-gold-400 mx-auto mb-2" />
            <button onClick={() => setShowReturnPolicy(true)} className="text-gold-300 text-xs font-semibold hover:text-gold-200 transition">
              سياسة الإرجاع
            </button>
            <p className="text-gold-100/30 text-[10px] mt-1">إرجاع خلال 3 أيام</p>
          </div>
          <div className="text-center p-4 rounded-xl border border-gold-500/15" style={{ background: "rgba(45,27,17,.3)" }}>
            <MessageCircle size={24} className="text-green-400 mx-auto mb-2" />
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-gold-300 text-xs font-semibold hover:text-gold-200 transition">
              تواصل عبر واتساب
            </a>
            <p className="text-gold-100/30 text-[10px] mt-1">24/7 خدمة عملاء</p>
          </div>
        </div>

        {/* Quick Links + Interactive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {/* Navigation */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-3">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection("prod")} className="text-gold-100/40 text-xs hover:text-gold-300 transition">المنتجات</button></li>
              <li><button onClick={() => scrollToSection("bun")} className="text-gold-100/40 text-xs hover:text-gold-300 transition">الباقات</button></li>
              <li><button onClick={() => scrollToSection("t10")} className="text-gold-100/40 text-xs hover:text-gold-300 transition">Top 10</button></li>
              <li><button onClick={() => scrollToSection("about")} className="text-gold-100/40 text-xs hover:text-gold-300 transition">من نحن</button></li>
              <li><button onClick={() => scrollToSection("cont")} className="text-gold-100/40 text-xs hover:text-gold-300 transition">تواصل معنا</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-3">الخدمات</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setQuizOpen(true)} className="text-gold-100/40 text-xs hover:text-gold-300 transition">اكتشف عطرك</button></li>
              <li><button onClick={() => setSpinOpen(true)} className="text-gold-100/40 text-xs hover:text-gold-300 transition">عجلة الحظ</button></li>
              <li><button onClick={() => setSurpriseOpen(true)} className="text-gold-100/40 text-xs hover:text-gold-300 transition">فاجئني</button></li>
              <li><button onClick={() => { window.location.hash = "#track"; window.dispatchEvent(new HashChangeEvent("hashchange")); }} className="text-gold-100/40 text-xs hover:text-gold-300 transition">تتبع طلبك</button></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-3">معلومات</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setShowReturnPolicy(true)} className="text-gold-100/40 text-xs hover:text-gold-300 transition">سياسة الإرجاع</button></li>
              <li><button onClick={() => setShowTerms(true)} className="text-gold-100/40 text-xs hover:text-gold-300 transition">شروط الاستخدام</button></li>
              <li><button onClick={() => scrollToSection("cont")} className="text-gold-100/40 text-xs hover:text-gold-300 transition">تواصل معنا</button></li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-3">طرق الدفع</h4>
            <ul className="space-y-2">
              <li className="text-gold-100/40 text-xs">💵 كاش عند الاستلام</li>
              <li className="text-gold-100/40 text-xs">📱 فودافون كاش</li>
              <li className="text-gold-100/40 text-xs">🏦 تحويل بنكي</li>
              <li className="text-gold-100/40 text-xs">💳 بطاقة ائتمان</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold-500/10 pt-6 text-center">
          <p className="text-gold-100/20 text-xs">{settings.footerText || "© 2025 Bondok Perfumes. جميع الحقوق محفوظة"}</p>
        </div>
      </div>

      {/* Return Policy Modal */}
      {showReturnPolicy && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.8)" }} onClick={() => setShowReturnPolicy(false)}>
          <div className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8" style={{ background: "linear-gradient(135deg,#2D1B11,#1A0F0A)", border: "1px solid rgba(212,164,76,.3)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-xl font-bold gold-shimmer">🔄 سياسة الإرجاع</h3>
              <button onClick={() => setShowReturnPolicy(false)} className="text-gold-500/50 hover:text-gold-400"><X size={20} /></button>
            </div>
            <div className="space-y-4 text-gold-100/70 text-sm leading-relaxed">
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">شروط الإرجاع:</h4>
                <ul className="list-disc list-inside space-y-1 text-gold-100/50">
                  <li>يمكنك إرجاع المنتج خلال 3 أيام من استلامه</li>
                  <li>يجب أن يكون المنتج في حالته الأصلية دون فتح العلبة</li>
                  <li>المنتج لازم يكون نفس المنتج اللي اتباع وبنفس الكمية</li>
                  <li>الإرجاع مش متاح للمنتجات اللي كانت في عروض أو خصومات</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">خطوات الإرجاع:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gold-100/50">
                  <li>تواصل معانا على الواتساب ورقم الطلب</li>
                  <li>هنبعتلك عنوان إرجاع المنتج</li>
                  <li>لما نوصل المنتج، هنراجع حالته</li>
                  <li>لو كل حاجة تمام، هيتم استرداد المبلغ خلال 3-5 أيام عمل</li>
                </ol>
              </div>
              <div className="p-3 rounded-xl border border-gold-500/15" style={{ background: "rgba(45,27,17,.5)" }}>
                <p className="text-gold-400 text-xs">لاستفسارات الإرجاع:</p>
                <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("عايز أرجع طلب")}`} target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm font-semibold hover:text-green-300 transition mt-1 inline-block">
                  تواصل معانا على الواتساب
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.8)" }} onClick={() => setShowTerms(false)}>
          <div className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8" style={{ background: "linear-gradient(135deg,#2D1B11,#1A0F0A)", border: "1px solid rgba(212,164,76,.3)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-xl font-bold gold-shimmer">📋 شروط الاستخدام</h3>
              <button onClick={() => setShowTerms(false)} className="text-gold-500/50 hover:text-gold-400"><X size={20} /></button>
            </div>
            <div className="space-y-4 text-gold-100/70 text-sm leading-relaxed">
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">الأحكام العامة:</h4>
                <ul className="list-disc list-inside space-y-1 text-gold-100/50">
                  <li>استخدامك للموقع يعني موافقتك على الشروط دي</li>
                  <li>المنتجات كلها أصلية 100% ومعروضة بأفضل الأسعار</li>
                  <li>الأسعار قابلة للتغيير في أي وقت بدون إشعار مسبق</li>
                  <li>الصور المعروضة قد تختلف اختلاف بسيط عن المنتج الفعلي</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">الطلب والتوصيل:</h4>
                <ul className="list-disc list-inside space-y-1 text-gold-100/50">
                  <li>التوصيل لجميع محافظات مصر في خلال 2-5 أيام عمل</li>
                  <li>مصاريف الشحن بيتحسب حسب المحافظة</li>
                  <li>الطلب بيتأكد بعد التواصل عبر الواتساب</li>
                  <li>في حالة عدم الاستلام، الطلب بيترجع بعد 7 أيام</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">الدفع:</h4>
                <ul className="list-disc list-inside space-y-1 text-gold-100/50">
                  <li>الدفع عند الاستلام (كاش)</li>
                  <li>فودافون كاش</li>
                  <li>تحويل بنكي</li>
                  <li>بطاقة ائتمان</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
