"use client";

import { useSiteData } from "@/context/SiteContext";

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

  return (
    <section id="about" className="relative py-20 wood-bg">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden gold-border">
              <img
                src={aboutImage}
                className="w-full h-[500px] object-cover"
                alt="About Bondok Perfumes"
              />
            </div>
          </div>
          <div>
            <p className="font-amiri text-gold-400 text-lg mb-2">قصتنا</p>
            <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-6">
              {aboutTitle}
            </h2>
            <div className="orn-div mb-8" style={{ marginRight: 0 }}>
              <span className="text-gold-500">✦</span>
            </div>
            <p className="text-gold-100/70 text-lg leading-relaxed mb-6">
              <strong className="text-gold-400">Bondok Perfumes</strong> {aboutDesc}
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl gold-border">
                <p className="font-playfair text-3xl font-bold gold-shimmer">{stat1}</p>
                <p className="text-gold-100/50 text-sm mt-1">{stat1Label}</p>
              </div>
              <div className="text-center p-4 rounded-xl gold-border">
                <p className="font-playfair text-3xl font-bold gold-shimmer">{stat2}</p>
                <p className="text-gold-100/50 text-sm mt-1">{stat2Label}</p>
              </div>
              <div className="text-center p-4 rounded-xl gold-border">
                <p className="font-playfair text-3xl font-bold gold-shimmer">{stat3}</p>
                <p className="text-gold-100/50 text-sm mt-1">{stat3Label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
