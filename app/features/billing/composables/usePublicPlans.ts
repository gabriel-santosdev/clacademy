/** Vitrine de planos publicados (landing e app). Use com await. */
export function usePublicPlans() {
  const query = useFetch('/api/plans', { key: 'public-plans', default: () => [] })
  const { loggedIn, user } = useUserSession()

  /** Para onde vai o "Quero esse": cadastro, checkout do aluno ou área do papel. */
  function ctaFor(planId: number) {
    if (!loggedIn.value) return `/cadastro?plano=${planId}`
    return user.value?.role === 'aluno' ? `/app/aluno/plano?plano=${planId}` : homeFor(user.value?.role)
  }

  return withAsync(query, { ctaFor })
}
