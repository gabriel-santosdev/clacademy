import { defineConfig } from 'drizzle-kit'

// drizzle-kit não lê o .env sozinho
try {
  process.loadEnvFile()
} catch {}

// Migrations usam o "Session pooler" (porta 5432) se definido; o app usa o "Transaction pooler" (6543)
const url = process.env.NUXT_DATABASE_MIGRATION_URL || process.env.NUXT_DATABASE_URL

export default url
  ? defineConfig({
      dialect: 'postgresql',
      schema: './server/db/schema.ts',
      out: './server/db/migrations',
      dbCredentials: { url },
    })
  : defineConfig({
      dialect: 'postgresql',
      driver: 'pglite',
      schema: './server/db/schema.ts',
      out: './server/db/migrations',
      dbCredentials: { url: './.data/pglite' },
    })
