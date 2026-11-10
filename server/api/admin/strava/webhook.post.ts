/** Liga a sincronização automática (assinatura do webhook do Strava apontando para este site). */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  if (!stravaConfigured()) throw createError({ statusCode: 400, message: 'Configure NUXT_STRAVA_CLIENT_ID e NUXT_STRAVA_CLIENT_SECRET' })
  const origin = useRuntimeConfig().public.siteUrl || getRequestURL(event).origin
  if (/localhost|127\.0\.0\.1|\[::1\]/.test(origin)) {
    throw createError({ statusCode: 400, message: 'O Strava só chama endereços públicos. Ative pelo site publicado.' })
  }
  try {
    const id = await subscribeStravaWebhook(`${origin.replace(/\/$/, '')}/api/strava/webhook`)
    return { subscriptionId: id }
  } catch (e: unknown) {
    const detail = (e as { data?: { errors?: { field?: string; code?: string }[] } }).data?.errors?.[0]
    console.error('[strava] falha ao assinar webhook', e)
    throw createError({ statusCode: 502, message: `O Strava recusou a assinatura${detail ? ` (${detail.field} ${detail.code})` : ''}` })
  }
})
