import { z } from 'zod'

/** Busca no MuscleWiki (inglês) para vincular manualmente um exercício. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const { q } = await getValidatedQuery(event, z.object({ q: z.string().trim().min(2).max(200) }).parse)
  return searchMuscleWiki(q, 12)
})
