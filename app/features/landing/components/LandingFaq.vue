<script setup lang="ts">
const open = ref<number | null>(0)
function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <section id="faq" class="lp-section faq">
    <div class="lp-container faq__inner">
      <header data-reveal>
        <p class="lp-eyebrow"><b>08</b> Dúvidas</p>
        <h2 class="lp-h2">Pergunta <em>aqui.</em></h2>
        <p class="lp-lead">Não achou a resposta? Chama a gente no Instagram ou no WhatsApp.</p>
      </header>

      <ul class="faq__list" data-reveal="1">
        <li v-for="(f, i) in LANDING.faq" :key="f.q" :class="{ open: open === i }">
          <h3>
            <button :id="`faq-q-${i}`" type="button" :aria-expanded="open === i" :aria-controls="`faq-a-${i}`" @click="toggle(i)">
              <span>{{ f.q }}</span>
              <i class="faq__icon" aria-hidden="true" />
            </button>
          </h3>
          <div :id="`faq-a-${i}`" class="faq__a" role="region" :aria-labelledby="`faq-q-${i}`">
            <div><p>{{ f.a }}</p></div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq__inner { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
.faq__inner header { position: sticky; top: 100px; }
.faq__list { border-top: 1px solid var(--line); }
.faq__list li { border-bottom: 1px solid var(--line); }
.faq__list button {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 22px 0; border: 0; background: none;
  text-align: left; font-size: 1.08rem; font-weight: 700; color: var(--ink); -webkit-tap-highlight-color: transparent;
}
.faq__icon { position: relative; width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; background: var(--bone-2); transition: background 0.3s, transform 0.4s var(--ease-out); }
.faq__icon::before, .faq__icon::after { content: ''; position: absolute; left: 11px; right: 11px; top: 17px; height: 2px; border-radius: 2px; background: var(--ink); transition: transform 0.4s var(--ease-out); }
.faq__icon::after { transform: rotate(90deg); }
.faq__list button:hover .faq__icon { background: var(--line); }
.open .faq__icon { background: var(--volt); transform: rotate(180deg); }
.open .faq__icon::after { transform: rotate(0deg); }
.faq__a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s var(--ease-out); }
.faq__a > div { overflow: hidden; }
.faq__a p { padding: 0 52px 24px 0; color: var(--graphite); line-height: 1.7; }
.open .faq__a { grid-template-rows: 1fr; }
@media (max-width: 900px) {
  .faq__inner { grid-template-columns: 1fr; }
  .faq__inner header { position: static; }
  .faq__list button { font-size: 1rem; padding: 18px 0; }
  .faq__a p { padding-right: 0; }
}
</style>
