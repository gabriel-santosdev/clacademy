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
const colors = ref({ bar: '#d0d0d0', last: '#1a1a1a', text: '#5f5f5f', grid: '#e6e6e6' })

function readColors() {
  const css = getComputedStyle(document.documentElement)
  const dark = mode.value === 'dark'
  colors.value = {
    // barras em cinza e a semana atual em contraste máximo (grafite no claro, branco no escuro)
    bar: dark ? '#3a3a3a' : '#d0d0d0',
    last: dark ? '#f5f5f5' : '#1a1a1a',
    text: css.getPropertyValue('--p-text-muted-color').trim() || '#737373',
    grid: css.getPropertyValue('--p-content-border-color').trim() || '#e5e5e5',
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
