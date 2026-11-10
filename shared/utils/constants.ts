// Constantes e rótulos compartilhados entre app (Vue) e server (Nitro).

export const ROLES = ['admin', 'professor', 'aluno'] as const
export type Role = (typeof ROLES)[number]

/** Modalidades vendidas hoje: personal ('academia') e assessoria de corrida. */
export const MODALITIES = ['academia', 'assessoria'] as const
export type Modality = (typeof MODALITIES)[number]
/** Valores antigos ainda possíveis no banco (planos arquivados). Não oferecer em formulários. */
export const LEGACY_MODALITIES = ['corrida', 'combo'] as const
export type PlanModality = Modality | (typeof LEGACY_MODALITIES)[number]

export function isModality(v: string): v is Modality {
  return (MODALITIES as readonly string[]).includes(v)
}

export const PLAN_STATUSES = ['draft', 'published', 'archived'] as const
export type PlanStatus = (typeof PLAN_STATUSES)[number]

export const INTERVALS = ['monthly', 'quarterly', 'semiannual', 'yearly'] as const
export type BillingInterval = (typeof INTERVALS)[number]

export const SUBSCRIPTION_STATUSES = ['pending', 'trialing', 'active', 'past_due', 'canceled'] as const
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number]

export const PAYMENT_STATUSES = ['pending', 'paid', 'overdue', 'refunded', 'canceled'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const RUN_TYPES = ['rodagem', 'intervalado', 'longao', 'regenerativo', 'tiro', 'fartlek', 'prova'] as const
export type RunType = (typeof RUN_TYPES)[number]

export const LABELS = {
  role: { admin: 'Admin', professor: 'Professor', aluno: 'Aluno' } as Record<Role, string>,
  modality: {
    academia: 'Personal',
    assessoria: 'Assessoria de corrida',
    corrida: 'Corrida',
    combo: 'Combo',
  } as Record<PlanModality, string>,
  planStatus: { draft: 'Rascunho', published: 'Publicado', archived: 'Arquivado' } as Record<PlanStatus, string>,
  interval: {
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    yearly: 'Anual',
  } as Record<BillingInterval, string>,
  intervalShort: { monthly: '/mês', quarterly: '/trimestre', semiannual: '/semestre', yearly: '/ano' } as Record<
    BillingInterval,
    string
  >,
  subscriptionStatus: {
    pending: 'Aguardando pagamento',
    trialing: 'Período de teste',
    active: 'Ativa',
    past_due: 'Em atraso',
    canceled: 'Cancelada',
  } as Record<SubscriptionStatus, string>,
  paymentStatus: {
    pending: 'Pendente',
    paid: 'Pago',
    overdue: 'Vencido',
    refunded: 'Estornado',
    canceled: 'Cancelado',
  } as Record<PaymentStatus, string>,
  runType: {
    rodagem: 'Rodagem',
    intervalado: 'Intervalado',
    longao: 'Longão',
    regenerativo: 'Regenerativo',
    tiro: 'Tiros',
    fartlek: 'Fartlek',
    prova: 'Prova',
  } as Record<RunType, string>,
}

export const INTERVAL_MONTHS: Record<BillingInterval, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  yearly: 12,
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(d: string | Date | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
}

/** "5:30/km" a partir de segundos por km */
export function formatPace(secondsPerKm: number | null | undefined) {
  if (!secondsPerKm) return '—'
  const m = Math.floor(secondsPerKm / 60)
  const s = Math.round(secondsPerKm % 60)
  return `${m}:${String(s).padStart(2, '0')}/km`
}

/** "5:30" → 330 segundos */
export function parsePace(pace: string | null | undefined): number | null {
  if (!pace) return null
  const m = pace.trim().match(/^(\d{1,2}):(\d{2})/)
  if (!m) return null
  return Number(m[1]) * 60 + Number(m[2])
}

export function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
