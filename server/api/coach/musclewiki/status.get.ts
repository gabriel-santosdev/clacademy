import { and, eq, isNotNull, count } from 'drizzle-orm'

/** Se a integração está ligada e quantos exercícios já têm vídeo vinculado. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const db = await useDb()
  const [linked] = await db
    .select({ value: count() })
    .from(tables.exercises)
    .where(and(eq(tables.exercises.active, true), isNotNull(tables.exercises.externalId)))
  const [total] = await db.select({ value: count() }).from(tables.exercises).where(eq(tables.exercises.active, true))
  // uploads: envio de vídeo próprio (Storage configurado)
  return { enabled: musclewikiEnabled(), uploads: storageEnabled(), linked: linked?.value ?? 0, total: total?.value ?? 0 }
})
