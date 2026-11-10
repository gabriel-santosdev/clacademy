import { and, count, eq } from 'drizzle-orm'

const body = planSchema.partial().extend({ prices: pricesSchema.optional() })

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getIdParam(event)
  const { prices, ...data } = await readValidatedBody(event, body.parse)
  const db = await useDb()

  const plan = await db.query.plans.findFirst({ where: (p) => eq(p.id, id) })
  if (!plan) notFound('Plano')

  if (prices) await syncPlanPrices(id, prices)

  if (data.status === 'published') {
    const n = (await db
      .select({ n: count() })
      .from(tables.planPrices)
      .where(and(eq(tables.planPrices.planId, id), eq(tables.planPrices.active, true))))[0]?.n ?? 0
    if (!n) throw createError({ statusCode: 422, message: 'Defina ao menos um preço antes de publicar' })
  }

  const patch: Partial<typeof tables.plans.$inferInsert> = { ...data }
  if (data.slug !== undefined || (data.name && data.name !== plan.name && !data.slug)) {
    patch.slug = await uniquePlanSlug(data.slug || data.name || plan.name, id)
  }
  if (data.status === 'published' && plan.status !== 'published') patch.publishedAt = new Date()

  const [updated] = await db.update(tables.plans).set(patch).where(eq(tables.plans.id, id)).returning()
  return updated
})
