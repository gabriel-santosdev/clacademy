/** Cria um exercício da equipe. */
export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const data = await readValidatedBody(event, exerciseSchema.parse)
  const db = await useDb()
  const base = slugify(data.name) || 'exercicio'
  const slug = `${base}-${Date.now().toString(36)}`
  const [ex] = await db
    .insert(tables.exercises)
    .values({ ...data, videoUrl: data.videoUrl || null, instructions: data.instructions || null, slug, source: 'equipe', createdBy: me.id })
    .returning()
  return ex
})
