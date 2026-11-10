import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const { endpoint } = await readValidatedBody(event, z.object({ endpoint: z.string() }).parse)
  const db = await useDb()
  await db
    .delete(tables.pushSubscriptions)
    .where(and(eq(tables.pushSubscriptions.userId, user.id), eq(tables.pushSubscriptions.endpoint, endpoint)))
  return { ok: true }
})
