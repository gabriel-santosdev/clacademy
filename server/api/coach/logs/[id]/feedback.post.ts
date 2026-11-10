import { z } from 'zod'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const id = getIdParam(event)
  const { feedback } = await readValidatedBody(event, z.object({ feedback: z.string().trim().min(1).max(2000) }).parse)
  const db = await useDb()
  const [log] = await db
    .update(tables.activityLogs)
    .set({ feedback, feedbackBy: me.id })
    .where(eq(tables.activityLogs.id, id))
    .returning()
  if (!log) notFound('Registro')
  await notifyUsers([log.alunoId], {
    title: `Feedback de ${me.name}`,
    body: feedback.slice(0, 120),
    url: '/app/aluno/historico',
  })
  return log
})
