import { and, eq, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await useDb()
  await db
    .update(tables.notifications)
    .set({ readAt: new Date() })
    .where(and(eq(tables.notifications.userId, user.id), isNull(tables.notifications.readAt)))
  return { ok: true }
})
