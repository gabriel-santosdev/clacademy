import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

/** Define o professor responsável pelo aluno (null = sem professor). */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const { coachId } = await readValidatedBody(event, z.object({ coachId: z.number().int().positive().nullable() }).parse)
  const db = await useDb()
  const [u] = await db
    .update(tables.users)
    .set({ coachId })
    .where(and(eq(tables.users.id, id), eq(tables.users.role, 'aluno')))
    .returning({ id: tables.users.id })
  if (!u) notFound('Aluno')
  return { ok: true }
})
