<template>
  <div class="ticker" aria-hidden="true">
    <div class="ticker__row">
      <div class="ticker__track">
        <template v-for="n in 4" :key="n">
          <span v-for="t in LANDING.ticker" :key="`${n}${t}`" class="ticker__item">{{ t }}<i>✱</i></span>
        </template>
      </div>
    </div>
    <div class="ticker__row ticker__row--alt">
      <div class="ticker__track ticker__track--rev">
        <template v-for="n in 4" :key="n">
          <span v-for="t in ['Registra', 'Recebe retorno', 'Ajusta a carga', 'Evolui', 'Repete']" :key="`${n}${t}`" class="ticker__item">{{ t }}<i>→</i></span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker { position: relative; z-index: 2; padding: 18px 0; overflow: hidden; }
.ticker__row { background: var(--ink); transform: rotate(-2deg); margin: 0 -20px; padding: 14px 0; }
.ticker__row--alt { background: var(--hi); transform: rotate(1.4deg); margin-top: -6px; padding: 10px 0; }
.ticker__track { display: flex; width: max-content; animation: lp-marquee 38s linear infinite; }
.ticker__track--rev { animation-direction: reverse; animation-duration: 46s; }
.ticker__item {
  display: inline-flex; align-items: center; gap: 22px; padding-right: 22px;
  font-family: var(--f-display); font-size: clamp(1.6rem, 4vw, 2.6rem); font-weight: 800; font-style: italic; text-transform: uppercase; line-height: 1; white-space: nowrap;
  color: var(--bone);
}
.ticker__item i { font-style: normal; color: var(--hi); font-size: 0.7em; }
.ticker__row--alt .ticker__item { font-size: clamp(1rem, 2.2vw, 1.35rem); color: var(--hi-ink); font-style: normal; letter-spacing: 0.04em; }
.ticker__row--alt .ticker__item i { color: var(--hi-ink); }
.ticker:hover .ticker__track { animation-play-state: paused; }
</style>
