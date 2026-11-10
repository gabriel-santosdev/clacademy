import { eq } from 'drizzle-orm'

/** Encerra a atribuição (mantém histórico de registros). */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const db = await useDb()
  await db.update(tables.assignments).set({ active: false }).where(eq(tables.assignments.id, id))
  return { ok: true }
})
