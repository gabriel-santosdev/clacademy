import { defineConfig } from 'drizzle-kit'

// drizzle-kit não lê o .env sozinho
try {
  process.loadEnvFile()
} catch {}

// Migrations usam o "Session pooler" (porta 5432) se definido; o app usa o "Transaction pooler" (6543)
const url = process.env.NUXT_DATABASE_MIGRATION_URL || process.env.NUXT_DATABASE_URL

// Na Vercel o banco local (PGlite) não existe: falha com uma mensagem clara
if (!url && process.env.VERCEL) {
  throw new Error(
    `NUXT_DATABASE_URL não está definida neste deploy (ambiente: ${process.env.VERCEL_ENV}). ` +
      'Em Settings → Environment Variables, marque esse ambiente nas variáveis do banco.',
  )
}

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
