import type { PlanStatus } from '#shared/utils/constants'

/** Gestão de planos (admin): lista, filtro e publicação. Use com await. */
export function useAdminPlans() {
  const query = useFetch('/api/admin/plans', { key: 'admin-plans', default: () => [] })
  const filter = ref<'all' | PlanStatus>('all')
  const list = computed(() => query.data.value.filter((p) => filter.value === 'all' || p.status === filter.value))

  const setStatus = useAction(async (id: number, status: PlanStatus) => {
    await billingApi.setPlanStatus(id, status)
    await query.refresh()
  }, 'Plano atualizado')

  return withAsync(query, { filter, list, setStatus })
}
