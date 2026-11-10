/** Dashboard do admin: MRR, receita, assinantes por plano e cobranças em aberto. Use com await. */
export function useFinanceDashboard() {
  const query = useFetch('/api/admin/finance', { key: 'admin-finance-dash' })
  const data = query.data

  const openPayments = computed(() => data.value?.payments.filter((p) => isOpenPayment(p.status)).slice(0, 6) ?? [])
  const byPlan = computed(() => {
    const list = data.value?.byPlan ?? []
    const total = list.reduce((s, p) => s + p.count, 0) || 1
    return list.map((p) => ({ ...p, pct: Math.round((p.count / total) * 100) }))
  })

  return withAsync(query, { openPayments, byPlan })
}
