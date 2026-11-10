<script setup lang="ts">
const { init, reset } = useAppColorMode()
onMounted(init)
onBeforeUnmount(reset)

const perks = [
  { icon: 'pi-bolt', text: 'Ficha do personal e planilha de corrida' },
  { icon: 'pi-comments', text: 'Retorno do professor em cada treino' },
  { icon: 'pi-wifi', text: 'Abre offline, direto da tela inicial' },
]
</script>

<template>
  <div class="auth">
    <aside class="auth__side" aria-hidden="true">
      <svg class="auth__lanes" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
        <path v-for="l in 7" :key="l" :d="`M ${-60 + l * 40} 640 C ${-60 + l * 40} 300, ${160 + l * 34} 200, 460 ${l * 40 - 60}`" />
      </svg>
      <BrandLogo bold class="auth__brand" />
      <div class="auth__quote">
        <p class="auth__kicker"><span /> Personal e assessoria de corrida</p>
        <p class="auth__title">Treino bom é treino <em>acompanhado.</em></p>
        <ul>
          <li v-for="p in perks" :key="p.text"><i :class="['pi', p.icon]" /> {{ p.text }}</li>
        </ul>
      </div>
    </aside>
    <main class="auth__main">
      <NuxtLink to="/" class="auth__logo" aria-label="CL Academy, voltar ao site"><BrandLogo bold /></NuxtLink>
      <div class="auth__card rise"><slot /></div>
      <NuxtLink to="/" class="auth__back"><i class="pi pi-arrow-left" /> Voltar ao site</NuxtLink>
    </main>
  </div>
</template>

<style scoped>
.auth { display: grid; grid-template-columns: 1fr; min-height: 100dvh; background: var(--app-bg); color: var(--app-text); font-family: var(--font-body); }
@media (min-width: 960px) { .auth { grid-template-columns: 1.05fr 1fr; } }

.auth__side { position: relative; display: none; overflow: hidden; isolation: isolate; margin: 12px; border-radius: 30px; background: var(--cl-ink); color: var(--cl-bone); }
@media (min-width: 960px) { .auth__side { display: block; } }
.auth__lanes { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; }
.auth__lanes path { fill: none; stroke: #2f2f2f; stroke-width: 2; }
.auth__lanes path:nth-child(4) { stroke: var(--cl-hi); stroke-dasharray: 8 10; animation: lane 3s linear infinite; }
@keyframes lane { to { stroke-dashoffset: -36; } }
.auth__brand { position: absolute; top: 28px; left: 36px; font-size: 64px; color: var(--cl-bone); }
.auth__quote { position: absolute; left: 40px; right: 40px; bottom: 44px; }
.auth__kicker { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #b8b8b8; }
.auth__kicker span { width: 10px; height: 10px; border-radius: 50%; background: var(--cl-hi); }
.auth__title { margin: 12px 0 24px; max-width: 480px; font-family: var(--font-display); font-size: clamp(3rem, 4.6vw, 4.4rem); font-weight: 800; text-transform: uppercase; line-height: 0.88; }
.auth__title em { font-style: italic; color: var(--cl-hi); }
.auth__quote ul { display: flex; flex-direction: column; gap: 10px; }
.auth__quote li { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #d6d6d6; }
.auth__quote .pi { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; background: rgba(255, 255, 255, 0.08); color: var(--cl-hi); font-size: 0.85rem; }

.auth__main { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; gap: 14px; }
.auth__logo { display: flex; font-size: 72px; color: var(--app-text); margin-bottom: 4px; }
@media (min-width: 960px) { .auth__logo { display: none; } }
.auth__card {
  width: min(440px, 100%); padding: 30px 26px;
  background: var(--app-tile); border: 1px solid var(--app-border); border-radius: 26px;
  box-shadow: 0 30px 60px -40px rgba(0, 0, 0, 0.35);
}
.auth__card :deep(.h1) { font-size: clamp(2.2rem, 7vw, 2.8rem); }
.auth__back { display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; color: var(--app-muted); }
.auth__back:hover { color: var(--app-text); }
</style>
