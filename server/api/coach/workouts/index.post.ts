export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const { items, ...data } = await readValidatedBody(event, workoutSchema.parse)
  const db = await useDb()
  return db.transaction(async (tx) => {
    const [w] = await tx.insert(tables.workouts).values({ ...data, createdBy: me.id }).returning()
    if (items.length) {
      await tx
        .insert(tables.workoutItems)
        .values(items.map((it, position) => ({ ...it, videoUrl: it.videoUrl || null, workoutId: w!.id, position })))
    }
    return w
  })
})
