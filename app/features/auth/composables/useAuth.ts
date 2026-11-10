import type { Credentials, SignupInput } from '../api/authApi'

/** Casos de uso de autenticação: entrar, criar conta e sair. */
export function useAuth() {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()
  const route = useRoute()
  const loading = ref(false)
  const error = ref('')

  const homePath = computed(() => homeFor(user.value?.role))

  async function guarded(fn: () => Promise<void>) {
    error.value = ''
    loading.value = true
    try {
      await fn()
    } catch (err) {
      error.value = errorMessage(err)
    } finally {
      loading.value = false
    }
  }

  const login = (credentials: Credentials) =>
    guarded(async () => {
      const { role } = await authApi.login(credentials)
      await refreshSession()
      await navigateTo(safeRedirect(route.query.next, homeFor(role)))
    })

  const register = (input: SignupInput) =>
    guarded(async () => {
      await authApi.register({ ...input, phone: input.phone || undefined })
      await refreshSession()
      await navigateTo(afterSignupPath(route.query.plano))
    })

  async function logout() {
    await authApi.logout()
    await clear()
    await navigateTo('/login')
  }

  return { loggedIn, user, homePath, loading, error, login, register, logout }
}
