import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@libsql/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, any> = {};
  
  // Test 1: Direct libsql query
  try {
    const url = process.env.DATABASE_URL || '';
    const token = process.env.TURSO_AUTH_TOKEN;
    results.libsqlDirect = { url, hasToken: !!token };
    
    if (url.startsWith('libsql://') && token) {
      const client = createClient({ url, authToken: token });
      const r = await client.execute('SELECT COUNT(*) as c FROM SiteProduct');
      results.libsqlProductCount = Number(r.rows[0].c);
      
      const r2 = await client.execute('SELECT name FROM SiteProduct LIMIT 3');
      results.libsqlSampleProducts = r2.rows.map((r: any) => r.name);
    }
  } catch (e: any) {
    results.libsqlError = e.message;
  }

  // Test 2: Prisma query
  try {
    const count = await db.siteProduct.count();
    results.prismaProductCount = count;
  } catch (e: any) {
    results.prismaError = e.message;
  }

  // Test 3: Prisma findMany
  try {
    const products = await db.siteProduct.findMany({ take: 3 });
    results.prismaProducts = products.map((p: any) => ({ id: p.id, name: p.name }));
  } catch (e: any) {
    results.prismaFindError = e.message;
  }

  // Test 4: Prisma $queryRaw
  try {
    const raw = await db.$queryRaw`SELECT COUNT(*) as c FROM SiteProduct`;
    results.prismaRawCount = raw;
  } catch (e: any) {
    results.prismaRawError = e.message;
  }

  return NextResponse.json(results);
}
