<script setup lang="ts">
import type { DemoScreen } from '../domain/content'

const tabs = LANDING.demo
const DURATION = 7000

const root = ref<HTMLElement | null>(null)
const inView = useInView(root, { threshold: 0.35 })
const active = ref(0)
const current = computed(() => tabs[active.value]!)
/** Depois que a pessoa mexe, o carrossel automático para de vez. */
const manual = ref(false)
const playing = computed(() => inView.value && !manual.value)

const frameTab: Record<DemoScreen, 'home' | 'run' | 'chart'> = { today: 'home', log: 'run', plan: 'run', progress: 'chart' }

let timer: ReturnType<typeof setTimeout> | undefined
function schedule() {
  clearTimeout(timer)
  if (!playing.value || prefersReducedMotion()) return
  timer = setTimeout(() => {
    active.value = (active.value + 1) % tabs.length
    schedule()
  }, DURATION)
}
watch(playing, schedule)
onBeforeUnmount(() => clearTimeout(timer))

function select(i: number) {
  manual.value = true
  clearTimeout(timer)
  active.value = i
}

/* chips roláveis no celular: mantém a aba ativa visível */
const chips = ref<HTMLElement | null>(null)
watch(active, (i) => {
  const box = chips.value
  const el = box?.children[i] as HTMLElement | undefined
  if (!box || !el || box.scrollWidth <= box.clientWidth) return
  // rola só o trilho de chips, nunca a página
  box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' })
})
</script>

<template>
  <section id="app" ref="root" class="lp-section lp-dark demo">
    <div class="lp-container">
      <header class="demo__head" data-reveal>
        <p class="lp-eyebrow"><b>01</b> O app</p>
        <h2 class="lp-h2">Por dentro <em>do app.</em></h2>
        <p class="lp-lead">Não é print. Pode mexer: é assim que fica no seu celular.</p>
      </header>

      <div class="demo__grid">
        <div ref="chips" class="demo__tabs" role="tablist" aria-label="Telas do app">
          <button
            v-for="(t, i) in tabs"
            :id="`demo-tab-${t.key}`"
            :key="t.key"
            type="button"
            role="tab"
            class="demo__tab"
            :class="{ on: active === i, playing: active === i && playing }"
            :aria-selected="active === i"
            aria-controls="demo-panel"
            @click="select(i)"
          >
            <span class="demo__n">0{{ i + 1 }}</span>
            <span class="demo__label">{{ t.label }}</span>
            <span class="demo__bar" :style="{ animationDuration: `${DURATION}ms` }" />
          </button>
        </div>

        <div class="demo__device" data-reveal data-reveal-from="scale" @pointerdown="manual = true">
          <div class="demo__halo" aria-hidden="true" />
          <LandingPhoneFrame :label="`Tela ${current.label} do app CL Academy`" :tab="frameTab[current.key]">
            <Transition name="screen" mode="out-in">
              <LandingScreenToday v-if="current.key === 'today'" key="today" />
              <LandingScreenLog v-else-if="current.key === 'log'" key="log" />
              <LandingScreenPlan v-else-if="current.key === 'plan'" key="plan" />
              <LandingScreenProgress v-else key="progress" :active="true" />
            </Transition>
          </LandingPhoneFrame>
          <p class="demo__hint"><span class="demo__touch" /> {{ current.hint }}</p>
        </div>

        <div id="demo-panel" class="demo__copy" role="tabpanel" :aria-labelledby="`demo-tab-${current.key}`">
          <Transition name="copy" mode="out-in">
            <div :key="current.key">
              <h3>{{ current.title }}</h3>
              <p>{{ current.text }}</p>
            </div>
          </Transition>
          <NuxtLink to="/cadastro" class="lp-btn lp-btn--volt demo__cta">Quero usar <i class="pi pi-arrow-right" /></NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo { overflow: hidden; }
.demo::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.6;
  background: repeating-linear-gradient(90deg, transparent 0 calc(25% - 1px), var(--ink-line) calc(25% - 1px) 25%);
  mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent); -webkit-mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent);
}
.demo__head { position: relative; max-width: 640px; }
.demo__grid {
  position: relative; display: grid; grid-template-columns: 1fr auto 1fr; grid-template-areas: 'tabs device copy';
  gap: clamp(24px, 4vw, 64px); align-items: center; margin-top: clamp(40px, 6vw, 72px);
}
.demo__tabs { grid-area: tabs; display: flex; flex-direction: column; gap: 6px; }
.demo__tab {
  position: relative; display: flex; align-items: center; gap: 14px; padding: 18px 4px 18px 0; text-align: left;
  border: 0; border-bottom: 1px solid var(--ink-line); background: none; color: #8f8e8b; font-size: 1rem;
  transition: color 0.25s; -webkit-tap-highlight-color: transparent;
}
.demo__tab:hover { color: var(--bone); }
.demo__n { font-family: var(--f-display); font-weight: 700; font-size: 0.95rem; letter-spacing: 0.08em; }
.demo__label { font-family: var(--f-display); font-weight: 800; font-size: clamp(1.5rem, 2.6vw, 2.1rem); text-transform: uppercase; line-height: 1; }
.demo__tab.on { color: var(--bone); }
.demo__tab.on .demo__n { color: var(--volt); }
.demo__bar { position: absolute; left: 0; bottom: -1px; height: 2px; width: 100%; background: var(--volt); transform: scaleX(0); transform-origin: left; }
.demo__tab.on .demo__bar { transform: scaleX(1); }
.demo__tab.playing .demo__bar { animation: fill linear both; }
@keyframes fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.demo__device { grid-area: device; position: relative; display: flex; flex-direction: column; align-items: center; gap: 18px; --phone-w: min(300px, 78vw); }
.demo__halo { position: absolute; top: 8%; width: 120%; aspect-ratio: 1; border-radius: 50%; border: 1px solid var(--ink-line); box-shadow: 0 0 0 40px rgba(255, 255, 255, 0.015), 0 0 0 80px rgba(255, 255, 255, 0.01); }
.demo__device :deep(.phone) { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08) inset, 0 0 0 0.18em #0b0b0b, 0 3em 6em -1.5em rgba(0, 0, 0, 0.7); }
.demo__hint { position: relative; display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; color: #a8a7a4; }
.demo__touch { width: 12px; height: 12px; border-radius: 50%; background: var(--volt); animation: tap 1.6s ease-out infinite; }
@keyframes tap { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--volt) 60%, transparent); } 100% { box-shadow: 0 0 0 12px transparent; } }

.demo__copy { grid-area: copy; }
.demo__copy h3 { font-family: var(--f-display); font-weight: 800; font-size: clamp(2rem, 3.4vw, 2.8rem); text-transform: uppercase; line-height: 0.95; color: var(--bone); text-wrap: balance; }
.demo__copy p { margin-top: 16px; font-size: 1.05rem; line-height: 1.65; color: #b9b8b5; max-width: 380px; }
.demo__cta { margin-top: 28px; }

.screen-enter-active, .screen-leave-active { transition: opacity 0.3s, transform 0.35s var(--ease-out); }
.screen-enter-from { opacity: 0; transform: translateX(14px); }
.screen-leave-to { opacity: 0; transform: translateX(-14px); }
.copy-enter-active, .copy-leave-active { transition: opacity 0.3s, transform 0.4s var(--ease-out); }
.copy-enter-from { opacity: 0; transform: translateY(14px); }
.copy-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 1020px) {
  .demo__grid { grid-template-columns: 1fr; grid-template-areas: 'tabs' 'device' 'copy'; gap: 28px; }
  .demo__tabs {
    flex-direction: row; gap: 8px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
    margin-inline: -24px; padding: 2px 24px 6px;
  }
  .demo__tabs::-webkit-scrollbar { display: none; }
  .demo__tab {
    flex: 0 0 auto; scroll-snap-align: center; padding: 10px 16px 12px; border: 1px solid var(--ink-line); border-radius: 999px; overflow: hidden; gap: 8px;
  }
  .demo__label { font-size: 1.15rem; }
  .demo__tab.on { background: var(--ink-2); border-color: #4a4a4a; }
  .demo__bar { left: 16px; right: 16px; width: auto; bottom: 5px; }
  .demo__copy { text-align: center; }
  .demo__copy p { margin-inline: auto; }
}
@media (max-width: 480px) { .demo__tabs { margin-inline: -16px; padding-inline: 16px; } }
</style>
