import { and, count, desc, eq, isNotNull, max } from 'drizzle-orm'

/** Estado das integrações do aluno: Strava e aparelhos detectados nas corridas importadas. */
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const db = await useDb()
  const conn = await db.query.stravaConnections.findFirst({ where: (c) => eq(c.userId, user.id) })
  const webhook = stravaConfigured() ? await getStravaWebhook() : null

  const fromStrava = and(eq(tables.activityLogs.alunoId, user.id), eq(tables.activityLogs.source, 'strava'))

  const devices = await db
    .select({ name: tables.activityLogs.device, runs: count(), lastAt: max(tables.activityLogs.performedAt) })
    .from(tables.activityLogs)
    .where(and(fromStrava, isNotNull(tables.activityLogs.device)))
    .groupBy(tables.activityLogs.device)
    .orderBy(desc(max(tables.activityLogs.performedAt)))

  const recent = await db.query.activityLogs.findMany({
    where: fromStrava,
    orderBy: (l, { desc }) => [desc(l.performedAt)],
    limit: 6,
  })

  const [{ total } = { total: 0 }] = await db.select({ total: count() }).from(tables.activityLogs).where(fromStrava)

  return {
    strava: {
      available: stravaConfigured(),
      connected: !!conn,
      athleteName: conn?.athleteName ?? null,
      connectedAt: conn?.connectedAt ?? null,
      lastSyncAt: conn?.lastSyncAt ?? null,
      autoSync: !!webhook?.subscriptionId,
      imported: total,
    },
    devices: devices.map((d) => ({ name: d.name!, runs: d.runs, lastAt: d.lastAt })),
    recent,
  }
})
