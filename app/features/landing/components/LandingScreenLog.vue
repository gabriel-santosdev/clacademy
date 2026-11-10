<script setup lang="ts">
/** Tela "Registrar": slider de esforço (1 a 10) e resposta do professor que muda conforme a nota. */
const rpe = ref(7)
const stage = ref<'form' | 'typing' | 'reply'>('form')

const zones = [
  { max: 3, label: 'Leve', color: '#9ad0f5' },
  { max: 6, label: 'Moderado', color: '#ffe066' },
  { max: 8, label: 'Forte', color: '#ffb020' },
  { max: 10, label: 'Máximo', color: '#ff5a1f' },
]
const zone = computed(() => zones.find((z) => rpe.value <= z.max)!)
const reply = computed(() =>
  rpe.value <= 3
    ? 'Ficou fácil? Semana que vem a gente aperta o pace dos tiros.'
    : rpe.value <= 6
      ? 'Esse é o esforço certo pra essa fase. Mantém o ritmo no próximo.'
      : rpe.value <= 8
        ? 'Boa! Pesou no fim, mas fechou todos. Quinta é rodagem leve.'
        : 'Foi no limite. Amanhã descanso total e quinta a gente ajusta a carga.',
)

let timer: ReturnType<typeof setTimeout> | undefined
function send() {
  stage.value = 'typing'
  timer = setTimeout(() => (stage.value = 'reply'), prefersReducedMotion() ? 0 : 1400)
}
function again() {
  clearTimeout(timer)
  stage.value = 'form'
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="log" :style="{ '--zone': zone.color, '--pct': `${((rpe - 1) / 9) * 100}%` }">
    <div class="log__session">
      <span class="log__tag">CL Run</span>
      <p class="log__title">Intervalado</p>
      <p class="log__sub">8 × 400 m · rec. 1 min</p>
    </div>

    <div class="log__stats">
      <div><strong>6,2</strong><span>km</span></div>
      <div><strong>34:10</strong><span>tempo</span></div>
      <div><strong>5:31</strong><span>pace</span></div>
    </div>

    <Transition name="swap" mode="out-in">
      <div v-if="stage === 'form'" key="form" class="log__form">
        <label class="log__label" for="lp-rpe">Esforço percebido</label>
        <div class="log__rpe">
          <strong>{{ rpe }}</strong>
          <span>/10 · {{ zone.label }}</span>
        </div>
        <input id="lp-rpe" v-model.number="rpe" class="log__range" type="range" min="1" max="10" step="1" aria-describedby="lp-rpe-zone" />
        <div id="lp-rpe-zone" class="log__scale" aria-hidden="true"><span>Leve</span><span>Máximo</span></div>
        <p class="log__note">"Último tiro pesou, mas fechei todos."</p>
        <button type="button" class="log__send" @click="send"><i class="pi pi-send" /> Enviar pro professor</button>
      </div>

      <div v-else key="chat" class="log__chat" aria-live="polite">
        <div class="msg msg--me">
          <span class="msg__rpe">Esforço {{ rpe }}/10</span>
          Último tiro pesou, mas fechei todos.
        </div>
        <div v-if="stage === 'typing'" class="msg msg--coach msg--typing" aria-label="Professor digitando"><i /><i /><i /></div>
        <div v-else class="msg msg--coach">
          <span class="msg__who">Seu professor</span>
          {{ reply }}
        </div>
        <button v-if="stage === 'reply'" type="button" class="log__again" @click="again"><i class="pi pi-refresh" /> Testar outro esforço</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.log { display: flex; flex-direction: column; gap: 0.85em; padding-top: 0.6em; height: 100%; }
.log__tag { display: inline-block; padding: 0.2em 0.6em; border-radius: 0.4em; background: #1f1f1f; color: var(--hi); font-family: var(--f-display); font-weight: 800; font-size: 0.85em; letter-spacing: 0.08em; text-transform: uppercase; }
.log__title { font-family: var(--f-display); font-size: 2.6em; font-weight: 800; line-height: 0.9; text-transform: uppercase; margin-top: 0.2em; }
.log__sub { font-size: 0.95em; color: #5e5e5e; font-weight: 600; }
.log__stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4em; }
.log__stats div { padding: 0.55em 0.7em; border-radius: 0.9em; background: #fff; border: 1px solid #e6e6e6; display: flex; flex-direction: column; }
.log__stats strong { font-family: var(--f-display); font-size: 1.7em; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.log__stats span { font-size: 0.75em; text-transform: uppercase; letter-spacing: 0.08em; color: #8a8a8a; font-weight: 700; }

.log__form { display: flex; flex-direction: column; gap: 0.5em; padding: 0.9em; border-radius: 1.2em; background: #fff; border: 1px solid #e6e6e6; }
.log__label { font-size: 0.8em; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #8a8a8a; }
.log__rpe { display: flex; align-items: baseline; gap: 0.3em; }
.log__rpe strong { font-family: var(--f-display); font-size: 3.4em; font-weight: 800; line-height: 0.85; font-variant-numeric: tabular-nums; }
.log__rpe span { font-weight: 800; font-size: 1em; }

.log__range { -webkit-appearance: none; appearance: none; width: 100%; height: 2.4em; background: transparent; cursor: grab; touch-action: pan-y; }
.log__range:active { cursor: grabbing; }
.log__range::-webkit-slider-runnable-track {
  height: 0.9em; border-radius: 1em;
  background: linear-gradient(90deg, var(--zone) var(--pct), #ececec var(--pct));
}
.log__range::-moz-range-track { height: 0.9em; border-radius: 1em; background: #ececec; }
.log__range::-moz-range-progress { height: 0.9em; border-radius: 1em; background: var(--zone); }
.log__range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 2.2em; height: 2.2em; margin-top: -0.65em; border-radius: 50%;
  background: #1f1f1f; border: 0.3em solid #fff; box-shadow: 0 0.2em 0.6em rgba(0, 0, 0, 0.3);
  transition: transform 0.2s var(--ease-spring);
}
.log__range:active::-webkit-slider-thumb { transform: scale(1.15); }
.log__range::-moz-range-thumb { width: 1.6em; height: 1.6em; border-radius: 50%; background: #1f1f1f; border: 0.3em solid #fff; box-shadow: 0 0.2em 0.6em rgba(0, 0, 0, 0.3); }
.log__range:focus-visible { outline: 2px solid #1f1f1f; outline-offset: 2px; border-radius: 1em; }
.log__scale { display: flex; justify-content: space-between; font-size: 0.75em; font-weight: 700; color: #8a8a8a; margin-top: -0.4em; }
.log__note { font-size: 0.92em; color: #5e5e5e; font-style: italic; padding: 0.6em 0.7em; border-radius: 0.8em; background: #f5f5f5; }
.log__send {
  display: flex; align-items: center; justify-content: center; gap: 0.5em; height: 3.3em; border-radius: 3em; border: 0;
  background: #1f1f1f; color: #f0f0f0; font-weight: 800; font-size: 1em; margin-top: 0.2em; transition: transform 0.15s;
}
.log__send:active { transform: scale(0.97); }
.log__send .pi { color: var(--hi); }

.log__chat { display: flex; flex-direction: column; gap: 0.6em; }
.msg { max-width: 88%; padding: 0.75em 0.9em; border-radius: 1.2em; font-size: 0.98em; line-height: 1.35; animation: lp-pop 0.45s var(--ease-out); }
.msg--me { align-self: flex-end; background: #1f1f1f; color: #f0f0f0; border-bottom-right-radius: 0.3em; }
.msg--coach { align-self: flex-start; background: #fff; border: 1px solid #e6e6e6; border-bottom-left-radius: 0.3em; }
.msg__rpe { display: block; width: fit-content; margin-bottom: 0.35em; padding: 0.1em 0.5em; border-radius: 0.4em; background: var(--zone); color: #1f1f1f; font-weight: 800; font-size: 0.8em; }
.msg__who { display: block; font-size: 0.78em; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8a8a8a; margin-bottom: 0.2em; }
.msg--typing { display: flex; gap: 0.3em; padding: 1em; }
.msg--typing i { width: 0.5em; height: 0.5em; border-radius: 50%; background: #8a8a8a; animation: lp-blink 1s infinite; }
.msg--typing i:nth-child(2) { animation-delay: 0.15s; }
.msg--typing i:nth-child(3) { animation-delay: 0.3s; }
.log__again { align-self: center; display: inline-flex; align-items: center; gap: 0.4em; margin-top: 0.4em; padding: 0.6em 1em; border-radius: 2em; border: 1px solid #d9d9d9; background: transparent; font-size: 0.9em; font-weight: 700; color: #1f1f1f; }

.swap-enter-active, .swap-leave-active { transition: opacity 0.25s, transform 0.25s var(--ease-out); }
.swap-enter-from { opacity: 0; transform: translateY(0.8em); }
.swap-leave-to { opacity: 0; transform: translateY(-0.8em); }
</style>
