import { asc, count, desc, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await useDb()
  const plans = await db.query.plans.findMany({
    orderBy: (p) => [asc(p.sortOrder), asc(p.id)],
    with: { prices: { orderBy: (pr) => [desc(pr.active), asc(pr.interval), desc(pr.version)] } },
  })
  const counts = await db
    .select({ planId: tables.subscriptions.planId, n: count() })
    .from(tables.subscriptions)
    .where(inArray(tables.subscriptions.status, ['trialing', 'active', 'past_due']))
    .groupBy(tables.subscriptions.planId)
  return plans.map((p) => ({ ...p, activeSubscribers: counts.find((c) => c.planId === p.id)?.n ?? 0 }))
})
