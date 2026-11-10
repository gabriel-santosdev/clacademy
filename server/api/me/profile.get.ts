import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = await useDb()
  const u = await db.query.users.findFirst({ where: (x) => eq(x.id, user.id) })
  if (!u) notFound('Usuário')
  const strava = await db.query.stravaConnections.findFirst({ where: (c) => eq(c.userId, user.id) })
  return {
    ...publicUser(u),
    strava: strava ? { connected: true, lastSyncAt: strava.lastSyncAt } : { connected: false, lastSyncAt: null },
    stravaAvailable: stravaConfigured(),
  }
})
