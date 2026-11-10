/** Perfil do usuário logado + edição dos dados pessoais. Use com await. */
export function useProfile(kind: 'aluno' | 'staff') {
  const { fetch: refreshSession } = useUserSession()
  const form = reactive(profileToForm(null))
  const query = useFetch('/api/me/profile', { key: 'me-profile' })

  watch(query.data, (p) => Object.assign(form, profileToForm(p)), { immediate: true })

  const save = useAction(async () => {
    await accountApi.updateProfile(profileFormToPatch(form, kind))
    await Promise.all([refreshSession(), query.refresh()])
  }, 'Dados atualizados')

  return withAsync(query, { form, save })
}
