import { asc, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const db = await useDb()
  return db.query.workouts.findMany({
    orderBy: (w) => [desc(w.updatedAt)],
    with: { items: { orderBy: (i) => [asc(i.position)], with: { exercise: true } } },
  })
})
