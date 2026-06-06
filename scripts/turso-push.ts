import { createClient } from "@libsql/client";

const url = process.argv[2] || process.env.DATABASE_URL!;
const token = process.argv[3] || process.env.TURSO_AUTH_TOKEN;

if (!url || !token) {
  console.error("Usage: bun run scripts/turso-push.ts <DATABASE_URL> <TURSO_AUTH_TOKEN>");
  process.exit(1);
}

const client = createClient({ url, authToken: token });

const statements = [
  `CREATE TABLE IF NOT EXISTS "SiteProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "ar" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT 'men',
    "type" TEXT NOT NULL DEFAULT 'fresh',
    "sizes" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "badge" TEXT NOT NULL DEFAULT '',
    "longevity" INTEGER NOT NULL DEFAULT 7,
    "sillage" INTEGER NOT NULL DEFAULT 7,
    "topNotes" TEXT NOT NULL,
    "heartNotes" TEXT NOT NULL,
    "baseNotes" TEXT NOT NULL,
    "occasions" TEXT NOT NULL,
    "seasons" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "top" BOOLEAN NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "SiteBundle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "items" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL DEFAULT ''
  )`,

  `CREATE TABLE IF NOT EXISTS "SiteOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "items" TEXT NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "payment" TEXT NOT NULL DEFAULT 'cash',
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS "SiteCustomer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "governorate" TEXT NOT NULL DEFAULT '',
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" INTEGER NOT NULL DEFAULT 0,
    "lastOrderAt" DATETIME,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "SiteCustomer_phone_key" ON "SiteCustomer"("phone")`,
];

async function main() {
  console.log("Connecting to Turso...");
  for (const sql of statements) {
    try {
      await client.execute(sql);
      const tableName = sql.match(/"(\w+)"/)?.[1];
      console.log(`✓ Created table: ${tableName}`);
    } catch (e: any) {
      console.error(`✗ Error: ${e.message}`);
    }
  }
  console.log("\n✅ All tables created successfully!");
}

main().catch(console.error);
