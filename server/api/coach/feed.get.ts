import { and, count, desc, eq, gte, inArray, isNull } from 'drizzle-orm'

/** Atividades recentes dos alunos + indicadores do professor. */
export default defineEventHandler(async (event) => {
  const me = await requireStaff(event)
  const { mine } = getQuery(event) as { mine?: string }
  const db = await useDb()

  const myAlunos = await db
    .select({ id: tables.users.id })
    .from(tables.users)
    .where(and(eq(tables.users.role, 'aluno'), eq(tables.users.coachId, me.id)))
  const myIds = myAlunos.map((a) => a.id)

  const filter = mine === '1' ? (myIds.length ? inArray(tables.activityLogs.alunoId, myIds) : undefined) : undefined
  if (mine === '1' && !myIds.length) {
    return { logs: [], stats: { myStudents: 0, weekLogs: 0, pendingFeedback: 0 } }
  }

  const logs = await db.query.activityLogs.findMany({
    where: filter ? () => filter : undefined,
    orderBy: (l) => [desc(l.performedAt)],
    limit: 40,
    with: {
      aluno: { columns: { id: true, name: true } },
      workout: { columns: { title: true } },
      runSession: true,
    },
  })

  const weekAgo = new Date(Date.now() - 7 * 864e5)
  const weekLogs = (await db
    .select({ weekLogs: count() })
    .from(tables.activityLogs)
    .where(and(gte(tables.activityLogs.performedAt, weekAgo), filter)))[0]?.weekLogs ?? 0
  const pending = (await db
    .select({ pending: count() })
    .from(tables.activityLogs)
    .where(and(isNull(tables.activityLogs.feedback), gte(tables.activityLogs.performedAt, weekAgo), filter)))[0]?.pending ?? 0

  return { logs, stats: { myStudents: myIds.length, weekLogs, pendingFeedback: pending } }
})
