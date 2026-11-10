import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const db = await useDb()
  await db.delete(tables.stravaConnections).where(eq(tables.stravaConnections.userId, user.id))
  return { ok: true }
})
