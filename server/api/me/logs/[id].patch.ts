import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const body = z.object({
  rpe: z.number().int().min(1).max(10).nullable().optional(),
  notes: z.string().trim().max(1000).nullable().optional(),
})

/** O aluno completa um registro (ex.: corrida importada do relógio): esforço e observações. */
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, message: 'Registro inválido' })
  const data = await readValidatedBody(event, body.parse)

  const db = await useDb()
  const [log] = await db
    .update(tables.activityLogs)
    .set({ ...(data.rpe !== undefined ? { rpe: data.rpe } : {}), ...(data.notes !== undefined ? { notes: data.notes || null } : {}) })
    .where(and(eq(tables.activityLogs.id, id), eq(tables.activityLogs.alunoId, user.id)))
    .returning()
  if (!log) notFound('Registro')
  return log
})
