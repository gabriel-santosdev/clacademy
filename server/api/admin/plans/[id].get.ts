import { asc, desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getIdParam(event)
  const db = await useDb()
  const plan = await db.query.plans.findFirst({
    where: (p) => eq(p.id, id),
    with: { prices: { orderBy: (pr) => [asc(pr.interval), desc(pr.version)] } },
  })
  if (!plan) notFound('Plano')
  return plan
})
