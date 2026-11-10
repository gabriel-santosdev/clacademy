<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
const seen = useInView(root, { once: true, threshold: 0.3 })
</script>

<template>
  <section ref="root" class="lp-section how" :class="{ go: seen }">
    <div class="lp-container">
      <header class="how__head" data-reveal>
        <p class="lp-eyebrow"><b>04</b> Começo</p>
        <h2 class="lp-h2">Do cadastro ao <em>primeiro treino.</em></h2>
      </header>

      <ol class="how__steps">
        <li v-for="(s, i) in LANDING.steps" :key="s.title" :style="{ '--i': i }">
          <span class="how__dot"><b>{{ i + 1 }}</b></span>
          <div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.text }}</p>
          </div>
        </li>
        <li class="how__finish" :style="{ '--i': 3 }" aria-hidden="true"><span>Chegada</span></li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.how { background: var(--bone-2); }
.how__head { margin-bottom: clamp(44px, 6vw, 72px); }

.how__steps { position: relative; display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 24px; }
/* pista: linha cinza + linha preta que corre até a chegada */
.how__steps::before, .how__steps::after { content: ''; position: absolute; left: 0; right: 0; top: 27px; height: 4px; border-radius: 4px; }
.how__steps::before { background: repeating-linear-gradient(90deg, var(--line) 0 14px, transparent 14px 22px); }
.how__steps::after { background: var(--ink); transform: scaleX(0); transform-origin: left; transition: transform 1.8s var(--ease-out) 0.2s; }
.how.go .how__steps::after { transform: scaleX(1); }

.how__steps li { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 22px; opacity: 0.35; transition: opacity 0.6s; transition-delay: calc(var(--i) * 450ms + 300ms); }
.how.go .how__steps li { opacity: 1; }
.how__dot {
  width: 58px; height: 58px; border-radius: 50%; display: grid; place-items: center; background: var(--bone-2);
  border: 3px solid var(--line); transition: border-color 0.4s, background 0.4s; transition-delay: inherit;
}
.how__dot b { font-family: var(--f-display); font-size: 1.6rem; font-weight: 800; }
.how.go .how__dot { border-color: var(--ink); background: var(--ink); color: var(--volt); }
.how__steps h3 { font-family: var(--f-display); font-size: clamp(1.8rem, 3vw, 2.3rem); font-weight: 800; text-transform: uppercase; line-height: 0.95; }
.how__steps p { margin-top: 10px; max-width: 300px; color: var(--graphite); line-height: 1.6; }

.how__finish { justify-content: flex-start; }
.how__finish span {
  display: grid; place-items: center; height: 58px; padding: 0 18px; border-radius: 12px;
  font-family: var(--f-display); font-size: 1.2rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
  background: repeating-conic-gradient(var(--ink) 0 25%, var(--bone) 0 50%) 0 0 / 14px 14px; color: transparent; position: relative;
}
.how__finish span::after { content: 'Chegada'; position: absolute; inset: 8px; display: grid; place-items: center; border-radius: 6px; background: var(--volt); color: var(--volt-ink); font-size: 1rem; }

@media (max-width: 860px) {
  .how__steps { grid-template-columns: 1fr; gap: 34px; padding-left: 0; }
  .how__steps::before, .how__steps::after { left: 27px; right: auto; top: 0; bottom: 0; width: 4px; height: auto; }
  .how__steps::before { background: repeating-linear-gradient(180deg, var(--line) 0 14px, transparent 14px 22px); }
  .how__steps::after { transform: scaleY(0); transform-origin: top; }
  .how.go .how__steps::after { transform: scaleY(1); }
  .how__steps li { flex-direction: row; align-items: flex-start; gap: 20px; }
  .how__dot { flex-shrink: 0; }
  .how__finish span { margin-left: 0; }
}
</style>
