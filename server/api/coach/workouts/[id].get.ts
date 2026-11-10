import { asc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const db = await useDb()
  const w = await db.query.workouts.findFirst({
    where: (x) => eq(x.id, id),
    with: { items: { orderBy: (i) => [asc(i.position)] } },
  })
  if (!w) notFound('Treino')
  return w
})
