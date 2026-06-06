"use client";

import { useState, useEffect, useRef } from "react";
import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import Particles from "./Particles";
import { LOGO_URL } from "@/lib/constants";
import { ChevronDown, Sparkles, Clock, Award, Truck } from "lucide-react";

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="text-center">
      <span className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold gold-shimmer">
        {count.toLocaleString()}{suffix}
      </span>
    </div>
  );
}

// Staggered entrance animation CSS classes
const stagger = (index: number, base: number = 150) => ({
  style: {
    animationDelay: `${index * base}ms`,
  } as React.CSSProperties,
});

export default function Hero() {
  const { settings } = useSiteData();
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("prod")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden wood-bg">
      <Particles />

      {/* Decorative corner ornaments */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 hidden sm:block">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-gold-500 to-transparent" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-gold-500 to-transparent" />
        <span className="absolute top-3 right-3 text-gold-500 text-2xl">✦</span>
      </div>
      <div className="absolute top-20 left-10 w-32 h-32 opacity-10 hidden sm:block">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-gold-500 to-transparent" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-gold-500 to-transparent" />
        <span className="absolute top-3 left-3 text-gold-500 text-2xl">✦</span>
      </div>

      {/* Ambient light effect */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(212,164,76,0.06) 0%, transparent 60%)"
      }} />

      <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${mounted ? "hero-float" : ""}`}>
        {/* Logo */}
        <div
          className={`mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative inline-block">
            <img
              src={settings.logoUrl || LOGO_URL}
              className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto object-contain rounded-full"
              style={{ filter: "drop-shadow(0 0 30px rgba(212,164,76,.6))" }}
              alt="Bondok Logo"
            />
            {/* Logo glow ring */}
            <div className="absolute inset-0 rounded-full animate-pulse" style={{
              boxShadow: "0 0 60px rgba(212,164,76,0.2), 0 0 120px rgba(212,164,76,0.1)",
            }} />
          </div>
        </div>

        {/* Title */}
        <h1
          className={`font-playfair text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-2 leading-tight transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <span className="gold-shimmer">Bondok</span>
        </h1>
        <h2
          className={`font-playfair text-lg sm:text-2xl lg:text-3xl text-gold-400 tracking-[0.2em] sm:tracking-[0.3em] mb-6 font-light transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "600ms" }}
        >
          PERFUMES
        </h2>

        {/* Ornamental Divider */}
        <div
          className={`orn-div max-w-sm mx-auto mb-6 transition-all duration-700 ${mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          style={{ transitionDelay: "750ms" }}
        >
          <span className="text-gold-500 text-lg">✦</span>
        </div>

        {/* Subtitle */}
        <p
          className={`font-amiri text-lg sm:text-2xl lg:text-3xl text-gold-200/80 mb-4 leading-relaxed transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "900ms" }}
        >
          {settings.heroSubtitle || "رحلة في عالم العطور الفاخرة"}
        </p>
        <p
          className={`text-gold-100/40 text-sm sm:text-base mb-10 max-w-2xl mx-auto transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "1050ms" }}
        >
          أكتر من 500 عطر أصلي من أشهر الماركات العالمية بأفضل الأسعار في مصر
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-16 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "1200ms" }}
        >
          <a
            href="#prod"
            className="group px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,164,76,.5)] hover:scale-105 flex items-center gap-2 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              {settings.heroBtn1 || "تسوق الآن"}
            </span>
            {/* Shimmer effect on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
          <button
            onClick={() => setQuizOpen(true)}
            className="px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg border-2 border-gold-500/40 text-gold-400 font-bold rounded-full transition-all duration-300 hover:bg-gold-500/10 hover:border-gold-500/60 hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">{settings.heroBtn2 || "اكتشف عطرك"}</span>
            <span className="absolute inset-0 bg-gold-500/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
          </button>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-3 gap-6 sm:gap-10 max-w-2xl mx-auto px-2 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1400ms" }}
        >
          <div className="p-4 rounded-xl transition-all duration-300 hover:bg-gold-500/5">
            <AnimatedCounter target={500} suffix="+" />
            <p className="text-gold-100/40 text-xs sm:text-sm mt-1">عطر أصلي</p>
          </div>
          <div className="p-4 rounded-xl transition-all duration-300 hover:bg-gold-500/5">
            <AnimatedCounter target={10000} suffix="+" />
            <p className="text-gold-100/40 text-xs sm:text-sm mt-1">عميل سعيد</p>
          </div>
          <div className="p-4 rounded-xl transition-all duration-300 hover:bg-gold-500/5">
            <AnimatedCounter target={100} suffix="%" />
            <p className="text-gold-100/40 text-xs sm:text-sm mt-1">أصلي ومضمون</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToProducts}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-gold-400/50 hover:text-gold-400 transition-all duration-500 animate-bounce ${mounted ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "1800ms" }}
        aria-label="اذهب للمنتجات"
      >
        <ChevronDown size={32} />
      </button>

      {/* Quick Feature Badges */}
      <div className={`absolute bottom-20 left-4 sm:left-8 hidden sm:flex flex-col gap-2 opacity-60 transition-all duration-700 ${mounted ? "opacity-60 translate-x-0" : "opacity-0 -translate-x-4"}`}
        style={{ transitionDelay: "1600ms" }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wood-950/60 border border-gold-500/15 text-gold-300/70 text-[10px] sm:text-xs">
          <Truck size={12} /> توصيل لكل المحافظات
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wood-950/60 border border-gold-500/15 text-gold-300/70 text-[10px] sm:text-xs">
          <Award size={12} /> منتجات أصلية 100%
        </div>
      </div>
      <div className={`absolute bottom-20 right-4 sm:right-8 hidden sm:flex flex-col gap-2 transition-all duration-700 ${mounted ? "opacity-60 translate-x-0" : "opacity-0 translate-x-4"}`}
        style={{ transitionDelay: "1700ms" }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wood-950/60 border border-gold-500/15 text-gold-300/70 text-[10px] sm:text-xs">
          <Clock size={12} /> كاش عند الاستلام
        </div>
      </div>
    </section>
  );
}
