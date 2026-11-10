import { and, count, desc, eq, gte, isNull } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const db = await useDb()

  const sub = await getCurrentSubscription(user.id)
  const hasAccess = !!sub && subscriptionGivesAccess(sub)
  const today = hasAccess ? await getTodayAgenda(user.id) : { workouts: [], runs: [] }

  const { iso } = todaySP()
  const loggedToday = await db
    .select({ workoutId: tables.activityLogs.workoutId, runSessionId: tables.activityLogs.runSessionId })
    .from(tables.activityLogs)
    .where(and(eq(tables.activityLogs.alunoId, user.id), gte(tables.activityLogs.performedAt, new Date(`${iso}T03:00:00Z`))))

  const recent = await db.query.activityLogs.findMany({
    where: (l) => eq(l.alunoId, user.id),
    orderBy: (l) => [desc(l.performedAt)],
    limit: 5,
  })

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthLogs = await db
    .select()
    .from(tables.activityLogs)
    .where(and(eq(tables.activityLogs.alunoId, user.id), gte(tables.activityLogs.performedAt, monthStart)))

  const unread = (await db
    .select({ unread: count() })
    .from(tables.notifications)
    .where(and(eq(tables.notifications.userId, user.id), isNull(tables.notifications.readAt))))[0]?.unread ?? 0

  const strava = await db.query.stravaConnections.findFirst({ where: (c) => eq(c.userId, user.id), columns: { userId: true } })

  return {
    user: { id: user.id, name: user.name },
    /** treino do relógio dá check-out sozinho quando o Strava está conectado */
    watch: { available: stravaConfigured(), connected: !!strava },
    subscription: sub
      ? { id: sub.id, status: sub.status, planName: sub.plan.name, currentPeriodEnd: sub.currentPeriodEnd }
      : null,
    hasAccess,
    today,
    done: {
      workoutIds: loggedToday.map((l) => l.workoutId).filter(Boolean),
      runSessionIds: loggedToday.map((l) => l.runSessionId).filter(Boolean),
    },
    month: {
      sessions: monthLogs.length,
      km: Math.round(monthLogs.reduce((s, l) => s + (l.distanceKm ?? 0), 0) * 10) / 10,
      minutes: monthLogs.reduce((s, l) => s + (l.durationMin ?? 0), 0),
    },
    recent,
    unread,
  }
})
