/**
 * Webhook do Strava: chega uma chamada a cada atividade criada, editada ou apagada
 * (inclusive as que vieram do relógio). Sempre responde 200 para o Strava não reenviar
 * em loop; a importação é idempotente, então uma nova tentativa não duplica nada.
 */
export default defineEventHandler(async (event) => {
  if (!stravaConfigured()) return { ok: true }
  const evt = await readBody<StravaWebhookEvent>(event)
  if (!evt?.object_type || !evt.owner_id) return { ok: true }

  const { subscriptionId } = await getStravaWebhook()
  if (subscriptionId && evt.subscription_id !== subscriptionId) return { ok: true }

  try {
    await handleStravaEvent(evt)
  } catch (e) {
    console.error('[strava] falha ao processar evento', evt.aspect_type, evt.object_type, evt.object_id, e)
  }
  return { ok: true }
})
