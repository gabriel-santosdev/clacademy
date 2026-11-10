/** Formatadores e helpers de apresentação usados em todo o app. */

export const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
export const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function firstName(name: string | null | undefined) {
  return (name ?? '').split(' ')[0] ?? ''
}

export function relativeTime(d: string | Date | null | undefined) {
  if (!d) return '—'
  const diff = Date.now() - new Date(d).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h} h`
  const days = Math.round(h / 24)
  if (days < 30) return `há ${days} ${days === 1 ? 'dia' : 'dias'}`
  return formatDate(d)
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

export function longDate(date = new Date()) {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

/** "1.234,56" → 123456 */
export function brlToCents(v: string | number) {
  const n = typeof v === 'number' ? v : Number(String(v).replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

/** R$ 12,3k / R$ 950 */
export function compactBRL(cents: number) {
  const v = cents / 100
  return v >= 1000 ? `R$ ${(v / 1000).toFixed(1).replace('.', ',')}k` : `R$ ${Math.round(v)}`
}

/** Data de hoje (YYYY-MM-DD) no fuso de São Paulo. */
export function todayISO() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
}

/** Link wa.me a partir de um telefone livre (assume +55 para números nacionais). */
export function whatsappUrl(phone: string | null | undefined, text?: string) {
  const n = phone?.replace(/\D/g, '')
  if (!n) return null
  const full = n.length <= 11 ? `55${n}` : n
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

/** Alterna um valor em um array (mutável — útil com reactive). */
export function toggleIn<T>(arr: T[], v: T) {
  const i = arr.indexOf(v)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(v)
}
