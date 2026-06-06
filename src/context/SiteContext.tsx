"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { products as defaultProducts, type Product, TYPE_AR, GENDER_AR } from "@/data/products";
import { bundles as defaultBundles, type Bundle } from "@/data/bundles";
import { useBondokStore } from "@/store/bondok";

interface SiteData {
  products: Product[];
  bundles: Bundle[];
  settings: Record<string, string>;
  loaded: boolean;
  refresh: () => void;
  getSetting: (key: string, fallback?: string) => string;
}

const SiteContext = createContext<SiteData>({
  products: defaultProducts,
  bundles: defaultBundles,
  settings: {},
  loaded: false,
  refresh: () => {},
  getSetting: (key, fallback = "") => fallback,
});

export function useSiteData() { return useContext(SiteContext); }

export function SiteProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [bundles, setBundles] = useState<Bundle[]>(defaultBundles);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      // /api/site handles auto-seeding internally (creates tables + fills data)
      const res = await fetch("/api/site");
      const data = await res.json();
      if (data.products?.length > 0) {
        const converted = data.products.map(convertProduct);
        setProducts(converted);
        useBondokStore.getState().setProducts(converted);
      }
      if (data.bundles?.length > 0) setBundles(data.bundles.map(convertBundle));
      if (data.settings && Object.keys(data.settings).length > 0) setSettings(data.settings);
    } catch {
      // Fail silently — fallback data is already set
    }
    setLoaded(true);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const getSetting = (key: string, fallback = "") => settings[key] || fallback;

  // Apply color settings as CSS custom properties when settings load
  useEffect(() => {
    if (!loaded || typeof document === "undefined") return;
    const primary = settings["primaryColor"];
    const bg = settings["bgColor"];
    if (primary) document.documentElement.style.setProperty("--site-primary", primary);
    if (bg) document.documentElement.style.setProperty("--site-bg", bg);
  }, [loaded, settings]);

  return (
    <SiteContext.Provider value={{ products, bundles, settings, loaded, refresh: load, getSetting }}>
      {children}
    </SiteContext.Provider>
  );
}

interface RawProduct {
  id: number; name: string; ar: string; brand: string;
  gender: string; type: string; sizes: string; image: string;
  badge: string | null; longevity: string; sillage: string;
  topNotes: string; heartNotes: string; baseNotes: string;
  occasions: string; seasons: string; desc: string; top: boolean;
}

interface RawBundle {
  id: number; name: string; icon: string | null; price: number;
  desc: string | null; items: string;
}

function convertProduct(p: RawProduct): Product {
  return {
    id: p.id, name: p.name, ar: p.ar, br: p.brand,
    g: p.gender as Product["g"], t: p.type as Product["t"],
    sz: safeParse(p.sizes, []), img: p.image, badge: p.badge || null,
    lon: p.longevity, sil: p.sillage,
    tn: safeParse(p.topNotes, []), hn: safeParse(p.heartNotes, []),
    bn: safeParse(p.baseNotes, []), occ: safeParse(p.occasions, []),
    sea: safeParse(p.seasons, []), desc: p.desc || "", rev: [], top: p.top,
  };
}

function convertBundle(b: RawBundle): Bundle {
  return { id: b.id, name: b.name, icon: b.icon || "", price: b.price, desc: b.desc || "", items: safeParse(b.items, []) };
}

function safeParse(str: string, fallback: unknown) { try { return JSON.parse(str); } catch { return fallback; } }
