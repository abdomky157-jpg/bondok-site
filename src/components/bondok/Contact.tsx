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
  const [selectedWhatsApp, setSelectedWhatsApp] = useState("201067278639");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const contactCards = [
    {
      icon: <MapPin size={24} className="text-gold-400" />,
      title: "العنوان",
      color: "rgba(212,164,76,.1)",
      items: [
        {
          label: settings.contactAddress || "أمام فتح الله ماركت - الهانوفيل - العجمي - الاسكندريه",
          link: "https://maps.app.goo.gl/iyPNUvuU1c1r54zj9",
        },
      ],
    },
    {
      icon: <Phone size={24} className="text-gold-400" />,
      title: "أرقام الهاتف",
      color: "rgba(212,164,76,.1)",
      dir: "ltr",
      items: [
        {
          label: "+20 106 727 8639",
          badge: "أساسي",
          link: "tel:+201067278639",
        },
        {
          label: "+20 121 778 4049",
          badge: "إضافي",
          link: "tel:+201217784049",
        },
      ],
    },
    {
      icon: <MessageCircle size={24} className="text-green-400" />,
      title: "واتساب مباشر",
      color: "rgba(34,197,94,.1)",
      dir: "ltr",
      items: [
        {
          label: "+20 106 727 8639",
          badge: "واتساب 1",
          link: "https://wa.me/201067278639",
        },
        {
          label: "+20 101 073 3294",
          badge: "واتساب 2",
          link: "https://wa.me/201010733294",
        },
      ],
    },
    {
      icon: <Clock size={24} className="text-gold-400" />,
      title: "مواعيد العمل",
      color: "rgba(212,164,76,.1)",
      items: [
        {
          label: "السبت - الخميس: 10ص - 10م",
        },
      ],
    },
  ];

  return (
    <section id="cont" className="relative py-10 sm:py-20 wood-bg-lt">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="font-amiri text-gold-400 text-base sm:text-lg mb-2">تواصل معانا</p>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold gold-shimmer mb-4">
            {settings.contactTitle || "تواصل معنا"}
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Cards */}
          <div className="space-y-3">
            {contactCards.map((card, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 sm:p-5 rounded-xl gold-border transition-all duration-300 hover:bg-gold-500/5"
                style={{ background: "rgba(45,27,17,.3)" }}
              >
                <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center" style={{ background: card.color }}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-playfair text-gold-300 font-semibold text-sm mb-1.5">{card.title}</h4>
                  <div className="flex flex-col gap-1.5">
                    {card.items.map((item, idx) => (
                      item.link ? (
                        <a
                          key={idx}
                          href={item.link}
                          target={item.link.startsWith("tel:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="text-gold-100/70 hover:text-gold-400 transition text-sm flex items-center gap-2 group/num"
                          dir={card.dir || "rtl"}
                        >
                          <span className="font-mono group-hover/num:underline">{item.label}</span>
                          {item.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold-500/25 text-gold-300 bg-gold-500/10">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      ) : (
                        <p key={idx} className="text-gold-100/60 text-sm" dir={card.dir || "rtl"}>
                          {item.label}
                        </p>
                      )
                    ))}
                  </div>
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
                const msg = `📩 رسالة جديدة من موقع Bondok Perfumes\n\n👤 الاسم: ${formName}\n📱 التليفون: ${formPhone}\n💬 الرسالة: ${formMessage}`;
                const waUrl = `https://wa.me/${selectedWhatsApp}?text=${encodeURIComponent(msg)}`;
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
            
            {/* Choose WhatsApp recipient */}
            <div>
              <label className="block text-xs text-gold-400 mb-1.5">إرسال الرسالة إلى رقم:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedWhatsApp("201067278639")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition text-center ${
                    selectedWhatsApp === "201067278639"
                      ? "border-green-500 bg-green-500/20 text-green-300"
                      : "border-gold-500/20 text-gold-100/60 hover:border-gold-500/40"
                  }`}
                >
                  واتساب 1 (01067278639)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWhatsApp("201010733294")}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition text-center ${
                    selectedWhatsApp === "201010733294"
                      ? "border-green-500 bg-green-500/20 text-green-300"
                      : "border-gold-500/20 text-gold-100/60 hover:border-gold-500/40"
                  }`}
                >
                  واتساب 2 (01010733294)
                </button>
              </div>
            </div>

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
