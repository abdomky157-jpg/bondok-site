"use client";

import { useSiteData } from "@/context/SiteContext";
import { useBondokStore } from "@/store/bondok";
import Particles from "./Particles";
import { LOGO_URL } from "@/lib/constants";

export default function Hero() {
  const { settings } = useSiteData();
  const setQuizOpen = useBondokStore((s) => s.setQuizOpen);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden wood-bg">
      {/* Particles */}
      <Particles />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto hero-float">
        <img
          src={settings.logoUrl || LOGO_URL}
          className="w-28 h-28 mx-auto object-contain rounded-full mb-6"
          style={{ filter: "drop-shadow(0 0 20px rgba(212,164,76,.5))" }}
          alt="Bondok Logo"
        />
        <h1 className="font-playfair text-5xl sm:text-7xl lg:text-8xl font-bold mb-4">
          <span className="gold-shimmer">Bondok</span>
        </h1>
        <h2 className="font-playfair text-2xl sm:text-3xl text-gold-400 tracking-[0.15em] mb-6">
          PERFUMES
        </h2>
        <div className="orn-div max-w-md mx-auto">
          <span className="text-gold-500 text-xl">✦</span>
        </div>
        <p className="font-amiri text-xl sm:text-2xl text-gold-200/80 mb-10">
          {settings.heroSubtitle || "رحلة في عالم العطور الفاخرة"}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#prod"
            className="px-10 py-4 bg-gradient-to-l from-gold-500 to-gold-700 text-wood-950 font-bold rounded-full text-lg hover:shadow-[0_0_30px_rgba(212,164,76,.4)] transition-all hover:scale-105"
          >
            {settings.heroBtn1 || "تسوق الآن"}
          </a>
          <button
            onClick={() => setQuizOpen(true)}
            className="px-10 py-4 border-2 border-gold-500/50 text-gold-400 font-bold rounded-full text-lg hover:bg-gold-500/10 transition-all"
          >
            {settings.heroBtn2 || "اكتشف عطرك"}
          </button>
        </div>
      </div>
    </section>
  );
}
