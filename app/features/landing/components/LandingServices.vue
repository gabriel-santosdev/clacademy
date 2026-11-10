<script setup lang="ts">
import imgPersonal from '~/assets/landing/personal.webp'
import imgEventos from '~/assets/landing/coletiva.webp'

const services = LANDING.services
const personal = services.find((s) => s.key === 'personal')!
const corrida = services.find((s) => s.key === 'corrida')!
const eventos = services.find((s) => s.key === 'eventos')!
</script>

<template>
  <section id="servicos" class="lp-section srv">
    <div class="lp-container">
      <header class="srv__head" data-reveal>
        <p class="lp-eyebrow"><b>03</b> Serviços</p>
        <h2 class="lp-h2">Dois jeitos de treinar. <em>Um app.</em></h2>
        <p class="lp-lead">Personal para ganhar força, assessoria para correr melhor. Os dois com professor acompanhando cada treino.</p>
      </header>

      <div class="srv__main">
        <article class="card card--photo" data-reveal>
          <img :src="imgPersonal" alt="Treino com personal trainer da CL Academy" loading="lazy" />
          <div class="card__shade" />
          <span class="card__num">01</span>
          <div class="card__body">
            <span class="card__kicker">{{ personal.kicker }}</span>
            <h3>{{ personal.title }}</h3>
            <p>{{ personal.text }}</p>
            <div class="card__tags"><span v-for="t in personal.tags" :key="t">{{ t }}</span></div>
            <a href="#planos" class="lp-btn lp-btn--volt card__cta">Quero personal <i class="pi pi-arrow-right" /></a>
          </div>
        </article>

        <article class="card card--run" data-reveal="1">
          <svg class="card__lanes" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path v-for="l in 6" :key="l" :d="`M ${-40 + l * 34} 420 C ${-40 + l * 34} 200, ${120 + l * 30} 140, 360 ${l * 34 - 30}`" />
          </svg>
          <span class="card__km" aria-hidden="true">5K<br />10K<br /><b>21K</b></span>
          <span class="card__num">02</span>
          <div class="card__body">
            <span class="card__kicker">{{ corrida.kicker }}</span>
            <h3>{{ corrida.title }}</h3>
            <p>{{ corrida.text }}</p>
            <div class="card__tags"><span v-for="t in corrida.tags" :key="t">{{ t }}</span></div>
            <a href="#planos" class="lp-btn lp-btn--volt card__cta">Quero correr <i class="pi pi-arrow-right" /></a>
          </div>
        </article>
      </div>

      <article class="ev" data-reveal>
        <div class="ev__photo">
          <img :src="imgEventos" alt="Aulão em evento da CL Academy" loading="lazy" />
        </div>
        <div class="ev__body">
          <span class="ev__kicker"><i class="pi pi-calendar" /> {{ eventos.kicker }}</span>
          <h3>{{ eventos.title }}</h3>
          <p>{{ eventos.text }}</p>
          <div class="card__tags card__tags--dark"><span v-for="t in eventos.tags" :key="t">{{ t }}</span></div>
          <p class="ev__note">Aulas coletivas acontecem só nos eventos. Datas no Instagram e no app.</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.srv__head { max-width: 720px; margin-bottom: clamp(36px, 5vw, 56px); }
.srv__main { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.card {
  position: relative; overflow: hidden; isolation: isolate; display: flex; align-items: flex-end;
  min-height: 600px; border-radius: 28px; background: var(--ink); color: var(--bone);
}
.card img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: grayscale(1) contrast(1.05); transition: filter 0.8s var(--ease-out), transform 1.2s var(--ease-out); }
.card:hover img { filter: grayscale(0); transform: scale(1.04); }
.card__shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(180deg, rgba(31, 31, 31, 0) 30%, rgba(31, 31, 31, 0.95) 88%); }
.card__num { position: absolute; top: 22px; left: 26px; font-family: var(--f-display); font-weight: 800; font-size: 1rem; letter-spacing: 0.1em; color: var(--volt); }
.card__body { padding: 30px; }
.card__kicker { display: inline-block; padding: 4px 10px; border-radius: 6px; background: var(--volt); color: var(--volt-ink); font-family: var(--f-display); font-weight: 800; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; }
.card h3 { margin-top: 14px; font-family: var(--f-display); font-size: clamp(2.6rem, 5vw, 3.6rem); font-weight: 800; text-transform: uppercase; line-height: 0.9; }
.card p { margin-top: 12px; max-width: 440px; font-size: 1rem; line-height: 1.6; color: #d6d5d2; }
.card__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px; }
.card__tags span { font-size: 0.75rem; font-weight: 700; padding: 6px 11px; border-radius: 999px; background: rgba(238, 237, 235, 0.12); border: 1px solid rgba(238, 237, 235, 0.16); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.card__cta { margin-top: 24px; }

.card__lanes { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; }
.card__lanes path { fill: none; stroke: var(--ink-line); stroke-width: 2; }
.card__lanes path:nth-child(3) { stroke: var(--volt); stroke-dasharray: 8 10; animation: lane 3s linear infinite; }
@keyframes lane { to { stroke-dashoffset: -36; } }
.card__km { position: absolute; top: 60px; right: 28px; text-align: right; font-family: var(--f-display); font-weight: 800; font-style: italic; font-size: clamp(4rem, 8vw, 6.4rem); line-height: 0.85; color: var(--graphite); }
.card__km b { color: var(--bone); }

.ev {
  display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 0; margin-top: 16px; overflow: hidden;
  border-radius: 28px; background: var(--paper); border: 1px solid var(--line);
}
.ev__photo { position: relative; min-height: 300px; }
.ev__photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 70%; filter: grayscale(1); transition: filter 0.8s var(--ease-out); }
.ev:hover .ev__photo img { filter: grayscale(0); }
.ev__body { padding: clamp(24px, 4vw, 44px); align-self: center; }
.ev__kicker { display: inline-flex; align-items: center; gap: 8px; font-family: var(--f-display); font-weight: 800; font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--graphite); }
.ev h3 { margin-top: 10px; font-family: var(--f-display); font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 800; text-transform: uppercase; line-height: 0.9; color: var(--ink); }
.ev p { margin-top: 12px; max-width: 520px; line-height: 1.6; color: var(--graphite); }
.card__tags--dark span { background: var(--bone-2); border-color: var(--line); color: var(--ink); backdrop-filter: none; }
.ev__note { font-size: 0.88rem; font-weight: 700; color: var(--ink) !important; }

@media (max-width: 900px) {
  .srv__main { grid-template-columns: 1fr; }
  .card { min-height: 520px; }
  .ev { grid-template-columns: 1fr; }
  .ev__photo { min-height: 220px; }
}
@media (max-width: 480px) {
  .card__body { padding: 22px; }
  .card__cta { width: 100%; }
  .card { min-height: 500px; }
}
</style>
