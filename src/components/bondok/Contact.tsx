"use client";

import { useState } from "react";
import { MapPin, Phone, MessageCircle, Send, Clock, Mail } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";

export default function Contact() {
  const { settings } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const contactCards = [
    {
      icon: <MapPin size={24} className="text-gold-400" />,
      title: "العنوان",
      value: settings.contactAddress || "القاهرة، مصر",
      color: "rgba(212,164,76,.1)",
    },
    {
      icon: <Phone size={24} className="text-gold-400" />,
      title: "الهاتف",
      value: settings.contactPhone || "+201010733294",
      color: "rgba(212,164,76,.1)",
      dir: "ltr",
    },
    {
      icon: <MessageCircle size={24} className="text-green-400" />,
      title: "واتساب",
      value: settings.contactWhatsapp || "+201010733294",
      color: "rgba(34,197,94,.1)",
      dir: "ltr",
      link: `https://wa.me/${(settings.contactWhatsapp || "+201010733294").replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: <Clock size={24} className="text-gold-400" />,
      title: "مواعيد العمل",
      value: "السبت - الخميس: 10ص - 10م",
      color: "rgba(212,164,76,.1)",
    },
  ];

  return (
    <section id="cont" className="relative py-20 wood-bg-lt">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-amiri text-gold-400 text-lg mb-2">تواصل معانا</p>
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            {settings.contactTitle || "تواصل معنا"}
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Cards */}
          <div className="space-y-3">
            {contactCards.map((card, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl gold-border transition-all duration-300 hover:bg-gold-500/5 ${card.link ? "cursor-pointer" : ""}`}
                onClick={() => card.link && window.open(card.link, "_blank")}
                style={{ background: "rgba(45,27,17,.3)" }}
              >
                <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" style={{ background: card.color }}>
                  {card.icon}
                </div>
                <div>
                  <h4 className="font-playfair text-gold-300 font-semibold text-sm mb-0.5">{card.title}</h4>
                  <p className="text-gold-100/50 text-sm" dir={card.dir || "rtl"}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSending(true);
              try {
                const whatsappNumber = (settings.contactWhatsapp || "+201010733294").replace(/[^0-9+]/g, "");
                const msg = `📩 رسالة جديدة من موقع Bondok Perfumes\n\n👤 الاسم: ${formName}\n📱 التليفون: ${formPhone}\n💬 الرسالة: ${formMessage}`;
                const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
                window.open(waUrl, "_blank");
                setSubmitted(true);
                setFormName("");
                setFormPhone("");
                setFormMessage("");
                setTimeout(() => setSubmitted(false), 4000);
              } catch {
                setSubmitted(false);
              } finally {
                setSending(false);
              }
            }}
            className="space-y-4 p-6 sm:p-8 rounded-2xl gold-border"
            style={{ background: "rgba(45,27,17,.4)" }}
          >
            <h3 className="font-playfair text-gold-300 font-semibold text-lg mb-2">أرسل رسالة</h3>
            
            {/* Name Field */}
            <div className="relative">
              <input
                type="text"
                required
                placeholder="الاسم"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 rounded-lg bg-wood-950/50 border text-gold-100 placeholder:text-gold-100/25 focus:outline-none transition-all text-sm ${
                  focusedField === "name" ? "border-gold-500/50 shadow-[0_0_10px_rgba(212,164,76,.1)]" : "border-gold-500/15"
                }`}
              />
            </div>

            {/* Phone Field */}
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="رقم الهاتف"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                dir="ltr"
                className={`w-full px-4 py-3 rounded-lg bg-wood-950/50 border text-gold-100 placeholder:text-gold-100/25 focus:outline-none transition-all text-sm text-right ${
                  focusedField === "phone" ? "border-gold-500/50 shadow-[0_0_10px_rgba(212,164,76,.1)]" : "border-gold-500/15"
                }`}
              />
            </div>

            {/* Message Field */}
            <div className="relative">
              <textarea
                rows={4}
                required
                placeholder="الرسالة..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 rounded-lg bg-wood-950/50 border text-gold-100 placeholder:text-gold-100/25 focus:outline-none transition-all resize-none text-sm ${
                  focusedField === "message" ? "border-gold-500/50 shadow-[0_0_10px_rgba(212,164,76,.1)]" : "border-gold-500/15"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`w-full py-3.5 font-bold rounded-xl text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                submitted
                  ? "bg-green-600 text-white"
                  : "bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 hover:shadow-[0_4px_20px_rgba(212,164,76,.3)] hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {sending ? (
                <span className="flex items-center gap-2"><Mail size={18} className="animate-spin" /> جاري الإرسال...</span>
              ) : submitted ? (
                <span>تم فتح الواتساب بنجاح! ✅</span>
              ) : (
                <span>إرسال عبر واتساب <Send size={18} /></span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
