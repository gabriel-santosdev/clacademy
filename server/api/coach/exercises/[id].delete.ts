import { eq } from 'drizzle-orm'

/** Arquiva o exercício: some do banco, mas as fichas que já o usam continuam iguais. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const db = await useDb()
  const [ex] = await db.update(tables.exercises).set({ active: false }).where(eq(tables.exercises.id, id)).returning({ id: tables.exercises.id })
  if (!ex) notFound('Exercício')
  return { ok: true }
})
