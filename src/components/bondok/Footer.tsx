"use client";

import { useState } from "react";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import { LOGO_URL } from "@/lib/constants";
import {
  Truck, Shield, RefreshCw, MessageCircle, X,
  Heart,
  Phone, MapPin, ChevronUp, ExternalLink,
} from "lucide-react";

export default function Footer() {
  const { settings } = useSiteData();
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);
  const setSpinOpen = useBondokStore((s) => s.setSpinOpen);
  const setSurpriseOpen = useBondokStore((s) => s.setSurpriseOpen);
  const whatsappNumber = (settings.contactWhatsapp || "+201067278639").replace(/[^0-9+]/g, "");

  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto" style={{ background: "linear-gradient(180deg, #2D1B11, #1A0F0A)" }}>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: <Truck size={28} className="text-gold-400" />, title: "توصيل سريع", desc: "لجميع المحافظات في 2-5 أيام" },
            { icon: <Shield size={28} className="text-gold-400" />, title: "منتجات أصلية", desc: "ضمان على كل المنتجات" },
            { icon: <RefreshCw size={28} className="text-gold-400" />, title: "إرجاع مجاني", desc: "إرجاع خلال 3 أيام" },
            { icon: <MessageCircle size={28} className="text-green-400" />, title: "دعم 24/7", desc: "تواصل معنا على واتساب" },
          ].map((f, i) => (
            <div
              key={i}
              className="text-center p-5 rounded-xl border border-gold-500/10 transition-all duration-300 hover:border-gold-500/25 hover:bg-gold-500/5"
              style={{ background: "rgba(45,27,17,.2)" }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "rgba(212,164,76,.08)" }}>
                {f.icon}
              </div>
              <p className="text-gold-300 text-xs font-semibold mb-0.5">{f.title}</p>
              <p className="text-gold-100/30 text-[11px] sm:text-xs">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={settings.logoUrl || LOGO_URL}
                className="w-10 h-10 rounded-full object-contain"
                style={{ filter: "drop-shadow(0 0 8px rgba(212,164,76,.4))" }}
                alt="Bondok"
              />
              <div>
                <h4 className="font-playfair text-gold-400 font-bold text-sm">Bondok</h4>
                <p className="font-playfair text-[10px] tracking-widest text-gold-400/60">PERFUMES</p>
              </div>
            </div>
            <p className="text-gold-100/40 text-xs leading-relaxed mb-4">
              وجهتك المثالية لعالم العطور الفاخرة. أرقى العطور العالمية بأفضل الأسعار.
            </p>
            {/* Social Media - WhatsApp only until social accounts are configured */}
            <div className="flex items-center gap-2">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gold-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/15 hover:border-green-500/40 transition-all hover:scale-110" aria-label="واتساب">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gold-500/40" />
              روابط سريعة
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "المنتجات", id: "prod" },
                { label: "الباقات", id: "bun" },
                { label: "Top 10", id: "t10" },
                { label: "التصنيفات", id: "cat" },
                { label: "من نحن", id: "about" },
              ].map((link) => (
                <li key={link.id}>
                  <button onClick={() => scrollToSection(link.id)} className="text-gold-100/40 text-xs hover:text-gold-300 transition-all hover:pl-2 duration-300">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gold-500/40" />
              الخدمات
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "اكتشف عطرك", action: () => setQuizOpen(true) },
                { label: "عجلة الحظ", action: () => setSpinOpen(true) },
                { label: "فاجئني", action: () => setSurpriseOpen(true) },
                { label: "تتبع طلبك", action: () => { window.location.hash = "#track"; window.dispatchEvent(new HashChangeEvent("hashchange")); } },
              ].map((link, i) => (
                <li key={i}>
                  <button onClick={link.action} className="text-gold-100/40 text-xs hover:text-gold-300 transition-all hover:pl-2 duration-300">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gold-500/40" />
              معلومات
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "سياسة الإرجاع", action: () => setShowReturnPolicy(true) },
                { label: "شروط الاستخدام", action: () => setShowTerms(true) },
                { label: "تواصل معنا", action: () => scrollToSection("cont") },
              ].map((link, i) => (
                <li key={i}>
                  <button onClick={link.action} className="text-gold-100/40 text-xs hover:text-gold-300 transition-all hover:pl-2 duration-300">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-gold-400 font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-gold-500/40" />
              طرق الدفع
            </h4>
            <ul className="space-y-2.5 mb-6">
              <li className="text-gold-100/40 text-xs flex items-center gap-2">💵 كاش عند الاستلام</li>
              <li className="text-gold-100/40 text-xs flex items-center gap-2">📱 فودافون كاش</li>
              <li className="text-gold-100/40 text-xs flex items-center gap-2">🏦 تحويل بنكي</li>
              <li className="text-gold-100/40 text-xs flex items-center gap-2">💳 بطاقة ائتمان</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gold-500/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gold-100/20 text-xs">
              {settings.footerText || "© 2025 Bondok Perfumes. جميع الحقوق محفوظة"}
            </p>
            <p className="text-gold-100/20 text-xs flex items-center gap-1">
              صنع بـ <Heart size={12} className="text-red-500 fill-red-500" /> في مصر 🇪🇬
            </p>
          </div>
        </div>
      </div>

      {/* Return Policy Modal */}
      {showReturnPolicy && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.85)" }} onClick={() => setShowReturnPolicy(false)}>
          <div className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 sm:p-8" style={{ background: "linear-gradient(135deg,#2D1B11,#1A0F0A)", border: "1px solid rgba(212,164,76,.3)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-xl font-bold gold-shimmer">🔄 سياسة الإرجاع</h3>
              <button onClick={() => setShowReturnPolicy(false)} className="text-gold-500/50 hover:text-gold-400 transition"><X size={20} /></button>
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
              <div className="p-4 rounded-xl border border-gold-500/15" style={{ background: "rgba(45,27,17,.5)" }}>
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.85)" }} onClick={() => setShowTerms(false)}>
          <div className="rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 sm:p-8" style={{ background: "linear-gradient(135deg,#2D1B11,#1A0F0A)", border: "1px solid rgba(212,164,76,.3)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-xl font-bold gold-shimmer">📋 شروط الاستخدام</h3>
              <button onClick={() => setShowTerms(false)} className="text-gold-500/50 hover:text-gold-400 transition"><X size={20} /></button>
            </div>
            <div className="space-y-4 text-gold-100/70 text-sm leading-relaxed">
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">الأحكام العامة:</h4>
                <ul className="list-disc list-inside space-y-1 text-gold-100/50">
                  <li>استخدامك للموقع يعني موافقتك على الشروط دي</li>
                  <li>المنتجات كلها أصلية 100% ومعروضة بأفضل الأسعار</li>
                  <li>الأسعار قابلة للتغيير في أي وقت بدون إشعار مسبق</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gold-400 font-semibold mb-1">الطلب والتوصيل:</h4>
                <ul className="list-disc list-inside space-y-1 text-gold-100/50">
                  <li>التوصيل لجميع محافظات مصر في خلال 2-5 أيام عمل</li>
                  <li>الطلب بيتأكد بعد التواصل عبر الواتساب</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
