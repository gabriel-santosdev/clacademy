import { asc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const db = await useDb()
  const p = await db.query.runPlans.findFirst({
    where: (x) => eq(x.id, id),
    with: { sessions: { orderBy: (s) => [asc(s.week), asc(s.weekday)] } },
  })
  if (!p) notFound('Planilha')
  return p
})
