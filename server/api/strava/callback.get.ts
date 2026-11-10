/** Volta do OAuth do Strava: salva a conexão e faz a primeira importação. */
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const { code, state, error } = getQuery(event) as Record<string, string | undefined>
  const expected = getCookie(event, 'strava_state')
  deleteCookie(event, 'strava_state', { path: '/' })

  if (error || !code || !state || state !== expected) {
    return sendRedirect(event, '/app/aluno/perfil/integracoes?strava=erro')
  }

  await saveStravaConnection(user.id, await stravaExchangeCode(code))

  try {
    await syncStravaActivities(user.id)
  } catch (e) {
    console.error('[strava] primeira sincronização falhou', e)
  }
  return sendRedirect(event, '/app/aluno/perfil/integracoes?strava=ok')
})
