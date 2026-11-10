import type { Credentials, SignupInput } from '../api/authApi'

/** Casos de uso de autenticação: entrar, criar conta, confirmar e-mail, recuperar senha e sair. */
export function useAuth() {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()
  const route = useRoute()
  const loading = ref(false)
  const error = ref('')
  /** e-mail que precisa ser confirmado (após cadastro ou login bloqueado) */
  const pendingEmail = ref('')
  const resent = ref(false)

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
      pendingEmail.value = ''
      try {
        const { role } = await authApi.login(credentials)
        await refreshSession()
        await navigateTo(safeRedirect(route.query.next, homeFor(role)))
      } catch (err) {
        if (isEmailNotVerified(err)) pendingEmail.value = credentials.email
        throw err
      }
    })

  const register = (input: SignupInput) =>
    guarded(async () => {
      const planId = Number(route.query.plano) || undefined
      const { email } = await authApi.register({ ...input, phone: input.phone || undefined, planId })
      pendingEmail.value = email
    })

  const resendVerification = () =>
    guarded(async () => {
      await authApi.resendVerification(pendingEmail.value)
      resent.value = true
    })

  /** Página /verificar-email: confirma o token do link e entra no app. */
  const verifyEmail = (token: string) =>
    guarded(async () => {
      const { role } = await authApi.verifyEmail(token)
      await refreshSession()
      await navigateTo(role === 'aluno' ? afterSignupPath(route.query.plano) : homeFor(role))
    })

  const forgotPassword = (email: string) =>
    guarded(async () => {
      await authApi.forgotPassword(email)
    })

  const resetPassword = (token: string, password: string) =>
    guarded(async () => {
      const { role } = await authApi.resetPassword(token, password)
      await refreshSession()
      await navigateTo(homeFor(role))
    })

  async function logout() {
    await authApi.logout()
    await clear()
    await navigateTo('/login')
  }

  return {
    loggedIn,
    user,
    homePath,
    loading,
    error,
    pendingEmail,
    resent,
    login,
    register,
    resendVerification,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
  }
}
