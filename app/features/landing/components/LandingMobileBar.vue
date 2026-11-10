<script setup lang="ts">
/** Barra fixa no rodapé do celular: aparece depois da hero e some perto do fim da página. */
const { loggedIn, homePath } = useAuth()
const { installed, install } = usePwaInstall()
const show = ref(false)

let ticking = false
function update() {
  const y = window.scrollY
  const end = document.documentElement.scrollHeight - window.innerHeight - 700
  show.value = y > window.innerHeight * 0.8 && y < end
  ticking = false
}
function onScroll() {
  if (!ticking) requestAnimationFrame(update)
  ticking = true
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="mbar" :class="{ show }" :aria-hidden="!show">
    <NuxtLink v-if="loggedIn" :to="homePath" class="lp-btn lp-btn--volt mbar__main" :tabindex="show ? 0 : -1">Abrir meu treino <i class="pi pi-arrow-right" /></NuxtLink>
    <NuxtLink v-else to="/cadastro" class="lp-btn lp-btn--volt mbar__main" :tabindex="show ? 0 : -1">Criar minha conta <i class="pi pi-arrow-right" /></NuxtLink>
    <button v-if="!installed" type="button" class="mbar__icon" aria-label="Instalar o app" :tabindex="show ? 0 : -1" @click="install">
      <i class="pi pi-download" />
    </button>
  </div>
</template>

<style scoped>
.mbar {
  position: fixed; z-index: 55; left: 12px; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom));
  display: none; gap: 8px; padding: 6px; border-radius: 999px;
  background: color-mix(in srgb, var(--ink) 92%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.5);
  transform: translateY(140%); transition: transform 0.45s var(--ease-out);
}
.mbar.show { transform: none; }
.mbar__main { flex: 1; min-height: 50px; }
.mbar__icon { width: 50px; height: 50px; flex-shrink: 0; border-radius: 50%; border: 1px solid var(--ink-line); background: var(--ink-2); color: var(--bone); }
@media (max-width: 760px) { .mbar { display: flex; } }
</style>
