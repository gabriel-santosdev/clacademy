<script setup lang="ts">
const { loggedIn, homePath } = useAuth()
const menuOpen = ref(false)
const scrolled = ref(false)
const hidden = ref(false)
const progress = ref(0)

let lastY = 0
let ticking = false
function update() {
  const y = window.scrollY
  scrolled.value = y > 12
  // esconde ao rolar para baixo, volta ao subir (comportamento de app)
  hidden.value = y > 420 && y > lastY && !menuOpen.value
  lastY = y
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? y / max : 0
  ticking = false
}
function onScroll() {
  if (!ticking) requestAnimationFrame(update)
  ticking = true
}
onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

watch(menuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => (document.documentElement.style.overflow = ''))
</script>

<template>
  <header class="nav" :class="{ 'nav--solid': scrolled || menuOpen, 'nav--hidden': hidden }">
    <div class="nav__progress" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />
    <div class="lp-container nav__inner">
      <NuxtLink to="/" class="nav__logo" aria-label="CL Academy, início" @click="menuOpen = false">
        <BrandLogo bold />
      </NuxtLink>

      <nav class="nav__links" aria-label="Seções">
        <a v-for="l in LANDING.nav" :key="l.href" :href="l.href">{{ l.label }}</a>
      </nav>

      <div class="nav__actions">
        <NuxtLink v-if="loggedIn" :to="homePath" class="lp-btn lp-btn--ink lp-btn--sm">Minha área <i class="pi pi-arrow-right" /></NuxtLink>
        <template v-else>
          <NuxtLink to="/login" class="nav__login">Entrar</NuxtLink>
          <NuxtLink to="/cadastro" class="lp-btn lp-btn--ink lp-btn--sm nav__cta">Começar</NuxtLink>
        </template>
        <button
          type="button"
          class="nav__burger"
          :class="{ open: menuOpen }"
          :aria-expanded="menuOpen"
          aria-controls="lp-menu"
          :aria-label="menuOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="menuOpen = !menuOpen"
        >
          <span /><span />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div v-if="menuOpen" id="lp-menu" class="menu">
        <nav class="lp-container menu__links" aria-label="Menu">
          <a v-for="(l, i) in LANDING.nav" :key="l.href" :href="l.href" :style="{ '--i': i }" @click="menuOpen = false">
            <small>0{{ i + 1 }}</small>{{ l.label }}
          </a>
        </nav>
        <div class="lp-container menu__cta">
          <NuxtLink v-if="loggedIn" :to="homePath" class="lp-btn lp-btn--light" @click="menuOpen = false">Minha área <i class="pi pi-arrow-right" /></NuxtLink>
          <template v-else>
            <NuxtLink to="/cadastro" class="lp-btn lp-btn--light" @click="menuOpen = false">Criar minha conta <i class="pi pi-arrow-right" /></NuxtLink>
            <NuxtLink to="/login" class="lp-btn lp-btn--ghost-light" @click="menuOpen = false">Já sou aluno, entrar</NuxtLink>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed; inset: 0 0 auto; z-index: 60; padding-top: env(safe-area-inset-top);
  transition: background 0.3s, border-color 0.3s, transform 0.4s var(--ease-out);
  border-bottom: 1px solid transparent;
}
.nav--solid { background: color-mix(in srgb, var(--bone) 86%, transparent); backdrop-filter: saturate(1.4) blur(14px); -webkit-backdrop-filter: saturate(1.4) blur(14px); border-bottom-color: color-mix(in srgb, var(--ink) 8%, transparent); }
.nav--hidden { transform: translateY(-100%); }
.nav__progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: var(--ink); transform-origin: left; }
.nav__progress::after { content: ''; position: absolute; right: -3px; top: -2px; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
.nav__inner { display: flex; align-items: center; gap: 24px; height: 72px; }
.nav__logo { display: flex; color: var(--graphite); font-size: 58px; transition: color 0.2s; }
.nav__logo:hover { color: var(--ink); }
.nav__links { flex: 1; display: flex; justify-content: center; gap: 4px; }
.nav__links a { position: relative; padding: 8px 14px; border-radius: 999px; font-size: 0.92rem; font-weight: 600; color: var(--graphite); transition: color 0.2s, background 0.2s; }
.nav__links a:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 6%, transparent); }
.nav__actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }
.nav__login { padding: 10px 14px; font-weight: 700; font-size: 0.92rem; color: var(--ink); }
.nav__login:hover { text-decoration: underline; text-underline-offset: 4px; }

.nav__burger { display: none; position: relative; width: 44px; height: 44px; border-radius: 50%; border: 0; background: var(--ink); -webkit-tap-highlight-color: transparent; }
.nav__burger span { position: absolute; left: 13px; right: 13px; height: 2px; border-radius: 2px; background: var(--bone); transition: transform 0.35s var(--ease-out), top 0.35s var(--ease-out); }
.nav__burger span:first-child { top: 17px; }
.nav__burger span:last-child { top: 25px; right: 18px; }
.nav__burger.open { background: var(--hi); }
.nav__burger.open span { background: var(--ink); top: 21px; right: 13px; }
.nav__burger.open span:first-child { transform: rotate(45deg); }
.nav__burger.open span:last-child { transform: rotate(-45deg); }

.menu {
  position: fixed; inset: 0; z-index: -1; display: flex; flex-direction: column; justify-content: space-between;
  padding: calc(96px + env(safe-area-inset-top)) 0 calc(28px + env(safe-area-inset-bottom)); background: var(--ink); color: var(--bone);
}
.menu__links { display: flex; flex-direction: column; }
.menu__links a {
  display: flex; align-items: baseline; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--ink-line);
  font-family: var(--f-display); font-size: clamp(2.4rem, 11vw, 3.4rem); font-weight: 800; text-transform: uppercase; line-height: 1;
  animation: lp-rise 0.55s var(--ease-out) both; animation-delay: calc(var(--i) * 55ms + 80ms);
}
.menu__links a:active { color: var(--hi); }
.menu__links small { font-size: 0.9rem; color: var(--hi); font-weight: 700; letter-spacing: 0.1em; }
.menu__cta { display: grid; gap: 10px; animation: lp-rise 0.6s var(--ease-out) 0.35s both; }
.menu-enter-active, .menu-leave-active { transition: clip-path 0.5s var(--ease-out); }
.menu-enter-from, .menu-leave-to { clip-path: circle(0% at calc(100% - 46px) 36px); }
.menu-enter-to, .menu-leave-from { clip-path: circle(150% at calc(100% - 46px) 36px); }
.nav:has(.menu) .nav__logo { color: var(--bone); }
.nav:has(.menu).nav--solid { background: transparent; backdrop-filter: none; -webkit-backdrop-filter: none; border-bottom-color: transparent; }
.nav:has(.menu) .nav__cta, .nav:has(.menu) .nav__progress { opacity: 0; }

@media (max-width: 940px) {
  .nav__links, .nav__login { display: none; }
  .nav__burger { display: inline-block; }
  .nav__inner { height: 64px; gap: 12px; }
  .nav__logo { font-size: 50px; }
}
@media (max-width: 380px) { .nav__cta { display: none; } }
</style>
