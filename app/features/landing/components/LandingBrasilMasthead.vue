<template>
  <!-- Exibido apenas com o tema "Copa Brasil" ativo (configurações do admin) -->
  <div class="bm" aria-hidden="true">
    <div class="bm__tricolor"><span /><span /><span /></div>
    <div class="bm__body">
      <span class="bm__stars">★ ★ ★ ★ ★</span>
      <span class="bm__copa">Copa do Mundo FIFA · 2026</span>
      <span class="bm__title">BRASIL</span>
      <span class="bm__club">CL Academy</span>
    </div>
  </div>
</template>

<style scoped>
.bm { display: none; flex-direction: column; background: #002776; padding-top: 72px; }
:root[data-theme='brasil'] .bm { display: flex; }
.bm__tricolor { display: flex; height: 4px; }
.bm__tricolor span { flex: 1; }
.bm__tricolor span:nth-child(1) { background: #009c3b; }
.bm__tricolor span:nth-child(2) { background: #ffdf00; }
.bm__tricolor span:nth-child(3) { background: #fff; }
.bm__body { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 36px 24px 32px; }
.bm__stars { font-size: 0.85rem; letter-spacing: 12px; color: rgba(255, 223, 0, 0.7); }
.bm__copa { font-size: 0.6rem; letter-spacing: 6px; text-transform: uppercase; color: rgba(255, 255, 255, 0.5); }
.bm__title { font-size: clamp(3rem, 11vw, 6.5rem); font-weight: 900; letter-spacing: 0.22em; color: #fff; line-height: 1; }
.bm__club { font-size: 0.68rem; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255, 255, 255, 0.45); }
</style>
