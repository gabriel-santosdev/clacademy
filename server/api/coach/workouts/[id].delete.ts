import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const db = await useDb()
  await db.delete(tables.workouts).where(eq(tables.workouts.id, id))
  return { ok: true }
})
