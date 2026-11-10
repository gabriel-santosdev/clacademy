import { timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'

interface AsaasPayment {
  id: string
  subscription?: string
  value: number
  billingType: string
  dueDate: string
  invoiceUrl?: string
  paymentDate?: string
  clientPaymentDate?: string
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

/**
 * Webhook do Asaas (configure em Integrações → Webhooks, com o mesmo token
 * de NUXT_PAYMENT_ASAAS_WEBHOOK_TOKEN). Responde 200 sempre que o evento
 * foi entendido, para o Asaas não pausar a fila.
 */
export default defineEventHandler(async (event) => {
  const { payment: cfg } = useRuntimeConfig()
  const token = getHeader(event, 'asaas-access-token') ?? ''
  if (!cfg.asaasWebhookToken || !safeEqual(token, cfg.asaasWebhookToken)) {
    throw createError({ statusCode: 401, message: 'Token inválido' })
  }

  const body = await readBody<{ event: string; payment?: AsaasPayment }>(event)
  const p = body.payment
  if (!p?.subscription) return { ignored: true }

  const db = await useDb()
  const sub = await db.query.subscriptions.findFirst({ where: (s) => eq(s.providerSubscriptionId, p.subscription!) })
  if (!sub) return { ignored: true }

  // garante que o pagamento exista localmente (cobranças recorrentes nascem no Asaas)
  let local = await db.query.payments.findFirst({ where: (x) => eq(x.providerPaymentId, p.id) })
  if (!local) {
    ;[local] = await db
      .insert(tables.payments)
      .values({
        subscriptionId: sub.id,
        userId: sub.userId,
        amountCents: Math.round(p.value * 100),
        method: p.billingType,
        dueDate: p.dueDate,
        invoiceUrl: p.invoiceUrl,
        providerPaymentId: p.id,
      })
      .onConflictDoNothing()
      .returning()
    local ??= await db.query.payments.findFirst({ where: (x) => eq(x.providerPaymentId, p.id) })
  } else if (p.invoiceUrl || p.dueDate) {
    await db
      .update(tables.payments)
      .set({ invoiceUrl: p.invoiceUrl ?? local.invoiceUrl, dueDate: p.dueDate ?? local.dueDate, amountCents: Math.round(p.value * 100) })
      .where(eq(tables.payments.id, local.id))
  }
  if (!local) return { ignored: true }

  switch (body.event) {
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_RECEIVED': {
      const paidAt = p.clientPaymentDate ?? p.paymentDate
      await confirmPayment(local.id, { paidAt: paidAt ? new Date(`${paidAt}T12:00:00-03:00`) : new Date(), method: p.billingType })
      break
    }
    case 'PAYMENT_OVERDUE':
      await markPaymentStatus(local.id, 'overdue')
      break
    case 'PAYMENT_REFUNDED':
    case 'PAYMENT_CHARGEBACK_REQUESTED':
      await markPaymentStatus(local.id, 'refunded')
      break
    case 'PAYMENT_DELETED':
      await markPaymentStatus(local.id, 'canceled')
      break
  }
  return { ok: true }
})
