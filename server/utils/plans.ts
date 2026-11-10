import { z } from 'zod'
import { and, eq, max } from 'drizzle-orm'

export const planSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().max(140).optional(),
  description: z.string().trim().max(2000).nullish(),
  modality: z.enum(MODALITIES),
  features: z.array(z.string().trim().min(1).max(200)).max(30).default([]),
  status: z.enum(PLAN_STATUSES).optional(),
  highlight: z.boolean().optional(),
  trialDays: z.number().int().min(0).max(90).optional(),
  classesPerWeek: z.number().int().min(0).max(14).nullish(),
  sortOrder: z.number().int().min(0).max(999).optional(),
})

export const pricesSchema = z
  .array(z.object({ interval: z.enum(INTERVALS), amountCents: z.number().int().min(100).max(10_000_000) }))
  .max(INTERVALS.length)
  .refine((arr) => new Set(arr.map((p) => p.interval)).size === arr.length, 'Periodicidade duplicada')

/**
 * Sincroniza preços com versionamento: valor alterado → desativa a versão
 * atual e cria uma nova; periodicidade removida → desativa. Assinantes
 * existentes permanecem no preço que contrataram.
 */
export async function syncPlanPrices(planId: number, prices: z.infer<typeof pricesSchema>) {
  const db = await useDb()
  const current = await db.query.planPrices.findMany({
    where: (p) => and(eq(p.planId, planId), eq(p.active, true)),
  })
  for (const cur of current) {
    const next = prices.find((p) => p.interval === cur.interval)
    if (!next || next.amountCents !== cur.amountCents) {
      await db.update(tables.planPrices).set({ active: false }).where(eq(tables.planPrices.id, cur.id))
    }
  }
  for (const p of prices) {
    const cur = current.find((c) => c.interval === p.interval)
    if (cur && cur.amountCents === p.amountCents) continue
    const v = (await db
      .select({ v: max(tables.planPrices.version) })
      .from(tables.planPrices)
      .where(and(eq(tables.planPrices.planId, planId), eq(tables.planPrices.interval, p.interval))))[0]?.v ?? 0
    await db.insert(tables.planPrices).values({ planId, ...p, version: (v ?? 0) + 1 })
  }
}

export async function uniquePlanSlug(base: string, ignoreId?: number) {
  const db = await useDb()
  const root = slugify(base) || 'plano'
  let slug = root
  for (let i = 2; ; i++) {
    const hit = await db.query.plans.findFirst({ where: (p) => eq(p.slug, slug) })
    if (!hit || hit.id === ignoreId) return slug
    slug = `${root}-${i}`
  }
}
