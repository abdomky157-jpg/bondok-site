import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient, Client } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Shared libsql client for connection reuse
let _libsqlClient: Client | null = null;

function getLibsqlClient(): Client {
  if (!_libsqlClient) {
    _libsqlClient = createClient({
      url: process.env.DATABASE_URL || 'file:./db/custom.db',
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  return _libsqlClient
}

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db'

  // If using Turso (libsql:// URL), use the driver adapter
  if (dbUrl.startsWith('libsql://')) {
    const libsql = getLibsqlClient()
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({ adapter })
  }

  // Local SQLite
  return new PrismaClient()
}

export const db =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
