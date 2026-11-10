import { and, eq, inArray } from 'drizzle-orm'

/** Cancela a renovação. O acesso segue até o fim do período já pago. */
export default defineEventHandler(async (event) => {
  const user = await requireRole(event, 'aluno')
  const db = await useDb()
  const sub = await db.query.subscriptions.findFirst({
    where: (s) => and(eq(s.userId, user.id), inArray(s.status, ['pending', 'trialing', 'active', 'past_due'])),
  })
  if (!sub) notFound('Assinatura')

  if (sub.providerSubscriptionId) {
    await usePaymentProvider().cancelSubscription(sub.providerSubscriptionId)
  }
  await db
    .update(tables.subscriptions)
    .set({ status: 'canceled', canceledAt: new Date() })
    .where(eq(tables.subscriptions.id, sub.id))
  await db
    .update(tables.payments)
    .set({ status: 'canceled' })
    .where(and(eq(tables.payments.subscriptionId, sub.id), eq(tables.payments.status, 'pending')))
  return { ok: true }
})
