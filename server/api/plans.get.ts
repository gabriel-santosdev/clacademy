import { asc, eq } from 'drizzle-orm'

/** Vitrine pública: apenas planos publicados com preços ativos. */
export default defineEventHandler(async () => {
  const db = await useDb()
  const plans = await db.query.plans.findMany({
    where: (p) => eq(p.status, 'published'),
    orderBy: (p) => [asc(p.sortOrder), asc(p.id)],
    with: { prices: { where: (pr) => eq(pr.active, true), orderBy: (pr) => [asc(pr.amountCents)] } },
  })
  return plans
    .filter((p) => p.prices.length)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      modality: p.modality,
      features: p.features,
      highlight: p.highlight,
      trialDays: p.trialDays,
      classesPerWeek: p.classesPerWeek,
      prices: p.prices.map((pr) => ({ id: pr.id, interval: pr.interval, amountCents: pr.amountCents })),
    }))
})
