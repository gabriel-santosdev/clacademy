import { defineConfig } from 'drizzle-kit'

const url = process.env.NUXT_DATABASE_URL

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
