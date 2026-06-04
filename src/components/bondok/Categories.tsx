"use client";

import { useBondokStore } from "@/store/bondok";
import { TYPE_AR, GENDER_AR } from "@/data/products";
import { Trees, Flower2, Flame, Droplets, Candy, Heart, Users } from "lucide-react";

const genderCategories = [
  {
    key: "men",
    label: "عطور رجالية",
    icon: <Users size={36} className="text-gold-400 mx-auto mb-2" />,
    img: "https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=600&h=450&fit=crop",
  },
  {
    key: "women",
    label: "عطور نسائية",
    icon: <Heart size={36} className="text-gold-400 mx-auto mb-2" />,
    img: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&h=450&fit=crop",
  },
  {
    key: "unisex",
    label: "عطور مشتركة",
    icon: <Users size={36} className="text-gold-400 mx-auto mb-2" />,
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=450&fit=crop",
  },
];

const familyIcons: Record<string, React.ReactNode> = {
  woody: <Trees size={40} className="text-gold-400 mx-auto mb-3" />,
  floral: <Flower2 size={40} className="text-gold-400 mx-auto mb-3" />,
  oriental: <Flame size={40} className="text-gold-400 mx-auto mb-3" />,
  fresh: <Droplets size={40} className="text-gold-400 mx-auto mb-3" />,
  spicy: <Flame size={40} className="text-gold-400 mx-auto mb-3" />,
  sweet: <Candy size={40} className="text-gold-400 mx-auto mb-3" />,
};

export default function Categories() {
  const setCategoryFilter = useBondokStore((s) => s.setCategoryFilter);
  const setPriceFilter = useBondokStore((s) => s.setPriceFilter);

  const handleFilter = (key: string) => {
    setCategoryFilter(key);
    setPriceFilter("all");
    setTimeout(() => {
      document.getElementById("prod")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section id="cat" className="relative py-20 wood-bg-lt">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold gold-shimmer mb-4">
            التصنيفات
          </h2>
          <div className="orn-div max-w-xs mx-auto">
            <span className="text-gold-500">❖</span>
          </div>
        </div>

        {/* Gender Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {genderCategories.map((cat) => (
            <div
              key={cat.key}
              className="group relative overflow-hidden rounded-2xl gold-border cursor-pointer"
              onClick={() => handleFilter(cat.key)}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={cat.img}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={cat.label}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood-950 via-wood-950/50 to-transparent" />
                <div className="absolute bottom-0 p-6 text-center w-full">
                  {cat.icon}
                  <h4 className="font-playfair text-2xl font-bold text-gold-400">{cat.label}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fragrance Families */}
        <h3 className="font-amiri text-2xl text-gold-300 text-center mb-8">العائلة العطرية</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(TYPE_AR).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleFilter(key)}
              className="group cursor-pointer rounded-xl gold-border p-6 text-center hover:bg-gold-500/10 transition-all"
            >
              <div className="transition-transform group-hover:scale-110">{familyIcons[key]}</div>
              <h5 className="font-playfair text-gold-300 font-semibold text-sm">{label}</h5>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
