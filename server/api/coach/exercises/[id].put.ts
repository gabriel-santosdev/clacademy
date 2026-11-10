import { eq } from 'drizzle-orm'

/** Edita um exercício (inclusive os do catálogo, ex.: para trocar a foto ou incluir um vídeo próprio). */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, exerciseSchema.parse)
  const db = await useDb()
  const [ex] = await db
    .update(tables.exercises)
    .set({ ...data, videoUrl: data.videoUrl || null, instructions: data.instructions || null })
    .where(eq(tables.exercises.id, id))
    .returning()
  if (!ex) notFound('Exercício')
  return ex
})
