import type { BillingInterval, Modality, PlanStatus } from '#shared/utils/constants'
import type { ApiResponse } from '~/utils/api'

/** Regras de planos e preços. Puro. */

export type PublicPlan = ApiResponse<'/api/plans'>[number]
export type AdminPlan = ApiResponse<'/api/admin/plans'>[number]

export interface PriceLike {
  id: number
  interval: BillingInterval
  amountCents: number
}

/** Menor valor mensal equivalente entre as periodicidades ("a partir de"). */
export function startingMonthlyPrice<T extends PriceLike>(prices: T[]) {
  return prices
    .map((p) => ({ ...p, monthlyCents: Math.round(p.amountCents / INTERVAL_MONTHS[p.interval]) }))
    .sort((a, b) => a.monthlyCents - b.monthlyCents)[0]
}

/** Economia percentual de uma periodicidade frente ao mensal (0 se não houver). */
export function savingsVsMonthly<T extends PriceLike>(prices: T[], price: T) {
  const monthly = prices.find((p) => p.interval === 'monthly')
  if (!monthly || price.interval === 'monthly') return 0
  const equivalent = price.amountCents / INTERVAL_MONTHS[price.interval]
  return Math.max(0, Math.round((1 - equivalent / monthly.amountCents) * 100))
}

/* ── editor de plano (admin) ────────────────────────── */

export interface PlanForm {
  name: string
  description: string
  modality: Modality
  features: string[]
  status: PlanStatus
  highlight: boolean
  trialDays: number
  classesPerWeek: number | null
  sortOrder: number
}

/** Preço por periodicidade em reais; null = não oferecido. */
export type PriceForm = Record<BillingInterval, number | null>

export const emptyPlanForm = (): PlanForm => ({
  name: '',
  description: '',
  modality: 'academia',
  features: [''],
  status: 'draft',
  highlight: false,
  trialDays: 0,
  classesPerWeek: null,
  sortOrder: 0,
})

export const emptyPriceForm = (): PriceForm => ({ monthly: null, quarterly: null, semiannual: null, yearly: null })

interface PlanLike extends Omit<PlanForm, 'description' | 'features' | 'modality'> {
  modality: string
  description: string | null
  features: string[]
  prices: { interval: BillingInterval; amountCents: number; active: boolean }[]
}

export function planToForm(p: PlanLike): { form: PlanForm; prices: PriceForm } {
  const prices = emptyPriceForm()
  for (const pr of p.prices.filter((x) => x.active)) prices[pr.interval] = pr.amountCents / 100
  return {
    form: {
      name: p.name,
      description: p.description ?? '',
      /* planos legados (corrida/combo) caem em Personal até o admin escolher */
      modality: isModality(p.modality) ? p.modality : 'academia',
      features: p.features.length ? [...p.features] : [''],
      status: p.status,
      highlight: p.highlight,
      trialDays: p.trialDays,
      classesPerWeek: p.classesPerWeek,
      sortOrder: p.sortOrder,
    },
    prices,
  }
}

export function priceFormToList(prices: PriceForm) {
  return INTERVALS.filter((i) => prices[i] != null && prices[i]! > 0).map((interval) => ({
    interval,
    amountCents: Math.round(prices[interval]! * 100),
  }))
}

export function monthlyEquivalentLabel(prices: PriceForm, interval: BillingInterval) {
  const v = prices[interval]
  if (!v || interval === 'monthly') return ''
  return `${formatBRL(Math.round((v * 100) / INTERVAL_MONTHS[interval]))}/mês`
}

export function planFormToPayload(form: PlanForm, prices: PriceForm, publish = false) {
  return {
    ...form,
    status: publish ? ('published' as const) : form.status,
    description: form.description || null,
    features: form.features.map((f) => f.trim()).filter(Boolean),
    prices: priceFormToList(prices),
  }
}
