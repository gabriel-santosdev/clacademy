import type { BillingInterval } from '#shared/utils/constants'

/**
 * Abstração de gateway de pagamento. Hoje: "manual" (Pix/dinheiro com baixa
 * pelo admin) e "asaas" (Pix, boleto e cartão recorrente). Para trocar de
 * gateway basta implementar esta interface.
 */
export type BillingType = 'PIX' | 'BOLETO' | 'CREDIT_CARD' | 'UNDEFINED'

export interface CreateSubscriptionInput {
  user: { id: number; name: string; email: string; cpf: string | null; phone: string | null }
  plan: { id: number; name: string }
  price: { id: number; amountCents: number; interval: BillingInterval }
  billingType: BillingType
  firstDueDate: string // YYYY-MM-DD
  subscriptionId: number
}

export interface ProviderPayment {
  providerPaymentId: string | null
  amountCents: number
  dueDate: string
  invoiceUrl: string | null
  method: string | null
}

export interface CreateSubscriptionResult {
  providerCustomerId: string | null
  providerSubscriptionId: string | null
  firstPayment: ProviderPayment | null
}

export interface PaymentProvider {
  name: 'manual' | 'asaas'
  createSubscription(input: CreateSubscriptionInput): Promise<CreateSubscriptionResult>
  cancelSubscription(providerSubscriptionId: string): Promise<void>
}

const manualProvider: PaymentProvider = {
  name: 'manual',
  async createSubscription(input) {
    return {
      providerCustomerId: null,
      providerSubscriptionId: null,
      firstPayment: {
        providerPaymentId: null,
        amountCents: input.price.amountCents,
        dueDate: input.firstDueDate,
        invoiceUrl: null,
        method: input.billingType === 'UNDEFINED' ? 'PIX' : input.billingType,
      },
    }
  },
  async cancelSubscription() {},
}

const ASAAS_CYCLE: Record<BillingInterval, string> = {
  monthly: 'MONTHLY',
  quarterly: 'QUARTERLY',
  semiannual: 'SEMIANNUALLY',
  yearly: 'YEARLY',
}

function asaasProvider(apiKey: string, sandbox: boolean): PaymentProvider {
  const baseURL = sandbox ? 'https://api-sandbox.asaas.com/v3' : 'https://api.asaas.com/v3'
  const api = $fetch.create({
    baseURL,
    headers: { access_token: apiKey, 'User-Agent': 'clacademy-app' },
  })

  return {
    name: 'asaas',
    async createSubscription(input) {
      if (!input.user.cpf) {
        throw createError({ statusCode: 422, message: 'Informe seu CPF para assinar.' })
      }
      const customer = await api<{ id: string }>('/customers', {
        method: 'POST',
        body: {
          name: input.user.name,
          email: input.user.email,
          cpfCnpj: input.user.cpf.replace(/\D/g, ''),
          mobilePhone: input.user.phone?.replace(/\D/g, '') || undefined,
          externalReference: `user:${input.user.id}`,
        },
      })
      const sub = await api<{ id: string }>('/subscriptions', {
        method: 'POST',
        body: {
          customer: customer.id,
          billingType: input.billingType,
          value: input.price.amountCents / 100,
          nextDueDate: input.firstDueDate,
          cycle: ASAAS_CYCLE[input.price.interval],
          description: `CL Academy — ${input.plan.name}`,
          externalReference: `subscription:${input.subscriptionId}`,
        },
      })
      const list = await api<{
        data: { id: string; value: number; dueDate: string; invoiceUrl: string; billingType: string }[]
      }>(`/subscriptions/${sub.id}/payments`)
      const first = list.data[0]
      return {
        providerCustomerId: customer.id,
        providerSubscriptionId: sub.id,
        firstPayment: first
          ? {
              providerPaymentId: first.id,
              amountCents: Math.round(first.value * 100),
              dueDate: first.dueDate,
              invoiceUrl: first.invoiceUrl,
              method: first.billingType,
            }
          : null,
      }
    },
    async cancelSubscription(id) {
      await api(`/subscriptions/${id}`, { method: 'DELETE' })
    },
  }
}

export function usePaymentProvider(): PaymentProvider {
  const { payment } = useRuntimeConfig()
  if (payment.provider === 'asaas') {
    const sandbox = String(payment.asaasSandbox) !== 'false'
    // compatível com configs antigas, que punham a chave de teste em asaasApiKey
    const apiKey = sandbox ? payment.asaasSandboxApiKey || payment.asaasApiKey : payment.asaasApiKey
    if (!apiKey) throw createError({ statusCode: 500, message: 'Asaas não configurado' })
    return asaasProvider(apiKey, sandbox)
  }
  return manualProvider
}
