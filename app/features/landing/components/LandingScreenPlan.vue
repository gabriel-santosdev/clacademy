<script setup lang="ts">
/** Tela "Planilha de corrida": semana com dias tocáveis e detalhe da sessão. */
interface Day {
  d: string
  n: number
  type?: string
  km?: string
  pace?: string
  text?: string
}
const days: Day[] = [
  { d: 'S', n: 10, type: 'Funcional', text: 'Aula coletiva às 7h. Foco em core e mobilidade de quadril.' },
  { d: 'T', n: 11, type: 'Intervalado', km: '6', pace: '5:20', text: '8 tiros de 400 m com 1 min de trote entre eles.' },
  { d: 'Q', n: 12 },
  { d: 'Q', n: 13, type: 'Rodagem', km: '7', pace: '6:10', text: 'Ritmo de conversa. Se não consegue falar, diminui.' },
  { d: 'S', n: 14, type: 'Dança', text: 'Aula de ritmos. Conta como treino regenerativo.' },
  { d: 'S', n: 15, type: 'Longão', km: '14', pace: '6:30', text: 'Começa leve e termina os 2 últimos km no pace de prova.' },
  { d: 'D', n: 16 },
]
const sel = ref(3)
const day = computed(() => days[sel.value]!)
</script>

<template>
  <div class="plan">
    <div class="plan__head">
      <span class="plan__tag">Meta · 10K em 55 min</span>
      <p class="plan__title">Semana 5</p>
      <div class="plan__weeks" aria-label="Semana 5 de 10">
        <span v-for="w in 10" :key="w" :class="{ past: w < 5, now: w === 5 }" />
      </div>
    </div>

    <div class="plan__strip" role="tablist" aria-label="Dias da semana">
      <button
        v-for="(x, i) in days"
        :key="i"
        type="button"
        role="tab"
        :aria-selected="sel === i"
        :class="{ on: sel === i, rest: !x.type, run: !!x.km }"
        @click="sel = i"
      >
        <small>{{ x.d }}</small>
        <b>{{ x.n }}</b>
        <i />
      </button>
    </div>

    <Transition name="card" mode="out-in">
      <div :key="sel" class="plan__card" :class="{ 'plan__card--rest': !day.type }">
        <template v-if="day.type">
          <p class="plan__type">{{ day.type }}</p>
          <div v-if="day.km" class="plan__nums">
            <div><strong>{{ day.km }}</strong><span>km</span></div>
            <div><strong>{{ day.pace }}</strong><span>pace alvo</span></div>
          </div>
          <p class="plan__text">{{ day.text }}</p>
          <span class="plan__btn"><i class="pi pi-check" /> Registrar</span>
        </template>
        <template v-else>
          <i class="pi pi-moon" />
          <p class="plan__type">Descanso</p>
          <p class="plan__text">Dormir bem também é treino.</p>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.plan { display: flex; flex-direction: column; gap: 0.9em; padding-top: 0.6em; }
.plan__tag { display: inline-block; padding: 0.25em 0.6em; border-radius: 0.4em; background: #1a1a1a; color: #fff; font-weight: 800; font-size: 0.8em; }
.plan__title { font-family: var(--f-display); font-size: 2.6em; font-weight: 800; line-height: 0.9; text-transform: uppercase; margin-top: 0.25em; }
.plan__weeks { display: flex; gap: 0.25em; margin-top: 0.6em; }
.plan__weeks span { flex: 1; height: 0.35em; border-radius: 1em; background: #e2e2e2; }
.plan__weeks .past { background: #5e5e5e; }
.plan__weeks .now { background: #1f1f1f; box-shadow: 0 0 0 0.12em #fff, 0 0 0 0.24em #1f1f1f; }

.plan__strip { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.3em; }
.plan__strip button {
  display: flex; flex-direction: column; align-items: center; gap: 0.1em; padding: 0.5em 0 0.55em; border-radius: 1em;
  background: #fff; border: 1px solid #e6e6e6; color: #1f1f1f; font-size: 1em;
  transition: background 0.25s, color 0.25s, transform 0.15s; -webkit-tap-highlight-color: transparent;
}
.plan__strip button:active { transform: scale(0.94); }
.plan__strip small { font-size: 0.72em; font-weight: 800; color: #8a8a8a; }
.plan__strip b { font-family: var(--f-display); font-size: 1.35em; font-weight: 800; line-height: 1; }
.plan__strip i { width: 0.4em; height: 0.4em; border-radius: 50%; background: #5e5e5e; }
.plan__strip .run i { background: #1f1f1f; box-shadow: 0 0 0 0.12em #fff, 0 0 0 0.24em #c7c7c7; }
.plan__strip .rest i { background: transparent; }
.plan__strip button.on { background: #1f1f1f; color: #f0f0f0; border-color: #1f1f1f; }
.plan__strip button.on small { color: #a6a6a6; }
.plan__strip button.on i { background: var(--hi); box-shadow: none; }

.plan__card { display: flex; flex-direction: column; gap: 0.6em; padding: 1em; border-radius: 1.2em; background: #1f1f1f; color: #f0f0f0; min-height: 12.5em; }
.plan__card--rest { background: #fff; color: #1f1f1f; border: 1px dashed #cfcfcf; align-items: center; justify-content: center; text-align: center; }
.plan__card--rest .pi { font-size: 1.6em; color: #8a8a8a; }
.plan__type { font-family: var(--f-display); font-size: 1.9em; font-weight: 800; text-transform: uppercase; line-height: 1; }
.plan__nums { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; }
.plan__nums div { padding: 0.5em 0.7em; border-radius: 0.8em; background: #2c2c2c; }
.plan__nums strong { display: block; font-family: var(--f-display); font-size: 1.9em; font-weight: 800; line-height: 1; color: var(--hi); font-variant-numeric: tabular-nums; }
.plan__nums span { font-size: 0.75em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #a6a6a6; }
.plan__text { font-size: 0.95em; line-height: 1.4; color: inherit; opacity: 0.85; }
.plan__btn { align-self: flex-start; display: inline-flex; align-items: center; gap: 0.4em; margin-top: auto; padding: 0.55em 0.9em; border-radius: 2em; background: var(--hi); color: #1f1f1f; font-weight: 800; font-size: 0.88em; }

.card-enter-active, .card-leave-active { transition: opacity 0.2s, transform 0.25s var(--ease-out); }
.card-enter-from { opacity: 0; transform: translateX(1em); }
.card-leave-to { opacity: 0; transform: translateX(-1em); }
</style>
