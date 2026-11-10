import { and, desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getIdParam(event)
  const db = await useDb()

  const aluno = await db.query.users.findFirst({
    where: (u) => and(eq(u.id, id), eq(u.role, 'aluno')),
    columns: { passwordHash: false },
  })
  if (!aluno) notFound('Aluno')

  const sub = await getCurrentSubscription(id)
  const assignments = await getAlunoAssignments(id)
  const logs = await db.query.activityLogs.findMany({
    where: (l) => eq(l.alunoId, id),
    orderBy: (l) => [desc(l.performedAt)],
    limit: 50,
    with: { workout: { columns: { title: true } }, runSession: true },
  })
  return {
    aluno,
    subscription: sub ? { ...sub, hasAccess: subscriptionGivesAccess(sub) } : null,
    assignments,
    logs,
  }
})
