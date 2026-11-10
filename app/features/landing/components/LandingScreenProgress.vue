<script setup lang="ts">
/** Tela "Evolução": gráfico semanal (km ou treinos) com barras animadas. */
const props = withDefaults(defineProps<{ active?: boolean }>(), { active: true })

const weeks = [
  { l: '22/9', km: 12, n: 3 },
  { l: '29/9', km: 15, n: 4 },
  { l: '6/10', km: 11, n: 3 },
  { l: '13/10', km: 18, n: 4 },
  { l: '20/10', km: 21, n: 5 },
  { l: '27/10', km: 17, n: 4 },
  { l: '3/11', km: 24, n: 5 },
  { l: '10/11', km: 27, n: 6 },
]
const metric = ref<'km' | 'n'>('km')
const max = computed(() => Math.max(...weeks.map((w) => w[metric.value])))
const grown = ref(false)
watch(
  () => props.active,
  (a) => {
    grown.value = false
    if (a) requestAnimationFrame(() => requestAnimationFrame(() => (grown.value = true)))
  },
  { immediate: import.meta.client },
)
</script>

<template>
  <div class="prog">
    <div class="prog__head">
      <p class="prog__title">Evolução</p>
      <div class="prog__seg" role="group" aria-label="Métrica">
        <button type="button" :class="{ on: metric === 'km' }" :aria-pressed="metric === 'km'" @click="metric = 'km'">Km</button>
        <button type="button" :class="{ on: metric === 'n' }" :aria-pressed="metric === 'n'" @click="metric = 'n'">Treinos</button>
      </div>
    </div>

    <div class="prog__big">
      <strong>{{ metric === 'km' ? '145' : '34' }}</strong>
      <span>{{ metric === 'km' ? 'km em 8 semanas' : 'treinos em 8 semanas' }}</span>
      <em><i class="pi pi-arrow-up-right" /> {{ metric === 'km' ? '+125%' : '+100%' }}</em>
    </div>

    <div class="prog__chart">
      <div v-for="(w, i) in weeks" :key="w.l" class="prog__col">
        <span class="prog__val">{{ w[metric] }}</span>
        <span
          class="prog__bar"
          :class="{ last: i === weeks.length - 1 }"
          :style="{ height: grown ? `${(w[metric] / max) * 100}%` : '4%', transitionDelay: `${i * 50}ms` }"
        />
        <small>{{ w.l }}</small>
      </div>
    </div>

    <div class="prog__kpis">
      <div><strong>5:42</strong><span>pace médio</span></div>
      <div><strong>4,3</strong><span>treinos/sem</span></div>
    </div>
    <div class="prog__strava"><i class="pi pi-check-circle" /> Atualiza a cada corrida registrada</div>
  </div>
</template>

<style scoped>
.prog { display: flex; flex-direction: column; gap: 0.9em; padding-top: 0.6em; }
.prog__head { display: flex; justify-content: space-between; align-items: center; }
.prog__title { font-family: var(--f-display); font-size: 2.2em; font-weight: 800; line-height: 0.9; text-transform: uppercase; }
.prog__seg { display: flex; padding: 0.2em; border-radius: 2em; background: #e6e6e6; }
.prog__seg button { padding: 0.35em 0.75em; border-radius: 2em; border: 0; background: transparent; font-size: 0.85em; font-weight: 800; color: #5e5e5e; transition: background 0.25s, color 0.25s; }
.prog__seg button.on { background: #1f1f1f; color: #f0f0f0; }
.prog__big { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 0.4em; }
.prog__big strong { font-family: var(--f-display); font-size: 3.6em; font-weight: 800; line-height: 0.9; font-variant-numeric: tabular-nums; }
.prog__big span { font-size: 0.9em; font-weight: 700; color: #5e5e5e; }
.prog__big em { width: 100%; font-style: normal; font-size: 0.85em; font-weight: 800; display: inline-flex; align-items: center; gap: 0.3em; }
.prog__big em .pi { font-size: 0.8em; padding: 0.3em; border-radius: 50%; background: #1a1a1a; color: #fff; }
.prog__chart { height: 10.5em; display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.35em; padding: 0.8em 0.7em 0.5em; border-radius: 1.2em; background: #fff; border: 1px solid #e6e6e6; }
.prog__col { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 0.25em; min-width: 0; }
.prog__val { font-size: 0.7em; font-weight: 800; color: #8a8a8a; font-variant-numeric: tabular-nums; }
.prog__bar { width: 100%; max-height: calc(100% - 2.4em); border-radius: 0.4em 0.4em 0.15em 0.15em; background: #cfcfcf; transition: height 0.7s var(--ease-out); }
.prog__bar.last { background: #1f1f1f; box-shadow: inset 0 0.35em 0 var(--hi); }
.prog__col small { font-size: 0.55em; font-weight: 700; color: #8a8a8a; white-space: nowrap; }
.prog__kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4em; }
.prog__kpis div { padding: 0.55em 0.8em; border-radius: 0.9em; background: #fff; border: 1px solid #e6e6e6; }
.prog__kpis strong { display: block; font-family: var(--f-display); font-size: 1.7em; font-weight: 800; line-height: 1; }
.prog__kpis span { font-size: 0.75em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #8a8a8a; }
.prog__strava { display: flex; align-items: center; gap: 0.5em; font-size: 0.85em; font-weight: 700; color: #5e5e5e; }
.prog__strava .pi { color: #1a1a1a; }
</style>
