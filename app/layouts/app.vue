<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

const { user, logout } = useAuth()
const { mode, toggle: toggleMode, init, reset } = useAppColorMode()
const route = useRoute()
const drawer = ref(false)

const nav = computed(() => navFor(user.value?.role))
const home = computed(() => homeFor(user.value?.role))

const { unread, refresh: refreshNotifications } = useNotifications()
watch(
  () => route.fullPath,
  () => {
    drawer.value = false
    refreshNotifications()
  },
)

const userMenu = ref()
const userMenuItems = computed<MenuItem[]>(() => [
  { label: 'Minha conta', icon: 'pi pi-user', command: () => navigateTo(accountPathFor(user.value?.role)) },
  { label: mode.value === 'dark' ? 'Modo claro' : 'Modo escuro', icon: mode.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon', command: toggleMode },
  { separator: true },
  { label: 'Sair', icon: 'pi pi-sign-out', command: logout },
])

/* topbar ganha fundo ao rolar (mobile) */
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  init()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  reset()
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="app-shell">
    <!-- Sidebar fixa (desktop) -->
    <aside class="sidebar">
      <NuxtLink :to="home" class="sidebar__brand" aria-label="CL Academy, início">
        <BrandLogo bold />
      </NuxtLink>
      <ShellNavLinks :sections="nav.sections" :path="route.path" />
      <div class="sidebar__foot">
        <PwaInstallButton label="Instalar app" text fluid severity="secondary" class="sidebar__install" />
        <button class="sidebar__me" @click="userMenu.toggle($event)">
          <span class="sidebar__avatar">{{ initials(user?.name ?? '') }}</span>
          <span class="grow sidebar__me-text">
            <strong class="small truncate">{{ user?.name }}</strong>
            <span class="tiny">{{ LABELS.role[user?.role ?? 'aluno'] }}</span>
          </span>
          <i class="pi pi-ellipsis-v" />
        </button>
      </div>
    </aside>

    <!-- Drawer (mobile) -->
    <Drawer v-model:visible="drawer" class="app-drawer" :style="{ width: 'min(300px, 86vw)' }">
      <template #header>
        <BrandLogo bold class="drawer-logo" />
      </template>
      <ShellNavLinks :sections="nav.sections" :path="route.path" />
    </Drawer>

    <div class="main">
      <header class="topbar" :class="{ 'topbar--solid': scrolled }">
        <NuxtLink :to="home" class="topbar__logo" aria-label="CL Academy, início">
          <BrandLogo bold />
        </NuxtLink>
        <div class="grow" />
        <button type="button" class="topbar__btn" :aria-label="mode === 'dark' ? 'Modo claro' : 'Modo escuro'" @click="toggleMode">
          <i :class="['pi', mode === 'dark' ? 'pi-sun' : 'pi-moon']" />
        </button>
        <NuxtLink to="/app/notificacoes" class="topbar__btn" aria-label="Notificações">
          <i class="pi pi-bell" />
          <span v-if="unread" class="topbar__badge">{{ unread > 9 ? '9+' : unread }}</span>
        </NuxtLink>
        <button type="button" class="topbar__avatar" aria-label="Menu do usuário" @click="userMenu.toggle($event)">
          {{ initials(user?.name ?? '') }}
        </button>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>

    <Menu ref="userMenu" :model="userMenuItems" popup />

    <!-- Barra inferior flutuante (mobile) -->
    <nav class="bottombar" aria-label="Navegação principal">
      <NuxtLink
        v-for="item in nav.primary"
        :key="item.to"
        :to="item.to"
        class="bottombar__item"
        :class="{ active: isNavActive(item, route.path) }"
      >
        <span class="bottombar__icon"><i :class="['pi', item.icon]" /></span>
        <span class="bottombar__label">{{ item.label.split(' ')[0] }}</span>
      </NuxtLink>
      <button v-if="user?.role !== 'aluno'" class="bottombar__item" @click="drawer = true">
        <span class="bottombar__icon"><i class="pi pi-bars" /></span>
        <span class="bottombar__label">Menu</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.app-shell { display: flex; min-height: 100dvh; background: var(--app-bg); color: var(--app-text); font-family: var(--font-body); }

/* sidebar: sempre escura, como as seções escuras da landing */
.sidebar {
  position: fixed; inset: 12px auto 12px 12px; width: calc(var(--sidebar-w) - 12px); z-index: 30;
  display: none; flex-direction: column; border-radius: 26px; overflow: hidden;
  background: var(--cl-ink); color: var(--cl-bone);
}
.app-dark .sidebar { background: #1b1b1b; border: 1px solid #2a2a2a; }
@media (min-width: 960px) { .sidebar { display: flex; } }
.sidebar__brand { display: flex; align-items: center; height: 92px; padding: 0 22px; color: var(--cl-bone); }
.sidebar__brand .brand-logo { font-size: 58px; }
.sidebar__foot { padding: 12px; border-top: 1px solid var(--cl-ink-line); display: flex; flex-direction: column; gap: 6px; }
.sidebar__install { --p-button-text-secondary-color: #b9b8b5; --p-button-text-secondary-hover-background: rgba(255, 255, 255, 0.06); }
.sidebar__me {
  display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px; border: 0; border-radius: 16px;
  background: none; color: inherit; text-align: left; transition: background 0.2s;
}
.sidebar__me:hover { background: rgba(255, 255, 255, 0.06); }
.sidebar__me .pi, .sidebar__me .tiny { color: #a8a7a4; }
.sidebar__avatar, .topbar__avatar {
  width: 38px; height: 38px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center;
  background: var(--cl-volt); color: var(--cl-volt-ink); font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; letter-spacing: 0.02em;
}
.sidebar__me-text { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
.drawer-logo { font-size: 46px; color: var(--app-text); }

/* main */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
@media (min-width: 960px) { .main { margin-left: var(--sidebar-w); } }

.topbar {
  position: sticky; top: 0; z-index: 20; height: calc(var(--topbar-h) + env(safe-area-inset-top));
  display: flex; align-items: center; gap: 6px; padding: env(safe-area-inset-top) 14px 0;
  border-bottom: 1px solid transparent; transition: background 0.3s, border-color 0.3s;
}
.topbar--solid { background: color-mix(in srgb, var(--app-bg) 85%, transparent); backdrop-filter: saturate(1.4) blur(14px); -webkit-backdrop-filter: saturate(1.4) blur(14px); border-bottom-color: var(--app-border); }
.topbar__logo { display: flex; color: var(--app-text); }
.topbar__logo .brand-logo { font-size: 46px; }
.topbar__btn {
  position: relative; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid var(--app-border); background: var(--app-tile); color: var(--app-text); transition: background 0.2s, border-color 0.2s;
}
.topbar__btn:hover { border-color: var(--app-muted); }
.topbar__btn .pi { font-size: 1rem; }
.topbar__badge {
  position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; display: grid; place-items: center;
  background: var(--cl-heat); color: #fff; font-size: 0.65rem; font-weight: 800; border: 2px solid var(--app-bg);
}
.topbar__avatar { border: 0; margin-left: 2px; }
@media (min-width: 960px) {
  .topbar { padding: 0 32px; height: 76px; }
  .topbar--solid { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-bottom-color: transparent; }
  .topbar__logo, .topbar__avatar { display: none; }
}

.content {
  width: 100%; max-width: 1140px; margin: 0 auto;
  padding: 8px 16px calc(var(--bottombar-h) + 40px + env(safe-area-inset-bottom));
}
@media (min-width: 960px) { .content { padding: 0 32px 56px; } }

/* barra inferior flutuante */
.bottombar {
  position: fixed; left: 12px; right: 12px; bottom: calc(10px + env(safe-area-inset-bottom)); z-index: 25;
  display: flex; justify-content: space-around; height: var(--bottombar-h); padding: 6px;
  border-radius: 999px; background: color-mix(in srgb, var(--cl-ink) 94%, transparent);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 16px 40px -14px rgba(0, 0, 0, 0.55);
}
.app-dark .bottombar { background: color-mix(in srgb, #222 94%, transparent); border: 1px solid #333; }
@media (min-width: 960px) { .bottombar { display: none; } }
.bottombar__item {
  flex: 1; min-width: 0; border: 0; background: none; border-radius: 999px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  font-size: 0.66rem; font-weight: 700; color: #a8a7a4; -webkit-tap-highlight-color: transparent;
}
.bottombar__icon { display: grid; place-items: center; width: 40px; height: 30px; border-radius: 999px; transition: background 0.3s var(--ease-out), color 0.3s; }
.bottombar__icon .pi { font-size: 1.08rem; }
.bottombar__item.active { color: var(--cl-bone); }
.bottombar__item.active .bottombar__icon { background: var(--cl-volt); color: var(--cl-volt-ink); }
.bottombar__item:active .bottombar__icon { transform: scale(0.92); }
</style>
