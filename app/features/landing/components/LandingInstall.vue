<script setup lang="ts">
import type { InstallPlatform } from '~/features/pwa/domain/platform'

const { platform, installed, canPrompt, install } = usePwaInstall()
const tab = ref<InstallPlatform>('ios')
watch(platform, (p) => (tab.value = p), { immediate: true })

const platforms: { value: InstallPlatform; label: string; icon: string }[] = [
  { value: 'ios', label: 'iPhone', icon: 'pi-apple' },
  { value: 'android', label: 'Android', icon: 'pi-android' },
  { value: 'desktop', label: 'Computador', icon: 'pi-desktop' },
]
const steps = computed(() => installSteps(tab.value))

/* o ícone "cai" na tela inicial do mini celular quando a seção aparece */
const root = ref<HTMLElement | null>(null)
const seen = useInView(root, { once: true, threshold: 0.4 })
const apps = ['#c9c6c0', '#9b9893', '#5e5e5e', '#d9d7d2', '#7a7874', '#b4b1ab', '#a8a49e']
</script>

<template>
  <section id="instalar" ref="root" class="lp-section inst">
    <div class="lp-container inst__inner">
      <div class="inst__copy" data-reveal>
        <p class="lp-eyebrow"><b>06</b> Instalar</p>
        <h2 class="lp-h2">Sem loja. <em>Sem espera.</em></h2>
        <p class="lp-lead">O app instala direto do navegador, ocupa quase nada e fica na tela inicial junto dos outros. Atualiza sozinho.</p>

        <div class="inst__tabs" role="tablist" aria-label="Seu aparelho">
          <button
            v-for="p in platforms"
            :key="p.value"
            type="button"
            role="tab"
            :aria-selected="tab === p.value"
            :class="{ on: tab === p.value }"
            @click="tab = p.value"
          >
            <i :class="['pi', p.icon]" /> {{ p.label }}
          </button>
        </div>

        <Transition name="steps" mode="out-in">
          <ol :key="tab" class="inst__steps">
            <li v-for="(s, i) in steps" :key="i" :style="{ '--i': i }">
              <span class="inst__n">{{ i + 1 }}</span>
              <span class="grow">{{ s.text }}</span>
              <i :class="['pi', s.icon]" />
            </li>
          </ol>
        </Transition>

        <div class="inst__cta">
          <p v-if="installed" class="inst__ok"><i class="pi pi-check-circle" /> Você já está usando o app instalado.</p>
          <button v-else type="button" class="lp-btn lp-btn--ink" @click="install">
            <i class="pi pi-download" /> {{ canPrompt ? 'Instalar agora' : 'Ver como instalar' }}
          </button>
        </div>
      </div>

      <div class="inst__visual" :class="{ go: seen }" aria-hidden="true" data-reveal="1">
        <div class="home">
          <div class="home__time">6:42</div>
          <div class="home__grid">
            <span v-for="(c, i) in apps" :key="i" class="home__app" :style="{ background: c }" />
            <span class="home__app home__app--cl">
              <BrandLogo variant="mark" bold />
            </span>
          </div>
          <div class="home__dock"><span /><span /><span /><span /></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.inst__inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(40px, 6vw, 88px); align-items: center; }

.inst__tabs { display: inline-flex; gap: 4px; margin-top: 32px; padding: 5px; border-radius: 999px; background: var(--bone-2); border: 1px solid var(--line); max-width: 100%; }
.inst__tabs button {
  display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 16px; border: 0; border-radius: 999px; background: none;
  font-size: 0.9rem; font-weight: 700; color: var(--graphite); transition: background 0.3s, color 0.3s; white-space: nowrap;
}
.inst__tabs button.on { background: var(--ink); color: var(--bone); }
.inst__steps { display: flex; flex-direction: column; gap: 8px; margin-top: 18px; }
.inst__steps li {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 16px; background: var(--paper); border: 1px solid var(--line);
  font-size: 0.97rem; font-weight: 600; animation: lp-rise 0.45s var(--ease-out) both; animation-delay: calc(var(--i) * 60ms);
}
.inst__steps li > .pi { color: var(--graphite); }
.inst__n { width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; background: var(--ink); color: var(--volt); font-family: var(--f-display); font-weight: 800; font-size: 1rem; }
.steps-leave-active { transition: opacity 0.15s; }
.steps-leave-to { opacity: 0; }
.inst__cta { margin-top: 24px; }
.inst__ok { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; }

/* mini tela inicial */
.inst__visual { display: grid; place-items: center; }
.home {
  position: relative; width: min(320px, 82vw); aspect-ratio: 9 / 15; padding: 54px 26px 0; border-radius: 44px;
  background: linear-gradient(160deg, #3a3a3a, #1f1f1f); box-shadow: 0 0 0 10px #121212, 0 40px 80px -30px rgba(0, 0, 0, 0.5); overflow: hidden;
}
.home__time { text-align: center; font-family: var(--f-display); font-size: 3.6rem; font-weight: 700; color: var(--bone); line-height: 1; margin-bottom: 30px; }
.home__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 16px; }
.home__app { aspect-ratio: 1; border-radius: 22%; opacity: 0.55; }
.home__app--cl {
  opacity: 1; display: grid; place-items: center; background: var(--bone); color: var(--graphite); font-size: 38px;
  transform: translateY(-260px) scale(0.6); transition: transform 0.9s var(--ease-spring) 0.2s;
  box-shadow: 0 0 0 3px var(--volt);
}
.go .home__app--cl { transform: none; }
.home__dock { position: absolute; left: 16px; right: 16px; bottom: 16px; display: flex; justify-content: space-around; padding: 12px; border-radius: 28px; background: rgba(255, 255, 255, 0.08); }
.home__dock span { width: 46px; aspect-ratio: 1; border-radius: 22%; background: rgba(255, 255, 255, 0.18); }

@media (max-width: 920px) {
  .inst__inner { grid-template-columns: 1fr; }
  .inst__visual { order: -1; }
  .home { width: min(260px, 70vw); }
}
@media (max-width: 480px) {
  .inst__tabs { display: flex; }
  .inst__tabs button { flex: 1; justify-content: center; padding: 0 8px; }
  .inst__cta .lp-btn { width: 100%; }
}
</style>
