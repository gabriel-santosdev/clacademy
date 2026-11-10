import { z } from 'zod'
import { and, eq, inArray } from 'drizzle-orm'

const body = z.object({
  userId: z.number().int().positive(),
  planPriceId: z.number().int().positive(),
  markPaid: z.boolean().default(false),
  method: z.string().max(30).default('PIX'),
})

/** Matrícula feita pelo admin (presencial). Usa sempre cobrança manual. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const data = await readValidatedBody(event, body.parse)
  const db = await useDb()

  const user = await db.query.users.findFirst({ where: (u) => and(eq(u.id, data.userId), eq(u.role, 'aluno')) })
  if (!user) notFound('Aluno')
  const price = await db.query.planPrices.findFirst({ where: (p) => eq(p.id, data.planPriceId), with: { plan: true } })
  if (!price) notFound('Preço')

  // encerra assinaturas vigentes (troca de plano)
  await db
    .update(tables.subscriptions)
    .set({ status: 'canceled', canceledAt: new Date() })
    .where(
      and(eq(tables.subscriptions.userId, user.id), inArray(tables.subscriptions.status, ['pending', 'trialing', 'active', 'past_due'])),
    )

  const [sub] = await db
    .insert(tables.subscriptions)
    .values({ userId: user.id, planId: price.planId, planPriceId: price.id, status: 'pending', provider: 'manual' })
    .returning()
  const [payment] = await db
    .insert(tables.payments)
    .values({
      subscriptionId: sub!.id,
      userId: user.id,
      amountCents: price.amountCents,
      method: data.method,
      dueDate: todaySP().iso,
    })
    .returning()

  if (data.markPaid) await confirmPayment(payment!.id, { method: data.method })
  else {
    await notifyUsers([user.id], {
      title: 'Matrícula realizada',
      body: `Plano ${price.plan.name} aguardando pagamento.`,
      url: '/app/aluno/plano',
    })
  }
  return { subscriptionId: sub!.id }
})
