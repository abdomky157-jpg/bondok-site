"use client";

import { useSiteData } from "@/context/SiteContext";
import { useEffect, useState, useRef } from "react";
import { Award } from "lucide-react";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 50;
    const stepTime = 30;
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
  }, [started, target]);

  return (
    <div ref={ref} className="text-center">
      <span className="font-playfair text-3xl sm:text-4xl font-bold gold-shimmer">
        {prefix}{count.toLocaleString()}{suffix}
      </span>
    </div>
  );
}

export default function About() {
  const { settings } = useSiteData();

  const aboutImage = settings.aboutImage || "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=700&fit=crop";
  const aboutTitle = settings.aboutTitle || "من نحن";
  const aboutDesc = settings.aboutDesc || "وجهتك المثالية لعالم العطور الفاخرة. نسعى لتقديم أرقى العطور العالمية بأفضل الأسعار.";
  const stat1 = settings.aboutStat1 || "+500";
  const stat1Label = settings.aboutStat1Label || "عطر أصلي";
  const stat2 = settings.aboutStat2 || "+10K";
  const stat2Label = settings.aboutStat2Label || "عميل سعيد";
  const stat3 = settings.aboutStat3 || "100%";
  const stat3Label = settings.aboutStat3Label || "أصلي ومضمون";

  const parseTarget = (val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  return (
    <section id="about" className="relative py-20 wood-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden gold-border transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(212,164,76,.1)]">
              <img
                src={aboutImage}
                className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                alt="About Bondok Perfumes"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-2 sm:-left-4 md:-left-6 p-4 rounded-xl gold-border z-10" style={{ background: "rgba(26,15,10,.9)" }}>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-gold-400" />
                <div>
                  <p className="font-playfair text-gold-300 font-bold text-sm">منذ 2026</p>
                  <p className="text-gold-100/40 text-[10px]">خبرة في العطور</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="font-amiri text-gold-400 text-lg mb-2">قصتنا</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-6">
              {aboutTitle}
            </h2>
            <div className="orn-div mb-8" style={{ marginRight: 0 }}>
              <span className="text-gold-500">✦</span>
            </div>
            <p className="text-gold-100/60 text-base sm:text-lg leading-relaxed mb-8">
              <strong className="text-gold-400">Bondok Perfumes</strong> {aboutDesc}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 sm:p-5 rounded-xl gold-border transition-all duration-300 hover:bg-gold-500/5" style={{ background: "rgba(45,27,17,.4)" }}>
                <AnimatedCounter target={parseTarget(stat1)} suffix={stat1.includes("+") ? "+" : stat1.includes("K") ? "+" : stat1.includes("%") ? "%" : ""} prefix={stat1.includes("%") ? "" : "+"} />
                <p className="text-gold-100/40 text-xs sm:text-sm mt-2">{stat1Label}</p>
              </div>
              <div className="text-center p-4 sm:p-5 rounded-xl gold-border transition-all duration-300 hover:bg-gold-500/5" style={{ background: "rgba(45,27,17,.4)" }}>
                <AnimatedCounter target={parseTarget(stat2)} suffix="+" />
                <p className="text-gold-100/40 text-xs sm:text-sm mt-2">{stat2Label}</p>
              </div>
              <div className="text-center p-4 sm:p-5 rounded-xl gold-border transition-all duration-300 hover:bg-gold-500/5" style={{ background: "rgba(45,27,17,.4)" }}>
                <AnimatedCounter target={parseTarget(stat3)} suffix="%" />
                <p className="text-gold-100/40 text-xs sm:text-sm mt-2">{stat3Label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
