import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../db/schema'
import { seedDatabase } from '../db/seed'

export { schema as tables }
export type Db = PostgresJsDatabase<typeof schema>

let dbPromise: Promise<Db> | null = null

/**
 * Conexão única por instância.
 * - Com NUXT_DATABASE_URL → Postgres (Neon, Supabase, etc.) via postgres.js
 * - Sem URL (desenvolvimento) → PGlite embutido em .data/pglite, com migrations
 *   aplicadas automaticamente.
 */
export function useDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = init().catch((err) => {
      dbPromise = null
      throw err
    })
  }
  return dbPromise
}

async function init(): Promise<Db> {
  const config = useRuntimeConfig()
  let db: Db

  if (config.databaseUrl) {
    const { drizzle } = await import('drizzle-orm/postgres-js')
    const postgres = (await import('postgres')).default
    const client = postgres(config.databaseUrl, { prepare: false, max: 5 })
    db = drizzle(client, { schema })
  } else {
    const { PGlite } = await import('@electric-sql/pglite')
    const { drizzle } = await import('drizzle-orm/pglite')
    const { migrate } = await import('drizzle-orm/pglite/migrator')
    const dir = join(process.cwd(), '.data', 'pglite')
    mkdirSync(dir, { recursive: true })
    const client = new PGlite(dir)
    const pg = drizzle(client, { schema })
    await migrate(pg, { migrationsFolder: join(process.cwd(), 'server', 'db', 'migrations') })
    db = pg as unknown as Db
  }

  await seedDatabase(db, {
    adminEmail: config.adminEmail,
    adminPassword: config.adminPassword,
    demo: !config.databaseUrl,
  })
  return db
}
