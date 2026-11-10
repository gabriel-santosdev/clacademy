import { eq } from 'drizzle-orm'

const STRAVA = 'https://www.strava.com'

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete?: { id: number }
}

interface StravaActivity {
  id: number
  name: string
  type: string
  sport_type?: string
  distance: number // metros
  moving_time: number // segundos
  start_date: string
}

export function stravaConfigured() {
  const { strava } = useRuntimeConfig()
  return !!(strava.clientId && strava.clientSecret)
}

export function stravaAuthorizeUrl(redirectUri: string, state: string) {
  const { strava } = useRuntimeConfig()
  const q = new URLSearchParams({
    client_id: strava.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
    state,
  })
  return `${STRAVA}/oauth/authorize?${q}`
}

export async function stravaExchangeCode(code: string) {
  const { strava } = useRuntimeConfig()
  return $fetch<TokenResponse>(`${STRAVA}/oauth/token`, {
    method: 'POST',
    body: { client_id: strava.clientId, client_secret: strava.clientSecret, code, grant_type: 'authorization_code' },
  })
}

async function getAccessToken(userId: number) {
  const db = await useDb()
  const conn = await db.query.stravaConnections.findFirst({ where: (c) => eq(c.userId, userId) })
  if (!conn) return null
  if (conn.expiresAt - 60 > Date.now() / 1000) return { token: conn.accessToken, conn }

  const { strava } = useRuntimeConfig()
  const r = await $fetch<TokenResponse>(`${STRAVA}/oauth/token`, {
    method: 'POST',
    body: {
      client_id: strava.clientId,
      client_secret: strava.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: conn.refreshToken,
    },
  })
  await db
    .update(tables.stravaConnections)
    .set({ accessToken: r.access_token, refreshToken: r.refresh_token, expiresAt: r.expires_at })
    .where(eq(tables.stravaConnections.userId, userId))
  return { token: r.access_token, conn }
}

/** Importa corridas recentes do Strava como registros de atividade. Retorna quantas foram importadas. */
export async function syncStravaActivities(userId: number) {
  const auth = await getAccessToken(userId)
  if (!auth) throw createError({ statusCode: 400, message: 'Strava não conectado' })
  const db = await useDb()

  const after = auth.conn.lastSyncAt
    ? Math.floor(new Date(auth.conn.lastSyncAt).getTime() / 1000) - 3600
    : Math.floor(Date.now() / 1000) - 30 * 86400

  const acts = await $fetch<StravaActivity[]>(`${STRAVA}/api/v3/athlete/activities`, {
    headers: { Authorization: `Bearer ${auth.token}` },
    query: { after, per_page: 100 },
  })

  const runs = acts.filter((a) => (a.sport_type ?? a.type).toLowerCase().includes('run'))
  let imported = 0
  for (const a of runs) {
    const km = a.distance / 1000
    const res = await db
      .insert(tables.activityLogs)
      .values({
        alunoId: userId,
        kind: 'corrida',
        title: a.name,
        performedAt: new Date(a.start_date),
        distanceKm: Math.round(km * 100) / 100,
        durationMin: Math.round(a.moving_time / 60),
        avgPaceSec: km > 0 ? Math.round(a.moving_time / km) : null,
        source: 'strava',
        externalId: String(a.id),
      })
      .onConflictDoNothing()
      .returning({ id: tables.activityLogs.id })
    imported += res.length
  }

  await db
    .update(tables.stravaConnections)
    .set({ lastSyncAt: new Date() })
    .where(eq(tables.stravaConnections.userId, userId))
  return imported
}
