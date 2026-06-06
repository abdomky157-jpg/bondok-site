"use client";

import { useState, useEffect } from "react";
import { Flame, Clock } from "lucide-react";

export default function OffersBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="relative py-6 overflow-hidden" style={{
      background: "linear-gradient(135deg, #7D5630, #A07020, #7D5630)",
    }}>
      {/* Animated background stripes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 11px)",
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-wood-950/20 flex items-center justify-center">
              <Flame size={22} className="text-wood-950" />
            </div>
            <div>
              <h3 className="font-playfair text-wood-950 font-bold text-lg">عروض لا تفوتك!</h3>
              <p className="text-wood-950/60 text-xs">خصومات تصل لـ 30% على منتجات مختارة</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-wood-950/60" />
            <span className="text-wood-950/60 text-xs ml-1">ينتهي العرض خلال:</span>
            <div className="flex items-center gap-1.5">
              {[
                { value: pad(timeLeft.hours), label: "ساعة" },
                { value: pad(timeLeft.minutes), label: "دقيقة" },
                { value: pad(timeLeft.seconds), label: "ثانية" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-10 h-10 rounded-lg bg-wood-950/20 flex items-center justify-center">
                    <span className="font-playfair text-wood-950 font-bold text-lg tabular-nums">{item.value}</span>
                  </div>
                  {i < 2 && <span className="text-wood-950/40 font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="#prod"
            className="px-6 py-2.5 bg-wood-950 text-gold-400 font-bold rounded-full text-sm hover:bg-wood-950/90 transition-all hover:scale-105 flex items-center gap-2"
          >
            تسوق الآن
          </a>
        </div>
      </div>
    </section>
  );
}
