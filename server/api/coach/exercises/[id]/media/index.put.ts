import { z } from 'zod'
import { eq } from 'drizzle-orm'

/** Grava o vídeo enviado (e a capa) no exercício, apagando os arquivos anteriores do Storage. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const { videoUrl, posterUrl } = await readValidatedBody(
    event,
    z.object({ videoUrl: z.string().url().max(500).nullable(), posterUrl: z.string().url().max(500).nullable() }).parse,
  )
  const db = await useDb()
  const before = await db.query.exercises.findFirst({ where: (e) => eq(e.id, id) })
  if (!before) notFound('Exercício')
  const [ex] = await db
    .update(tables.exercises)
    .set({ videoUrl, images: posterUrl ? [posterUrl] : [] })
    .where(eq(tables.exercises.id, id))
    .returning()
  await removeMedia([before.videoUrl, ...before.images].filter((u) => u !== videoUrl && u !== posterUrl))
  return ex
})
