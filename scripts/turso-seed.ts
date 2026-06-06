import { createClient } from "@libsql/client";
import { products } from "../src/data/products";
import { bundles } from "../src/data/bundles";

const url = "libsql://bondok-db-abdomky157-jpg.aws-eu-west-1.turso.io";
const token = process.argv[2];

if (!token) {
  console.error("Usage: bun run scripts/turso-seed.ts <TURSO_AUTH_TOKEN>");
  process.exit(1);
}

const client = createClient({ url, authToken: token });

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

async function main() {
  console.log("🌱 Seeding Turso database...");

  // Seed products
  let productCount = 0;
  for (const p of products) {
    await client.execute({
      sql: `INSERT INTO "SiteProduct" ("name","ar","brand","gender","type","sizes","image","badge","longevity","sillage","topNotes","heartNotes","baseNotes","occasions","seasons","desc","top","order","active") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
      args: [
        p.name, p.ar, p.br, p.g, p.t,
        JSON.stringify(p.sz), p.img, p.badge || "",
        p.lon, p.sil,
        JSON.stringify(p.tn), JSON.stringify(p.hn), JSON.stringify(p.bn),
        JSON.stringify(p.occ), JSON.stringify(p.sea),
        p.desc || "", p.top ? 1 : 0, p.id,
      ],
    });
    productCount++;
    process.stdout.write(`\r  Products: ${productCount}/${products.length}`);
  }
  console.log(`\n  ✓ ${productCount} products seeded`);

  // Seed bundles
  let bundleCount = 0;
  for (const b of bundles) {
    await client.execute({
      sql: `INSERT INTO "SiteBundle" ("name","icon","price","desc","items","order","active") VALUES (?,?,?,?,?,?,1)`,
      args: [b.name, b.icon, b.price, b.desc || "", JSON.stringify(b.items), b.id],
    });
    bundleCount++;
  }
  console.log(`  ✓ ${bundleCount} bundles seeded`);

  // Seed settings
  for (const s of defaultSettings) {
    await client.execute({
      sql: `INSERT INTO "SiteSetting" ("key","value") VALUES (?,?) ON CONFLICT("key") DO UPDATE SET "value"=?`,
      args: [s.key, s.value, s.value],
    });
  }
  console.log(`  ✓ ${defaultSettings.length} settings seeded`);

  // Verify
  const pResult = await client.execute('SELECT COUNT(*) as c FROM "SiteProduct"');
  const bResult = await client.execute('SELECT COUNT(*) as c FROM "SiteBundle"');
  const sResult = await client.execute('SELECT COUNT(*) as c FROM "SiteSetting"');
  console.log(`\n✅ Total: ${pResult.rows[0].c} products, ${bResult.rows[0].c} bundles, ${sResult.rows[0].c} settings`);
}

main().catch(console.error);
