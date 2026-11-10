import { z } from 'zod'
import { and, eq, inArray } from 'drizzle-orm'

const body = z.object({
  planPriceId: z.number().int().positive(),
  billingType: z.enum(['PIX', 'BOLETO', 'CREDIT_CARD', 'UNDEFINED']).default('UNDEFINED'),
  cpf: z.string().trim().optional(),
})

export default defineEventHandler(async (event) => {
  const session = await requireRole(event, 'aluno')
  const data = await readValidatedBody(event, body.parse)
  const db = await useDb()

  const price = await db.query.planPrices.findFirst({
    where: (p) => and(eq(p.id, data.planPriceId), eq(p.active, true)),
    with: { plan: true },
  })
  if (!price || price.plan.status !== 'published') notFound('Plano')

  const current = await db.query.subscriptions.findFirst({
    where: (s) => and(eq(s.userId, session.id), inArray(s.status, ['trialing', 'active', 'past_due'])),
  })
  if (current) throw createError({ statusCode: 409, message: 'Você já possui uma assinatura ativa. Cancele-a para trocar de plano.' })

  // assinaturas pendentes anteriores (não pagas) são descartadas
  await db
    .update(tables.subscriptions)
    .set({ status: 'canceled', canceledAt: new Date() })
    .where(and(eq(tables.subscriptions.userId, session.id), eq(tables.subscriptions.status, 'pending')))

  if (data.cpf) {
    await db.update(tables.users).set({ cpf: data.cpf.replace(/\D/g, '') }).where(eq(tables.users.id, session.id))
  }
  const user = (await db.query.users.findFirst({ where: (u) => eq(u.id, session.id) }))!

  const trial = price.plan.trialDays > 0
  const firstDue = todaySP(new Date(Date.now() + price.plan.trialDays * 864e5)).iso

  const [sub] = await db
    .insert(tables.subscriptions)
    .values({
      userId: user.id,
      planId: price.planId,
      planPriceId: price.id,
      status: trial ? 'trialing' : 'pending',
      currentPeriodEnd: trial ? new Date(`${firstDue}T23:59:59-03:00`) : null,
    })
    .returning()

  const provider = usePaymentProvider()
  let result
  try {
    result = await provider.createSubscription({
      user,
      plan: price.plan,
      price,
      billingType: data.billingType,
      firstDueDate: firstDue,
      subscriptionId: sub!.id,
    })
  } catch (err) {
    await db.delete(tables.subscriptions).where(eq(tables.subscriptions.id, sub!.id))
    throw err
  }

  await db
    .update(tables.subscriptions)
    .set({
      provider: provider.name,
      providerCustomerId: result.providerCustomerId,
      providerSubscriptionId: result.providerSubscriptionId,
    })
    .where(eq(tables.subscriptions.id, sub!.id))

  let payment = null
  if (result.firstPayment) {
    ;[payment] = await db
      .insert(tables.payments)
      .values({
        subscriptionId: sub!.id,
        userId: user.id,
        amountCents: result.firstPayment.amountCents,
        dueDate: result.firstPayment.dueDate,
        method: result.firstPayment.method,
        invoiceUrl: result.firstPayment.invoiceUrl,
        providerPaymentId: result.firstPayment.providerPaymentId,
      })
      .onConflictDoNothing()
      .returning()
  }
  // no Asaas, quem envia a cobrança por e-mail é o próprio Asaas
  if (payment && provider.name === 'manual') {
    await sendEmail({
      to: user.email,
      ...emailTemplates.newCharge(user.name, price.plan.name, formatBRL(payment.amountCents), formatDate(payment.dueDate)),
    })
  }

  const admins = await db.select({ id: tables.users.id }).from(tables.users).where(eq(tables.users.role, 'admin'))
  await notifyUsers(
    admins.map((a) => a.id),
    { title: 'Nova assinatura', body: `${user.name} assinou ${price.plan.name}`, url: '/app/admin/financeiro' },
  )

  return { subscriptionId: sub!.id, status: sub!.status, invoiceUrl: payment?.invoiceUrl ?? null, provider: provider.name }
})
