<script setup lang="ts">
import heroImg from '~/assets/landing/hero.webp'

const { loggedIn, homePath } = useAuth()
const { installed, install } = usePwaInstall()

const stage = ref<HTMLElement | null>(null)
const inView = useInView(stage, { threshold: 0.2 })

/* leve inclinação 3D do celular acompanhando o mouse (só em telas com mouse) */
const tilt = reactive({ x: 0, y: 0 })
function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || !stage.value) return
  const r = stage.value.getBoundingClientRect()
  tilt.x = ((e.clientX - r.left) / r.width - 0.5) * 2
  tilt.y = ((e.clientY - r.top) / r.height - 0.5) * 2
}
function onLeave() {
  tilt.x = 0
  tilt.y = 0
}

const proof = [
  { icon: 'pi-mobile', text: 'Sem loja de app' },
  { icon: 'pi-wifi', text: 'Abre offline' },
  { icon: 'pi-sync', text: 'Conecta com Strava' },
]
</script>

<template>
  <section id="inicio" class="hero">
    <div class="lp-container hero__inner">
      <div class="hero__copy">
        <h1 class="hero__title">
          <span class="w" style="--d: 0">Treino</span>
          <span class="w" style="--d: 1">bom é</span>
          <span class="w" style="--d: 2">treino</span>
          <span class="w" style="--d: 3"><span class="lp-mark">acompanhado.</span></span>
        </h1>
        <p class="hero__lead">
          Personal e assessoria de corrida da CL Academy. No app você recebe a ficha e a planilha, marca o que fez, diz o
          quanto pesou e o seu professor responde.
        </p>
        <div class="hero__cta">
          <NuxtLink v-if="loggedIn" :to="homePath" class="lp-btn lp-btn--volt">Abrir meu treino <i class="pi pi-arrow-right" /></NuxtLink>
          <NuxtLink v-else to="/cadastro" class="lp-btn lp-btn--volt">Criar minha conta <i class="pi pi-arrow-right" /></NuxtLink>
          <button v-if="!installed" type="button" class="lp-btn lp-btn--ghost" @click="install"><i class="pi pi-download" /> Instalar o app</button>
        </div>
        <ul class="hero__proof">
          <li v-for="p in proof" :key="p.text"><i :class="['pi', p.icon]" /> {{ p.text }}</li>
        </ul>
      </div>

      <div
        ref="stage"
        class="hero__stage"
        :style="{ '--tx': tilt.x, '--ty': tilt.y }"
        @pointermove="onMove"
        @pointerleave="onLeave"
      >
        <svg class="hero__track" viewBox="0 0 400 400" aria-hidden="true">
          <circle cx="200" cy="200" r="196" />
          <circle cx="200" cy="200" r="168" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="182" class="dash" />
        </svg>
        <img :src="heroImg" class="hero__photo" alt="Atleta da CL Academy em movimento" width="900" height="1362" fetchpriority="high" />
        <div class="hero__phone">
          <LandingPhoneFrame label="Tela de treino do dia do app CL Academy">
            <LandingScreenToday :autoplay="inView" />
          </LandingPhoneFrame>
        </div>
        <div class="tag tag--rpe"><b>7/10</b> esforço · forte</div>
        <div class="tag tag--km"><i class="pi pi-arrow-up-right" /> +1 km no longão</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; padding: calc(96px + env(safe-area-inset-top)) 0 clamp(40px, 6vw, 72px); overflow: hidden; }
.hero::before {
  /* grade discreta de quadra */
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 72px 72px; mask-image: radial-gradient(ellipse at 70% 40%, #000 0%, transparent 65%); -webkit-mask-image: radial-gradient(ellipse at 70% 40%, #000 0%, transparent 65%);
}
.hero__inner { position: relative; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 32px; align-items: center; min-height: min(calc(100svh - 140px), 760px); }


.hero__title {
  margin-top: 0; font-family: var(--f-display); font-weight: 800; text-transform: uppercase; color: var(--ink);
  font-size: clamp(3.4rem, 10.5vw, 7.2rem); line-height: 0.86; letter-spacing: -0.01em;
}
.hero__title .w { display: inline-block; margin-right: 0.18em; animation: lp-rise 0.8s var(--ease-out) both; animation-delay: calc(var(--d) * 90ms + 120ms); }
.hero__title .lp-mark::after { animation: mark-in 0.9s var(--ease-out) 0.75s both; }
@keyframes mark-in { from { transform: skewX(-12deg) scaleX(0); } to { transform: skewX(-12deg) scaleX(1); } }

.hero__lead { margin-top: 24px; max-width: 520px; font-size: clamp(1rem, 1.5vw, 1.12rem); line-height: 1.65; color: var(--graphite); animation: lp-rise 0.8s var(--ease-out) 0.5s both; }
.hero__cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; animation: lp-rise 0.8s var(--ease-out) 0.62s both; }
.hero__proof { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 28px; animation: lp-fade 0.8s var(--ease-out) 0.85s both; }
.hero__proof li { display: inline-flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600; color: var(--graphite); }
.hero__proof .pi { font-size: 0.85rem; color: var(--ink); }

/* palco: pista + foto + celular */
.hero__stage { position: relative; height: min(680px, 78svh); min-height: 520px; display: grid; place-items: center; perspective: 1200px; }
.hero__track { position: absolute; width: 112%; max-width: 640px; aspect-ratio: 1; animation: spin 80s linear infinite; }
.hero__track circle { fill: none; stroke: var(--line); stroke-width: 1.2; }
.hero__track .dash { stroke: var(--ink); stroke-width: 1.4; stroke-dasharray: 2 14; opacity: 0.45; }
@keyframes spin { to { transform: rotate(360deg); } }
.hero__photo {
  position: absolute; left: -16%; bottom: 0; height: 96%; width: auto; max-width: none; object-fit: contain;
  animation: lp-fade 1.2s var(--ease-out) 0.2s both;
}
.hero__phone {
  position: absolute; right: -6%; bottom: 2%; --phone-w: min(240px, 60vw);
  transform: rotateY(calc(var(--tx) * -8deg)) rotateX(calc(var(--ty) * 6deg)) rotate(3deg);
  transition: transform 0.4s var(--ease-out);
  animation: phone-in 1s var(--ease-out) 0.35s both;
}
@keyframes phone-in { from { opacity: 0; translate: 0 60px; } to { opacity: 1; translate: 0 0; } }

.tag {
  position: absolute; z-index: 2; display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 14px;
  font-size: 0.85rem; font-weight: 700; white-space: nowrap; box-shadow: 0 18px 40px -18px rgba(0, 0, 0, 0.4);
  translate: calc(var(--tx) * 10px) calc(var(--ty) * 10px); transition: translate 0.4s var(--ease-out);
}
.tag--rpe { left: -4%; top: 60%; background: var(--ink); color: var(--bone); animation: lp-pop 0.6s var(--ease-out) 1.1s both, bob 6s ease-in-out 2s infinite; }
.tag--rpe b { font-family: var(--f-display); font-size: 1.3rem; line-height: 1; color: var(--volt); }
.tag--km { right: 2%; top: 4%; background: var(--volt); color: var(--volt-ink); animation: lp-pop 0.6s var(--ease-out) 1.35s both, bob 7s ease-in-out 2.4s infinite; }
@keyframes bob { 50% { transform: translateY(-8px); } }

@media (max-width: 980px) {
  .hero { padding-top: calc(88px + env(safe-area-inset-top)); }
  .hero__inner { grid-template-columns: 1fr; min-height: 0; gap: 8px; }
  .hero__stage { height: 540px; min-height: 0; }
  .hero__photo { left: 4%; height: 92%; }
}
@media (max-width: 560px) {
  .hero__title { font-size: clamp(3.1rem, 15.5vw, 4.4rem); }
  .hero__cta .lp-btn { flex: 1 1 100%; }
  .hero__proof { gap: 8px 16px; }
  .hero__stage { height: 470px; margin-inline: -16px; }
  .hero__photo { left: -10%; height: 90%; }
  .hero__phone { right: 10px; bottom: 2%; --phone-w: 200px; }
  .hero__track { width: 150%; }
  .tag { font-size: 0.78rem; padding: 8px 11px; }
  .tag--rpe { left: 12px; top: auto; bottom: 10%; }
  .tag--km { left: 12px; right: auto; top: 4%; }
}
</style>
