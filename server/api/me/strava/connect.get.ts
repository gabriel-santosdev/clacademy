import { randomBytes } from 'node:crypto'

/** Inicia o OAuth do Strava. */
export default defineEventHandler(async (event) => {
  await requireRole(event, 'aluno')
  if (!stravaConfigured()) throw createError({ statusCode: 501, message: 'Integração com Strava não configurada' })
  const state = randomBytes(16).toString('hex')
  setCookie(event, 'strava_state', state, { httpOnly: true, sameSite: 'lax', secure: !import.meta.dev, maxAge: 600, path: '/' })
  const redirectUri = `${getRequestURL(event).origin}/api/strava/callback`
  return sendRedirect(event, stravaAuthorizeUrl(redirectUri, state))
})
