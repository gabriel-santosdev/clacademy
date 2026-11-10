import { and, desc, eq, gte, inArray } from 'drizzle-orm'
import { INTERVAL_MONTHS, PAYMENT_STATUSES, type BillingInterval, type PaymentStatus } from '#shared/utils/constants'

/** Indicadores financeiros + lista de cobranças. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const { status } = getQuery(event) as { status?: string }
  const db = await useDb()

  const subs = await db.query.subscriptions.findMany({
    where: (s) => inArray(s.status, ['trialing', 'active', 'past_due']),
    with: { price: true, plan: { columns: { id: true, name: true } } },
  })
  const paying = subs.filter((s) => s.status !== 'trialing')
  const mrrCents = Math.round(
    paying.reduce((sum, s) => sum + s.price.amountCents / INTERVAL_MONTHS[s.price.interval as BillingInterval], 0),
  )

  const byPlan = new Map<number, { name: string; count: number }>()
  for (const s of subs) {
    const e = byPlan.get(s.plan.id) ?? { name: s.plan.name, count: 0 }
    e.count++
    byPlan.set(s.plan.id, e)
  }

  const since = new Date()
  since.setMonth(since.getMonth() - 5, 1)
  since.setHours(0, 0, 0, 0)
  const paid = await db
    .select({ amountCents: tables.payments.amountCents, paidAt: tables.payments.paidAt })
    .from(tables.payments)
    .where(and(eq(tables.payments.status, 'paid'), gte(tables.payments.paidAt, since)))
  const months: { month: string; label: string; totalCents: number }[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(since.getFullYear(), since.getMonth() + i, 1)
    months.push({
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      totalCents: 0,
    })
  }
  for (const p of paid) {
    const d = new Date(p.paidAt!)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const m = months.find((x) => x.month === key)
    if (m) m.totalCents += p.amountCents
  }

  const validStatus = (PAYMENT_STATUSES as readonly string[]).includes(status ?? '') ? (status as PaymentStatus) : null
  const payments = await db.query.payments.findMany({
    where: validStatus ? (p) => eq(p.status, validStatus) : undefined,
    orderBy: (p) => [desc(p.createdAt)],
    limit: 100,
    with: {
      user: { columns: { id: true, name: true, email: true } },
      subscription: { columns: { id: true, status: true }, with: { plan: { columns: { name: true } } } },
    },
  })

  const pendingCount = await db.$count(tables.payments, eq(tables.payments.status, 'pending'))
  const overdueCount = await db.$count(tables.payments, eq(tables.payments.status, 'overdue'))

  return {
    provider: useRuntimeConfig().payment.provider,
    stats: {
      mrrCents,
      activeSubscriptions: subs.filter((s) => s.status === 'active').length,
      trialing: subs.filter((s) => s.status === 'trialing').length,
      pastDue: subs.filter((s) => s.status === 'past_due').length,
      pendingPayments: pendingCount,
      overduePayments: overdueCount,
    },
    byPlan: [...byPlan.values()].sort((a, b) => b.count - a.count),
    revenue: months,
    payments,
  }
})
