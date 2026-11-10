import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const db = await useDb()
  return db.query.activityLogs.findMany({
    where: (l) => eq(l.alunoId, user.id),
    orderBy: (l) => [desc(l.performedAt)],
    limit: 100,
    with: { workout: { columns: { id: true, title: true } }, runSession: true },
  })
})
