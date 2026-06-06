import { db } from "@/lib/db";
import { products } from "@/data/products";
import { bundles } from "@/data/bundles";
import { createClient } from "@libsql/client";

// SQL to create tables if they don't exist (for fresh Turso databases)
const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS "SiteProduct" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "ar" TEXT NOT NULL, "brand" TEXT NOT NULL, "gender" TEXT NOT NULL DEFAULT 'men', "type" TEXT NOT NULL DEFAULT 'fresh', "sizes" TEXT NOT NULL, "image" TEXT NOT NULL, "badge" TEXT NOT NULL DEFAULT '', "longevity" INTEGER NOT NULL DEFAULT 7, "sillage" INTEGER NOT NULL DEFAULT 7, "topNotes" TEXT NOT NULL, "heartNotes" TEXT NOT NULL, "baseNotes" TEXT NOT NULL, "occasions" TEXT NOT NULL, "seasons" TEXT NOT NULL, "desc" TEXT NOT NULL DEFAULT '', "top" BOOLEAN NOT NULL DEFAULT 0, "order" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT 1, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS "SiteBundle" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "icon" TEXT NOT NULL DEFAULT '', "price" INTEGER NOT NULL, "desc" TEXT NOT NULL DEFAULT '', "items" TEXT NOT NULL, "order" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT 1, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS "SiteSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS "SiteOrder" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "phone" TEXT NOT NULL, "address" TEXT NOT NULL, "notes" TEXT NOT NULL DEFAULT '', "items" TEXT NOT NULL, "subtotal" INTEGER NOT NULL, "discount" INTEGER NOT NULL DEFAULT 0, "total" INTEGER NOT NULL, "payment" TEXT NOT NULL DEFAULT 'cash', "status" TEXT NOT NULL DEFAULT 'new', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
CREATE TABLE IF NOT EXISTS "SiteCustomer" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT NOT NULL, "phone" TEXT NOT NULL, "email" TEXT NOT NULL DEFAULT '', "address" TEXT NOT NULL DEFAULT '', "governorate" TEXT NOT NULL DEFAULT '', "totalOrders" INTEGER NOT NULL DEFAULT 0, "totalSpent" INTEGER NOT NULL DEFAULT 0, "lastOrderAt" DATETIME, "notes" TEXT NOT NULL DEFAULT '', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS "SiteCustomer_phone_key" ON "SiteCustomer"("phone");
`;

async function ensureTablesExist(): Promise<void> {
  try {
    const dbUrl = process.env.DATABASE_URL || '';
    if (!dbUrl.startsWith('libsql://')) return; // Only needed for Turso
    const token = process.env.TURSO_AUTH_TOKEN;
    if (!token) return;
    const client = createClient({ url: dbUrl, authToken: token });
    for (const statement of CREATE_TABLES_SQL.trim().split(';').filter(Boolean)) {
      await client.execute(statement.trim());
    }
  } catch {
    // If table creation fails, the seed will also fail - that's handled below
  }
}

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
  { key: "contactAddress", value: "أمام فتح الله ماركت - الهانوفيل - العجمي - الاسكندريه" },
  { key: "contactPhone", value: "+20 106 727 8639" },
  { key: "contactWhatsapp", value: "+20 106 727 8639" },
  { key: "footerText", value: "© 2026 Bondok Perfumes. جميع الحقوق محفوظة" },
  { key: "primaryColor", value: "#D4AF37" },
  { key: "bgColor", value: "#1a0f0a" },
];

let seeding = false;

export async function getDbStats(): Promise<{ products: number; bundles: number; settings: number; customers: number; orders: number }> {
  try {
    const [products, bundles, settings, customers, orders] = await Promise.all([
      db.siteProduct.count(),
      db.siteBundle.count(),
      db.siteSetting.count(),
      db.siteCustomer.count(),
      db.siteOrder.count(),
    ]);
    return { products, bundles, settings, customers, orders };
  } catch {
    return { products: 0, bundles: 0, settings: 0, customers: 0, orders: 0 };
  }
}

export async function ensureSeeded(force = false): Promise<boolean> {
  if (seeding) return false;

  try {
    // Ensure tables exist (important for fresh Turso databases)
    await ensureTablesExist();

    // Check if already has data (unless force)
    if (!force) {
      const count = await db.siteProduct.count();
      if (count > 0) return false;
    }

    seeding = true;

    if (force) {
      // Clear existing data when force-seeding
      await db.siteProduct.deleteMany();
      await db.siteBundle.deleteMany();
      await db.siteSetting.deleteMany();
    }

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

    return true;
  } catch (e: any) {
    console.error("[auto-seed] Error:", e.message);
    return false;
  } finally {
    seeding = false;
  }
}
