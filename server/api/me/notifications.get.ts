import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await useDb()
  return db.query.notifications.findMany({
    where: (n) => eq(n.userId, user.id),
    orderBy: (n) => [desc(n.createdAt)],
    limit: 50,
  })
})
