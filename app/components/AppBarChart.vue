<script setup lang="ts">
/** Gráfico de barras simples (PrimeVue Chart / Chart.js) que segue o tema claro/escuro. */
const props = withDefaults(
  defineProps<{
    labels: string[]
    values: number[]
    label?: string
    height?: string
    format?: (v: number) => string
  }>(),
  { label: '', height: '200px', format: undefined },
)

const { mode } = useAppColorMode()
const colors = ref({ bar: '#1f1f1f', last: '#d4f53c', text: '#5e5e5e', grid: '#e4e2de' })

function readColors() {
  const css = getComputedStyle(document.documentElement)
  colors.value = {
    // barras na cor do texto (grafite/osso) e a semana atual em volt, como na landing
    bar: mode.value === 'dark' ? '#5e5e5e' : '#1f1f1f',
    last: css.getPropertyValue('--cl-volt').trim() || '#d4f53c',
    text: css.getPropertyValue('--p-text-muted-color').trim() || '#71717a',
    grid: css.getPropertyValue('--p-content-border-color').trim() || '#e4e4e7',
  }
}
onMounted(readColors)
watch(mode, () => nextTick(readColors))

const data = computed(() => ({
  labels: props.labels,
  datasets: [{ label: props.label, data: props.values, backgroundColor: props.values.map((_, i) => (i === props.values.length - 1 ? colors.value.last : colors.value.bar)), borderRadius: 8, borderSkipped: false, maxBarThickness: 40 }],
}))

const options = computed(() => ({
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx: { raw: unknown }) => (props.format ? props.format(Number(ctx.raw)) : String(ctx.raw)) } },
  },
  scales: {
    x: { ticks: { color: colors.value.text, font: { size: 11, family: 'Manrope', weight: 600 } }, grid: { display: false }, border: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { color: colors.value.text, precision: 0, callback: (v: number | string) => (props.format ? props.format(Number(v)) : v) },
      grid: { color: colors.value.grid },
      border: { display: false },
    },
  },
}))
</script>

<template>
  <ClientOnly>
    <Chart type="bar" :data="data" :options="options" :style="{ height }" />
  </ClientOnly>
</template>
