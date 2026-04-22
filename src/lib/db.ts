import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const isDev = process.env.NODE_ENV !== 'production'
  const shouldLogQueries = isDev && process.env.DB_QUERY_LOG !== 'false'
  const client = new PrismaClient({
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

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}