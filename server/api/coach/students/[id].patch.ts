import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

const body = z
  .object({
    /** professor responsável (null = sem professor) */
    coachId: z.number().int().positive().nullable().optional(),
    /** perfil de treino, usado para sugerir fichas */
    trainingLevel: z.enum(TRAINING_LEVELS).nullable().optional(),
    trainingGoal: z.enum(TRAINING_GOALS).nullable().optional(),
  })
  .refine((b) => Object.keys(b).length > 0, 'Nada para atualizar')

/** Atualiza o professor responsável e/ou o perfil de treino do aluno. */
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const data = await readValidatedBody(event, body.parse)
  const db = await useDb()
  const [u] = await db
    .update(tables.users)
    .set(data)
    .where(and(eq(tables.users.id, id), eq(tables.users.role, 'aluno')))
    .returning({ id: tables.users.id })
  if (!u) notFound('Aluno')
  return { ok: true }
})
