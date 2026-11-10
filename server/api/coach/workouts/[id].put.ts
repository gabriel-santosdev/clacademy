import { eq } from 'drizzle-orm'

/** Substitui o treino inteiro (dados + lista de exercícios). */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const { items, ...data } = await readValidatedBody(event, workoutSchema.parse)
  const db = await useDb()
  return db.transaction(async (tx) => {
    const [w] = await tx.update(tables.workouts).set(data).where(eq(tables.workouts.id, id)).returning()
    if (!w) notFound('Treino')
    await tx.delete(tables.workoutItems).where(eq(tables.workoutItems.workoutId, id))
    if (items.length) {
      await tx
        .insert(tables.workoutItems)
        .values(items.map((it, position) => ({ ...it, videoUrl: it.videoUrl || null, workoutId: id, position })))
    }
    return w
  })
})
