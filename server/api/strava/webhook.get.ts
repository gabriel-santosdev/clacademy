/** Verificação do webhook do Strava (chamada uma vez, ao criar a assinatura). */
export default defineEventHandler((event) => {
  const q = getQuery(event) as Record<string, string | undefined>
  if (q['hub.mode'] !== 'subscribe' || !stravaConfigured() || q['hub.verify_token'] !== stravaVerifyToken()) {
    throw createError({ statusCode: 403, message: 'Token de verificação inválido' })
  }
  return { 'hub.challenge': q['hub.challenge'] }
})
