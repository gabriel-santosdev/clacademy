export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const config = useRuntimeConfig()
  return {
    settings: await getSettings(),
    integrations: {
      paymentProvider: config.payment.provider,
      asaasConfigured: !!config.payment.asaasApiKey,
      asaasWebhook: !!config.payment.asaasWebhookToken,
      push: !!(config.vapidPrivateKey && config.public.vapidPublicKey),
      strava: stravaConfigured(),
      database: config.databaseUrl ? 'postgres' : 'pglite (local)',
    },
  }
})
