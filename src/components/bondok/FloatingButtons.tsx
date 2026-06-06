"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Shuffle, ArrowUp } from "lucide-react";
import { useBondokStore } from "@/store/bondok";
import { useSiteData } from "@/context/SiteContext";
import { getWhatsAppNumber } from "@/lib/constants";

export default function FloatingButtons() {
  const setSurpriseOpen = useBondokStore((s) => s.setSurpriseOpen);
  const { settings } = useSiteData();
  const whatsappNumber = getWhatsAppNumber(settings.contactWhatsapp);
  const [showTop, setShowTop] = useState(false);

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
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="fixed bottom-6 left-4 sm:left-6 z-[999] w-11 h-11 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle size={24} className="text-white" />
      </a>
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
