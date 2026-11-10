import type { PlanStatus } from '#shared/utils/constants'
import type { BillingType } from '../domain/status'

type PlanPayload = ReturnType<typeof planFormToPayload>

export const billingApi = {
  // aluno
  subscribe: (body: { planPriceId: number; billingType: BillingType; cpf?: string }) =>
    $fetch('/api/me/subscribe', { method: 'POST', body }),
  cancelSubscription: () => $fetch('/api/me/subscription/cancel', { method: 'POST' }),

  // admin — planos
  getPlan: (id: number) => $fetch(`/api/admin/plans/${id}`),
  createPlan: (body: PlanPayload) => $fetch('/api/admin/plans', { method: 'POST', body }),
  updatePlan: (id: number, body: PlanPayload) => $fetch(`/api/admin/plans/${id}`, { method: 'PATCH', body }),
  setPlanStatus: (id: number, status: PlanStatus) => $fetch(`/api/admin/plans/${id}`, { method: 'PATCH', body: { status } }),
  deletePlan: (id: number) => $fetch(`/api/admin/plans/${id}`, { method: 'DELETE' }),

  // admin — financeiro
  updatePayment: (id: number, action: 'confirm' | 'cancel' | 'overdue') =>
    $fetch(`/api/admin/payments/${id}`, { method: 'PATCH', body: { action } }),
  chargeNext: (subscriptionId: number) => $fetch(`/api/admin/subscriptions/${subscriptionId}/charge`, { method: 'POST' }),
  enroll: (body: { userId: number; planPriceId: number; markPaid: boolean; method: string }) =>
    $fetch('/api/admin/subscriptions', { method: 'POST', body }),
}
