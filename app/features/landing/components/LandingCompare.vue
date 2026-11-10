<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
const seen = useInView(root, { once: true, threshold: 0.35 })
const mode = ref<'before' | 'after'>('before')
const touched = ref(false)

/* ao entrar na tela, mostra o "antes" por um instante e vira sozinho para o "depois" */
watch(seen, (v) => {
  if (!v || touched.value) return
  setTimeout(() => !touched.value && (mode.value = 'after'), prefersReducedMotion() ? 0 : 1300)
})
function set(m: 'before' | 'after') {
  touched.value = true
  mode.value = m
}
</script>

<template>
  <section id="diferenca" ref="root" class="lp-section cmp">
    <div class="lp-container">
      <div class="cmp__layout">
        <div class="cmp__title" data-reveal>
          <p class="lp-eyebrow"><b>02</b> Diferença</p>
          <h2 class="lp-h2">Não é só mais um <em>app de ficha.</em></h2>
        </div>
        <div class="cmp__switch" role="radiogroup" aria-label="Comparar" data-reveal="1">
          <button type="button" role="radio" :aria-checked="mode === 'before'" :class="{ on: mode === 'before' }" @click="set('before')">App de ficha comum</button>
          <button type="button" role="radio" :aria-checked="mode === 'after'" :class="{ on: mode === 'after' }" @click="set('after')">
            <BrandLogo bold class="cmp__logo" />
          </button>
          <span class="cmp__thumb" :class="mode" aria-hidden="true" />
        </div>

      <ul class="cmp__grid" :class="mode" data-reveal="1">
        <li v-for="(c, i) in LANDING.compare" :key="c.topic" class="cmp__card" :style="{ '--i': i }">
          <div class="cmp__top">
            <span class="cmp__icon"><i :class="['pi', c.icon]" /></span>
            <span class="cmp__topic">{{ c.topic }}</span>
            <span class="cmp__state"><i :class="['pi', mode === 'after' ? 'pi-check' : 'pi-times']" /></span>
          </div>
          <div class="cmp__flip">
            <p class="cmp__before">{{ c.before }}</p>
            <p class="cmp__after">{{ c.after }}</p>
          </div>
        </li>
      </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cmp__layout { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: clamp(36px, 5vw, 56px) 32px; }
.cmp__title .lp-h2 { max-width: 640px; }

.cmp__switch { position: relative; display: grid; grid-template-columns: 1fr 1fr; padding: 5px; border-radius: 999px; background: var(--bone-2); border: 1px solid var(--line); isolation: isolate; }
.cmp__switch button {
  position: relative; z-index: 1; display: grid; place-items: center; height: 48px; padding: 0 20px; border: 0; border-radius: 999px; background: none;
  font-size: 0.9rem; font-weight: 700; color: var(--graphite); white-space: nowrap; transition: color 0.3s;
}
.cmp__switch button.on { color: var(--bone); }
.cmp__logo { font-size: 40px; }
.cmp__thumb { position: absolute; z-index: 0; top: 5px; bottom: 5px; left: 5px; width: calc(50% - 5px); border-radius: 999px; background: var(--ink); transition: transform 0.5s var(--ease-spring); }
.cmp__thumb.after { transform: translateX(100%); }
.cmp__switch button:last-of-type.on { color: var(--hi); }

.cmp__grid { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.cmp__card {
  position: relative; padding: 22px 22px 26px; border-radius: 22px; background: var(--paper); border: 1px solid var(--line);
  transition: background 0.5s, border-color 0.5s, color 0.5s; transition-delay: calc(var(--i) * 60ms);
}
.cmp__top { display: flex; align-items: center; gap: 12px; }
.cmp__icon { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: var(--bone-2); color: var(--graphite); transition: background 0.5s, color 0.5s; transition-delay: inherit; }
.cmp__topic { flex: 1; font-family: var(--f-display); font-size: 1.35rem; font-weight: 800; text-transform: uppercase; line-height: 1; }
.cmp__state { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-size: 0.75rem; background: var(--bone-2); color: var(--graphite); transition: background 0.5s, color 0.5s, transform 0.5s var(--ease-spring); transition-delay: inherit; }
.cmp__flip { display: grid; margin-top: 16px; }
.cmp__flip p { grid-area: 1 / 1; font-size: 1rem; line-height: 1.55; transition: opacity 0.45s, transform 0.55s var(--ease-out); transition-delay: inherit; }
.cmp__before { color: var(--graphite); }
.cmp__after { opacity: 0; transform: translateY(12px); }

.cmp__grid.after .cmp__card { background: var(--ink); border-color: var(--ink); color: var(--bone); }
.cmp__grid.after .cmp__icon { background: var(--ink-2); color: var(--hi); }
.cmp__grid.after .cmp__state { background: var(--hi); color: var(--hi-ink); transform: rotate(360deg); }
.cmp__grid.after .cmp__before { opacity: 0; transform: translateY(-12px); }
.cmp__grid.after .cmp__after { opacity: 1; transform: none; color: #d6d6d6; }

@media (max-width: 960px) { .cmp__grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 620px) {
  .cmp__grid { grid-template-columns: 1fr; gap: 10px; }
  .cmp__layout { grid-template-columns: 1fr; gap: 24px; }
  .cmp__switch { width: 100%; position: sticky; top: 76px; z-index: 5; box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.4); }
  .cmp__switch button { padding: 0 10px; font-size: 0.85rem; }
  .cmp__card { padding: 18px 18px 20px; }
}
</style>
