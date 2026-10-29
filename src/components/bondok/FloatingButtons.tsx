"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Shuffle, ArrowUp, X, Phone } from "lucide-react";
import { useBondokStore } from "@/store/bondok";
import { useSiteData } from "@/context/SiteContext";
import { DEFAULT_WHATSAPP, DEFAULT_WHATSAPP_2, DEFAULT_PHONE_2 } from "@/lib/constants";

export default function FloatingButtons() {
  const setSurpriseOpen = useBondokStore((s) => s.setSurpriseOpen);
  const { settings } = useSiteData();
  const [showTop, setShowTop] = useState(false);
  const [showWhatsAppPicker, setShowWhatsAppPicker] = useState(false);

  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* WhatsApp Multi-number Floating Popup */}
      {showWhatsAppPicker && (
        <div
          className="fixed bottom-20 left-4 sm:left-6 z-[1000] p-3.5 rounded-2xl gold-border shadow-2xl flex flex-col gap-2 min-w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ background: "linear-gradient(135deg, #2D1B11, #1A0F0A)", border: "1px solid rgba(212,164,76,.35)" }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-gold-500/20">
            <span className="text-xs font-bold text-gold-300 font-playfair flex items-center gap-1.5">
              <MessageCircle size={15} className="text-green-400" /> تواصل عبر واتساب
            </span>
            <button
              onClick={() => setShowWhatsAppPicker(false)}
              className="text-gold-400/50 hover:text-gold-300 p-0.5 rounded transition"
              aria-label="إغلاق"
            >
              <X size={15} />
            </button>
          </div>
          
          <a
            href="https://wa.me/201067278639"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowWhatsAppPicker(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-wood-950/50 hover:bg-green-600/20 border border-gold-500/10 hover:border-green-500/40 transition text-right group"
          >
            <div>
              <p className="text-xs font-semibold text-gold-200 group-hover:text-green-400 transition">خدمة العملاء (1)</p>
              <p className="text-[11px] text-gold-400/70 font-mono" dir="ltr">01067278639</p>
            </div>
            <MessageCircle size={18} className="text-green-400 shrink-0 group-hover:scale-110 transition" />
          </a>

          <a
            href="https://wa.me/201010733294"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowWhatsAppPicker(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-wood-950/50 hover:bg-green-600/20 border border-gold-500/10 hover:border-green-500/40 transition text-right group"
          >
            <div>
              <p className="text-xs font-semibold text-gold-200 group-hover:text-green-400 transition">خدمة العملاء (2)</p>
              <p className="text-[11px] text-gold-400/70 font-mono" dir="ltr">01010733294</p>
            </div>
            <MessageCircle size={18} className="text-green-400 shrink-0 group-hover:scale-110 transition" />
          </a>

          <a
            href="tel:+201217784049"
            onClick={() => setShowWhatsAppPicker(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-wood-950/30 hover:bg-gold-500/10 border border-gold-500/10 hover:border-gold-500/30 transition text-right group mt-0.5"
          >
            <div>
              <p className="text-xs font-semibold text-gold-200/80 group-hover:text-gold-300 transition">اتصال هاتفي مباشر</p>
              <p className="text-[11px] text-gold-400/60 font-mono" dir="ltr">01217784049</p>
            </div>
            <Phone size={16} className="text-gold-400 shrink-0 group-hover:scale-110 transition" />
          </a>
        </div>
      )}

      {/* WhatsApp Trigger Button */}
      <button
        onClick={() => setShowWhatsAppPicker(!showWhatsAppPicker)}
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-6 left-4 sm:left-6 z-[999] w-11 h-11 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle size={24} className="text-white" />
      </button>

      {/* Surprise */}
      <button
        onClick={() => setSurpriseOpen(true)}
        aria-label="فاجئني"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[999] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 pulse-gold gold-gradient"
      >
        <Shuffle size={24} className="text-wood-950" />
      </button>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        aria-label="العودة لأعلى"
        className={`fixed bottom-32 sm:bottom-20 right-4 sm:right-6 z-[999] w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        style={{ background: "rgba(26,15,10,.8)", border: "1px solid rgba(212,164,76,.3)" }}
      >
        <ArrowUp size={18} className="text-gold-400" />
      </button>
    </>
  );
}
