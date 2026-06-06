import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient, Client } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Shared libsql client for connection reuse
let _libsqlClient: Client | null = null;

function getLibsqlClient(url: string, authToken?: string): Client {
  if (!_libsqlClient) {
    _libsqlClient = createClient({
      url,
      authToken: authToken || undefined,
    })
  }
  return _libsqlClient
}

function createPrismaClient(): PrismaClient {
  // Get DATABASE_URL, handle literal 'undefined' string from some build systems
  const rawUrl = process.env.DATABASE_URL
  const dbUrl = (rawUrl && rawUrl !== 'undefined' && rawUrl.trim() !== '')
    ? rawUrl.trim()
    : 'file:./db/custom.db'

  // If using Turso (libsql:// URL), use the driver adapter
  if (dbUrl.startsWith('libsql://')) {
    const authToken = process.env.TURSO_AUTH_TOKEN
    const libsql = getLibsqlClient(dbUrl, authToken)
    const adapter = new PrismaLibSQL(libsql)
    return new PrismaClient({
      adapter,
    })
  }

  // Local SQLite - explicitly set datasourceUrl to prevent Prisma schema env() from returning undefined
  return new PrismaClient({
    datasourceUrl: dbUrl,
  })
}

// Lazy initialization: the client is created on first access, not on module import.
// This prevents crashes during Next.js build when DATABASE_URL is not set.
let _db: PrismaClient | undefined = undefined

function getDb(): PrismaClient {
  if (!_db) {
    _db = globalForPrisma.prisma || createPrismaClient()
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _db
    }
  }
  return _db
}

// Use a Proxy so the client is lazily created on first property access
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getDb()
    const value = Reflect.get(client, prop, receiver)
    // Bind methods to the actual client instance
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
