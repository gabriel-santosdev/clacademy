// POST /api/admin/plans — cria um plano (rascunho por padrão) com seus preços.
const createPlanBody = planSchema.extend({ prices: pricesSchema.default([]) })

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { prices, ...data } = await readValidatedBody(event, createPlanBody.parse)
  const status = data.status ?? 'draft'
  if (status === 'published' && prices.length === 0) {
    throw createError({ statusCode: 422, message: 'Defina ao menos um preço antes de publicar' })
  }

  const db = await useDb()
  const slug = await uniquePlanSlug(data.slug || data.name)
  const [plan] = await db
    .insert(tables.plans)
    .values({ ...data, status, slug, publishedAt: status === 'published' ? new Date() : null })
    .returning()

  await syncPlanPrices(plan!.id, prices)
  return plan
})
