import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaInit: Promise<void> | undefined
}

function createPrismaClient() {
  const isDev = process.env.NODE_ENV !== 'production'
  const shouldLogQueries = isDev && process.env.DB_QUERY_LOG !== 'false'
  const defaultSqliteUrl = 'file:../database/app_database.db'
  const configuredUrl = process.env.DATABASE_URL
  const normalizedUrl = configuredUrl?.toLowerCase()
  const shouldUseDefaultSqlite =
    isDev && (!configuredUrl || normalizedUrl?.includes('dev.db'))
  const datasourceUrl = shouldUseDefaultSqlite ? defaultSqliteUrl : configuredUrl

  const client = new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
    log: shouldLogQueries
      ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
      : ['warn', 'error'],
  })

  if (shouldLogQueries) {
    client.$on('query', (event) => {
      console.log(`[db] ${event.duration}ms ${event.query}`)
    })
  }

  return client
}

async function initializeSqlite(client: PrismaClient) {
  try {
    await client.$executeRawUnsafe('PRAGMA foreign_keys = ON;')
    await client.$queryRawUnsafe('PRAGMA journal_mode = WAL;')
    await client.$executeRawUnsafe('PRAGMA busy_timeout = 5000;')
  } catch (error) {
    console.error('[db] Failed to initialize SQLite pragmas:', error)
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient()
export const dbReady = globalForPrisma.prismaInit ?? initializeSqlite(db)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
  globalForPrisma.prismaInit = dbReady
}