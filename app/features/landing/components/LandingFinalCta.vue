<script setup lang="ts">
defineProps<{ whatsapp?: string | null }>()
</script>

<template>
  <section class="final">
    <div class="final__bg" aria-hidden="true">
      <div class="final__row"><span v-for="n in 6" :key="n">Bora treinar&nbsp;</span></div>
      <div class="final__row final__row--rev"><span v-for="n in 6" :key="n">Bora treinar&nbsp;</span></div>
    </div>
    <div class="lp-container final__inner" data-reveal data-reveal-from="scale">
      <BrandLogo variant="mark" class="final__mark" />
      <h2 class="final__title">Seu próximo treino <em>já está esperando.</em></h2>
      <p class="final__lead">Cria a conta, escolhe o plano e o seu professor manda a primeira ficha direto no app.</p>
      <div class="final__cta">
        <NuxtLink to="/cadastro" class="lp-btn lp-btn--light">Criar minha conta <i class="pi pi-arrow-right" /></NuxtLink>
        <a
          v-if="whatsappUrl(whatsapp)"
          :href="whatsappUrl(whatsapp, 'Oi! Quero saber mais sobre a CL Academy.')!"
          target="_blank"
          rel="noopener"
          class="lp-btn lp-btn--ghost-light"
        >
          <i class="pi pi-whatsapp" /> Falar no WhatsApp
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.final { position: relative; overflow: hidden; padding: clamp(96px, 14vw, 180px) 0; background: var(--ink); color: var(--bone); text-align: center; isolation: isolate; }
.final__bg { position: absolute; inset: 0; z-index: -1; display: flex; flex-direction: column; justify-content: center; gap: 0; opacity: 0.9; pointer-events: none; }
.final__row { display: flex; width: max-content; animation: lp-marquee 40s linear infinite; }
.final__row--rev { animation-direction: reverse; }
.final__row span {
  font-family: var(--f-display); font-weight: 800; font-style: italic; text-transform: uppercase; white-space: nowrap;
  font-size: clamp(5rem, 16vw, 13rem); line-height: 0.9; color: transparent; -webkit-text-stroke: 1.5px var(--ink-line);
}
.final__inner { position: relative; display: flex; flex-direction: column; align-items: center; }
.final__mark { font-size: 84px; color: var(--bone); margin-bottom: 12px; }
.final__title { max-width: 820px; font-family: var(--f-display); font-weight: 800; text-transform: uppercase; font-size: clamp(2.8rem, 8vw, 5.6rem); line-height: 0.9; text-wrap: balance; }
.final__title em { font-style: italic; color: var(--hi); }
.final__lead { margin-top: 22px; max-width: 480px; color: #b8b8b8; font-size: 1.08rem; line-height: 1.6; }
.final__cta { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
@media (max-width: 520px) { .final__cta .lp-btn { flex: 1 1 100%; } }
</style>
