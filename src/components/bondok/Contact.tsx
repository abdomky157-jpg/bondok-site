"use client";

import { useState } from "react";
import { MapPin, Phone, MessageCircle, Send } from "lucide-react";
import { useSiteData } from "@/context/SiteContext";

export default function Contact() {
  const { settings } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");

  return (
    <section id="cont" className="relative py-20 wood-bg-lt">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            {settings.contactTitle || "تواصل معنا"}
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl gold-border">
              <MapPin size={24} className="text-gold-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-playfair text-gold-300 font-semibold mb-1">العنوان</h4>
                <p className="text-gold-100/60 text-sm">{settings.contactAddress || "القاهرة، مصر"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl gold-border">
              <Phone size={24} className="text-gold-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-playfair text-gold-300 font-semibold mb-1">الهاتف</h4>
                <p className="text-gold-100/60 text-sm" dir="ltr">{settings.contactPhone || "+201010733294"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl gold-border">
              <MessageCircle size={24} className="text-gold-400 mt-1 shrink-0" />
              <div>
                <h4 className="font-playfair text-gold-300 font-semibold mb-1">واتساب</h4>
                <p className="text-gold-100/60 text-sm" dir="ltr">{settings.contactWhatsapp || "+201010733294"}</p>
              </div>
            </div>
          </div>
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
                setTimeout(() => setSubmitted(false), 3000);
              } catch {
                setSubmitted(false);
              } finally {
                setSending(false);
              }
            }}
            className="space-y-4 p-8 rounded-2xl gold-border"
            style={{ background: "rgba(45,27,17,.5)" }}
          >
            <input
              type="text"
              required
              placeholder="الاسم"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition"
            />
            <input
              type="tel"
              required
              placeholder="رقم الهاتف"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition"
              dir="ltr"
            />
            <textarea
              rows={4}
              required
              placeholder="الرسالة"
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-wood-950/50 border border-gold-500/20 text-gold-100 placeholder:text-gold-100/30 focus:border-gold-500/50 focus:outline-none transition resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-lg text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending ? "جاري الإرسال..." : submitted ? "تم فتح الواتساب بنجاح! 📩" : <>إرسال عبر واتساب <Send size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
