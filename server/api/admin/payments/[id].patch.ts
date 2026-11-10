import { z } from 'zod'

/** Baixa manual (Pix/dinheiro na recepção) ou cancelamento de cobrança. */
export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getIdParam(event)
  const { action, method } = await readValidatedBody(
    event,
    z.object({ action: z.enum(['confirm', 'cancel', 'overdue']), method: z.string().max(30).optional() }).parse,
  )
  if (action === 'confirm') await confirmPayment(id, { method })
  else await markPaymentStatus(id, action === 'cancel' ? 'canceled' : 'overdue')
  return { ok: true }
})
