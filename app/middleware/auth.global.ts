export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, user } = useUserSession()
  const role = user.value?.role

  if (to.path.startsWith('/app')) {
    if (!loggedIn.value) return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`)
    if (to.path === '/app' || to.path === '/app/') return navigateTo(homeFor(role))
    if (!canAccess(role, to.path)) return navigateTo(homeFor(role))
  }

  if ((to.path === '/login' || to.path === '/cadastro') && loggedIn.value) {
    return navigateTo(homeFor(role))
  }
})
