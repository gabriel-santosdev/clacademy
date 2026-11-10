import { and, desc, eq, inArray } from 'drizzle-orm'
import { INTERVAL_MONTHS, type BillingInterval } from '#shared/utils/constants'

type Sub = typeof tables.subscriptions.$inferSelect

export function addMonths(d: Date, months: number) {
  const r = new Date(d)
  r.setMonth(r.getMonth() + months)
  return r
}

/** Assinatura que dá acesso ao app (ativa, em teste, em atraso com tolerância, ou cancelada mas dentro do período pago). */
export function subscriptionGivesAccess(sub: Pick<Sub, 'status' | 'currentPeriodEnd'>, graceDays = 5) {
  const now = Date.now()
  const end = sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).getTime() : 0
  switch (sub.status) {
    case 'active':
    case 'trialing':
      return true
    case 'past_due':
      return end + graceDays * 864e5 > now
    case 'canceled':
      return end > now
    default:
      return false
  }
}

export async function getCurrentSubscription(userId: number) {
  const db = await useDb()
  return db.query.subscriptions.findFirst({
    where: (s) => and(eq(s.userId, userId), inArray(s.status, ['pending', 'trialing', 'active', 'past_due', 'canceled'])),
    orderBy: (s) => [desc(s.createdAt)],
    with: { plan: true, price: true },
  })
}

export async function userHasAccess(userId: number) {
  const sub = await getCurrentSubscription(userId)
  return !!sub && subscriptionGivesAccess(sub)
}

/**
 * Confirma um pagamento: marca como pago, ativa a assinatura e estende o período.
 * Usado pela baixa manual (admin) e pelos webhooks do gateway. Idempotente.
 */
export async function confirmPayment(paymentId: number, opts: { paidAt?: Date; method?: string } = {}) {
  const db = await useDb()
  const payment = await db.query.payments.findFirst({
    where: (p) => eq(p.id, paymentId),
    with: { subscription: { with: { price: true, plan: true } } },
  })
  if (!payment) return
  if (payment.status === 'paid') return payment

  await db
    .update(tables.payments)
    .set({ status: 'paid', paidAt: opts.paidAt ?? new Date(), method: opts.method ?? payment.method })
    .where(eq(tables.payments.id, paymentId))

  const sub = payment.subscription
  const months = INTERVAL_MONTHS[sub.price.interval as BillingInterval]
  const base = sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) > new Date() ? new Date(sub.currentPeriodEnd) : new Date()
  await db
    .update(tables.subscriptions)
    .set({ status: sub.status === 'canceled' ? 'canceled' : 'active', currentPeriodEnd: addMonths(base, months) })
    .where(eq(tables.subscriptions.id, sub.id))

  await notifyUsers([payment.userId], {
    title: 'Pagamento confirmado ✅',
    body: `Seu plano ${sub.plan.name} está ativo. Bons treinos!`,
    url: '/app/aluno/plano',
  })
  return payment
}

export async function markPaymentStatus(paymentId: number, status: 'overdue' | 'refunded' | 'canceled') {
  const db = await useDb()
  const [p] = await db.update(tables.payments).set({ status }).where(eq(tables.payments.id, paymentId)).returning()
  if (!p) return
  if (status === 'overdue') {
    await db
      .update(tables.subscriptions)
      .set({ status: 'past_due' })
      .where(and(eq(tables.subscriptions.id, p.subscriptionId), eq(tables.subscriptions.status, 'active')))
    await notifyUsers([p.userId], {
      title: 'Mensalidade em atraso',
      body: 'Regularize seu pagamento para continuar acessando seus treinos.',
      url: '/app/aluno/plano',
    })
  }
}
