import { z } from 'zod'

/** Vincula (ou desvincula, com null) um exercício a um vídeo do MuscleWiki. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const { externalId } = await readValidatedBody(event, z.object({ externalId: z.number().int().positive().nullable() }).parse)
  const ex = await linkExercise(id, externalId)
  return { ok: true, videos: ex?.videos.length ?? 0 }
})
