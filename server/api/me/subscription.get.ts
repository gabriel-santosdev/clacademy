import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const db = await useDb()
  const sub = await getCurrentSubscription(user.id)
  const payments = await db.query.payments.findMany({
    where: (p) => eq(p.userId, user.id),
    orderBy: (p) => [desc(p.createdAt)],
    limit: 24,
  })
  const settings = await getSettings()
  return {
    subscription: sub ? { ...sub, hasAccess: subscriptionGivesAccess(sub) } : null,
    payments,
    provider: useRuntimeConfig().payment.provider,
    manual: { pixKey: settings.pixKey, instructions: settings.paymentInstructions, whatsapp: settings.whatsapp },
  }
})
