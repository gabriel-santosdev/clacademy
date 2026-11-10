import { count, eq } from 'drizzle-orm'

/** Exclui planos nunca contratados; os demais são arquivados. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getIdParam(event)
  const db = await useDb()
  const n = (await db.select({ n: count() }).from(tables.subscriptions).where(eq(tables.subscriptions.planId, id)))[0]?.n ?? 0
  if (n > 0) {
    await db.update(tables.plans).set({ status: 'archived' }).where(eq(tables.plans.id, id))
    return { archived: true }
  }
  await db.delete(tables.plans).where(eq(tables.plans.id, id))
  return { deleted: true }
})
