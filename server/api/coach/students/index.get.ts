import { and, asc, desc, eq, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const { mine, q } = getQuery(event) as { mine?: string; q?: string }
  const db = await useDb()

  let alunos = await db.query.users.findMany({
    where: (u) => (mine === '1' ? and(eq(u.role, 'aluno'), eq(u.coachId, me.id)) : eq(u.role, 'aluno')),
    orderBy: (u) => [asc(u.name)],
    columns: { passwordHash: false },
  })
  if (q) {
    const term = q.toLowerCase()
    alunos = alunos.filter((a) => a.name.toLowerCase().includes(term) || a.email.includes(term))
  }
  if (!alunos.length) return []

  const ids = alunos.map((a) => a.id)
  const subs = await db.query.subscriptions.findMany({
    where: (s) => inArray(s.userId, ids),
    orderBy: (s) => [desc(s.createdAt)],
    with: { plan: { columns: { name: true, modality: true } } },
  })
  const lastLogs = await db
    .selectDistinctOn([tables.activityLogs.alunoId], {
      alunoId: tables.activityLogs.alunoId,
      performedAt: tables.activityLogs.performedAt,
    })
    .from(tables.activityLogs)
    .where(inArray(tables.activityLogs.alunoId, ids))
    .orderBy(tables.activityLogs.alunoId, desc(tables.activityLogs.performedAt))
  const coaches = await db.query.users.findMany({
    where: (u) => inArray(u.role, ['admin', 'professor']),
    columns: { id: true, name: true },
  })

  return alunos.map((a) => {
    const sub = subs.find((s) => s.userId === a.id)
    return {
      ...a,
      coachName: coaches.find((c) => c.id === a.coachId)?.name ?? null,
      subscription: sub
        ? { status: sub.status, planName: sub.plan.name, modality: sub.plan.modality, hasAccess: subscriptionGivesAccess(sub) }
        : null,
      lastActivityAt: lastLogs.find((l) => l.alunoId === a.id)?.performedAt ?? null,
    }
  })
})
