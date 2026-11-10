import { z } from 'zod'
import { eq } from 'drizzle-orm'

/** Links de envio para o vídeo (e a capa) de um exercício. O navegador envia direto ao Storage. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const { videoExt } = await readValidatedBody(event, z.object({ videoExt: z.enum(['mp4', 'webm']) }).parse)
  const db = await useDb()
  const ex = await db.query.exercises.findFirst({ where: (e) => eq(e.id, id), columns: { id: true, slug: true } })
  if (!ex) notFound('Exercício')
  const base = `exercises/${ex.slug}-${Date.now().toString(36)}`
  const [video, poster] = await Promise.all([signedUploadUrl(`${base}.${videoExt}`), signedUploadUrl(`${base}.jpg`)])
  return { video, poster }
})
