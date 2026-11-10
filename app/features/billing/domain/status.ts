import type { ApiResponse } from '~/utils/api'

/** Regras de status de assinatura/cobrança e sua apresentação. Puro. */

export type MySubscription = ApiResponse<'/api/me/subscription'>
export type Severity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'

const SUBSCRIPTION: Record<string, Severity> = { active: 'success', trialing: 'info', pending: 'warn', past_due: 'danger', canceled: 'secondary' }
const PAYMENT: Record<string, Severity> = { paid: 'success', pending: 'warn', overdue: 'danger', refunded: 'info', canceled: 'secondary' }
const PLAN: Record<string, Severity> = { published: 'success', draft: 'warn', archived: 'secondary' }

export const subscriptionSeverity = (status: string): Severity => SUBSCRIPTION[status] ?? 'secondary'
export const paymentSeverity = (status: string): Severity => PAYMENT[status] ?? 'secondary'
export const planStatusSeverity = (status: string): Severity => PLAN[status] ?? 'secondary'

/** Aluno pode contratar um plano novo? (sem assinatura, pendente ou cancelada) */
export function canSubscribe(sub: { status: string } | null | undefined) {
  return !sub || sub.status === 'pending' || sub.status === 'canceled'
}

/** Cobrança em aberto mais recente. */
export function openPayment<T extends { status: string }>(payments: T[]) {
  return payments.find((p) => p.status === 'pending' || p.status === 'overdue')
}

export function isOpenPayment(status: string) {
  return status === 'pending' || status === 'overdue'
}

export const BILLING_TYPES = [
  { value: 'PIX', label: 'Pix' },
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'CREDIT_CARD', label: 'Cartão de crédito (recorrente)' },
  { value: 'UNDEFINED', label: 'Escolher na fatura' },
] as const
export type BillingType = (typeof BILLING_TYPES)[number]['value']

export const IN_PERSON_METHODS = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'CREDIT_CARD', label: 'Cartão (maquininha)' },
  { value: 'DEBIT_CARD', label: 'Débito' },
]
