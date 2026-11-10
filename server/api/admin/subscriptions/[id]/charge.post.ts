import { and, eq } from 'drizzle-orm'

/**
 * Gera a próxima cobrança de uma assinatura manual (no Asaas as cobranças
 * recorrentes são geradas automaticamente e chegam pelo webhook).
 */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getIdParam(event)
  const db = await useDb()
  const sub = await db.query.subscriptions.findFirst({ where: (s) => eq(s.id, id), with: { price: true, plan: true } })
  if (!sub) notFound('Assinatura')
  if (sub.provider !== 'manual') {
    throw createError({ statusCode: 422, message: 'Cobranças desta assinatura são geradas pelo gateway' })
  }
  const open = await db.query.payments.findFirst({
    where: (p) => and(eq(p.subscriptionId, id), eq(p.status, 'pending')),
  })
  if (open) throw createError({ statusCode: 409, message: 'Já existe uma cobrança pendente' })

  const due = sub.currentPeriodEnd ? todaySP(new Date(sub.currentPeriodEnd)).iso : todaySP().iso
  const [payment] = await db
    .insert(tables.payments)
    .values({ subscriptionId: id, userId: sub.userId, amountCents: sub.price.amountCents, method: 'PIX', dueDate: due })
    .returning()
  await notifyUsers([sub.userId], {
    title: 'Nova mensalidade disponível',
    body: `${sub.plan.name} — ${formatBRL(sub.price.amountCents)} com vencimento em ${formatDate(due)}`,
    url: '/app/aluno/plano',
  })
  return payment
})
