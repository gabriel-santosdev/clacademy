import { asc, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const db = await useDb()
  return db.query.runPlans.findMany({
    orderBy: (p) => [desc(p.updatedAt)],
    with: { sessions: { orderBy: (s) => [asc(s.week), asc(s.weekday)] } },
  })
})
