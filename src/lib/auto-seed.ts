import { db } from "@/lib/db";
import { products } from "@/data/products";
import { bundles } from "@/data/bundles";

const defaultSettings = [
  { key: "siteName", value: "Bondok Perfumes" },
  { key: "siteNameAr", value: "عطور بوندوك" },
  { key: "logoUrl", value: "https://z-cdn-media.chatglm.cn/files/6c66da01-4443-40aa-bb7b-d6bd54a7c505.png?auth_key=1880267790-08e21141053d4e15b394e1d4cf01e594-0-affca78eef460c96a99ed6f34f2f8614" },
  { key: "heroSubtitle", value: "رحلة في عالم العطور الفاخرة" },
  { key: "heroBtn1", value: "تسوق الآن" },
  { key: "heroBtn2", value: "اكتشف عطرك" },
  { key: "occTitle", value: "أفضل عطر لكل مناسبة" },
  { key: "occDesc", value: "العطر المناسب لكل لحظة" },
  { key: "catTitle", value: "التصنيفات" },
  { key: "prodTitle", value: "المنتجات" },
  { key: "bunTitle", value: "باقات مميزة" },
  { key: "t10Title", value: "🏆 Top 10" },
  { key: "aboutTitle", value: "من نحن" },
  { key: "aboutDesc", value: "Bondok Perfumes وجهتك المثالية لعالم العطور الفاخرة. نسعى لتقديم أرقى العطور العالمية بأفضل الأسعار." },
  { key: "aboutImage", value: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&h=700&fit=crop" },
  { key: "aboutStat1", value: "+500" },
  { key: "aboutStat1Label", value: "عطر أصلي" },
  { key: "aboutStat2", value: "+10K" },
  { key: "aboutStat2Label", value: "عميل سعيد" },
  { key: "aboutStat3", value: "100%" },
  { key: "aboutStat3Label", value: "أصلي ومضمون" },
  { key: "contactTitle", value: "تواصل معنا" },
  { key: "contactAddress", value: "القاهرة، مصر" },
  { key: "contactPhone", value: "+20 100 123 4567" },
  { key: "contactWhatsapp", value: "+20 100 123 4567" },
  { key: "footerText", value: "© 2025 Bondok Perfumes" },
  { key: "primaryColor", value: "#D4AF37" },
  { key: "bgColor", value: "#1a0f0a" },
];

let seeding = false;

export async function ensureSeeded(): Promise<boolean> {
  if (seeding) return false;

  try {
    // Check if already has data
    const count = await db.siteProduct.count();
    if (count > 0) return false;

    seeding = true;
    console.log("[auto-seed] Database is empty, seeding...");

    // Seed products
    for (const p of products) {
      await db.siteProduct.create({
        data: {
          name: p.name,
          ar: p.ar,
          brand: p.br,
          gender: p.g,
          type: p.t,
          sizes: JSON.stringify(p.sz),
          image: p.img,
          badge: p.badge || "",
          longevity: p.lon,
          sillage: p.sil,
          topNotes: JSON.stringify(p.tn),
          heartNotes: JSON.stringify(p.hn),
          baseNotes: JSON.stringify(p.bn),
          occasions: JSON.stringify(p.occ),
          seasons: JSON.stringify(p.sea),
          desc: p.desc,
          top: p.top,
          order: p.id,
        },
      });
    }

    // Seed bundles
    for (const b of bundles) {
      await db.siteBundle.create({
        data: {
          name: b.name,
          icon: b.icon,
          price: b.price,
          desc: b.desc,
          items: JSON.stringify(b.items),
          order: b.id,
        },
      });
    }

    // Seed default settings
    for (const s of defaultSettings) {
      await db.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      });
    }

    console.log("[auto-seed] Seeding complete!");
    return true;
  } catch (e: any) {
    console.error("[auto-seed] Error:", e.message);
    return false;
  } finally {
    seeding = false;
  }
}
