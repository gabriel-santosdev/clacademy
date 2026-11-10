export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const { code, state, error } = getQuery(event) as Record<string, string | undefined>
  const expected = getCookie(event, 'strava_state')
  deleteCookie(event, 'strava_state', { path: '/' })

  if (error || !code || !state || state !== expected) {
    return sendRedirect(event, '/app/aluno/perfil?strava=erro')
  }

  const token = await stravaExchangeCode(code)
  const db = await useDb()
  const values = {
    userId: user.id,
    athleteId: String(token.athlete?.id ?? ''),
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: token.expires_at,
  }
  await db
    .insert(tables.stravaConnections)
    .values(values)
    .onConflictDoUpdate({ target: tables.stravaConnections.userId, set: values })

  try {
    await syncStravaActivities(user.id)
  } catch (e) {
    console.error('[strava] primeira sincronização falhou', e)
  }
  return sendRedirect(event, '/app/aluno/perfil?strava=ok')
})
