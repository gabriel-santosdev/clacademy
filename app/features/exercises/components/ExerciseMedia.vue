<script setup lang="ts">
import type { MuscleGroup } from '#shared/utils/constants'

/**
 * Mídia do exercício, no padrão de apps de treino:
 * 1. vídeo curto em loop (mp4/webm), mudo, tocando só enquanto está na tela;
 * 2. imagens/GIF (duas fotos alternam como animação);
 * 3. sem mídia: capa com a identidade da CL Academy e o grupo muscular.
 */
const props = withDefaults(
  defineProps<{
    images?: string[] | null
    /** link do vídeo do exercício; se for arquivo de vídeo, vira o loop */
    video?: string | null
    alt: string
    group?: MuscleGroup | null
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const root = ref<HTMLElement>()
const videoEl = ref<HTMLVideoElement>()
const frame = ref(0)
const inView = ref(false)

const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i
const loop = computed(() => {
  if (props.video && VIDEO_FILE.test(props.video)) return props.video
  return (props.images ?? []).find((s) => VIDEO_FILE.test(s)) ?? null
})
const pictures = computed(() => (props.images ?? []).filter((s) => s && !VIDEO_FILE.test(s)))

const reduced = import.meta.client && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined

watchEffect(() => {
  clearInterval(timer)
  if (!loop.value && !reduced && inView.value && pictures.value.length > 1) {
    timer = setInterval(() => (frame.value = (frame.value + 1) % pictures.value.length), 950)
  }
  const v = videoEl.value
  if (v) {
    if (inView.value && !reduced) v.play().catch(() => {})
    else v.pause()
  }
})

onMounted(() => {
  observer = new IntersectionObserver(([e]) => (inView.value = !!e?.isIntersecting), { threshold: 0.25 })
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="xm" :class="`xm--${size}`">
    <video
      v-if="loop"
      ref="videoEl"
      class="xm__media"
      :src="loop"
      :aria-label="alt"
      muted
      loop
      playsinline
      :preload="size === 'lg' ? 'auto' : 'metadata'"
      disablepictureinpicture
    />
    <template v-else-if="pictures.length">
      <img
        v-for="(src, i) in pictures"
        :key="src"
        :src="src"
        :alt="i === 0 ? alt : ''"
        :aria-hidden="i === 0 ? undefined : 'true'"
        class="xm__media xm__img"
        :class="{ 'xm__img--on': i === frame }"
        :loading="size === 'lg' ? 'eager' : 'lazy'"
        decoding="async"
      />
    </template>
    <div v-else class="xm__cover" role="img" :aria-label="alt">
      <svg class="xm__lanes" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
        <path v-for="l in 5" :key="l" :d="`M ${110 + l * 28} 215 C ${140 + l * 28} 120, ${210 + l * 20} 70, 320 ${l * 24 - 34}`" />
      </svg>
      <span v-if="group" class="xm__group">{{ LABELS.muscleGroup[group] }}</span>
      <BrandLogo variant="mark" class="xm__mark" />
    </div>
  </div>
</template>

<style scoped>
.xm { position: relative; overflow: hidden; border-radius: 14px; aspect-ratio: 4 / 3; isolation: isolate; background: var(--cl-ink); }
.xm--sm { border-radius: 10px; }
.xm--lg { border-radius: var(--radius); aspect-ratio: 16 / 10; }
.xm__media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; background: #111; }
.xm__img { opacity: 0; transition: opacity 0.35s ease; }
.xm__img--on { opacity: 1; }

/* capa sem mídia: grafite + pistas volt, como o resto do app */
.xm__cover { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 10px 12px; color: var(--cl-bone); }
.xm__lanes { position: absolute; inset: 0; width: 100%; height: 100%; }
.xm__lanes path { fill: none; stroke: var(--cl-hi); stroke-width: 1.4; opacity: 0.22; }
.xm__group {
  position: relative; font-family: var(--font-display); font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; line-height: 0.95;
  font-size: 1.15rem; color: var(--cl-hi);
}
.xm--sm .xm__group { font-size: 0.8rem; }
.xm--lg .xm__group { font-size: 1.8rem; }
.xm__mark { position: absolute; top: 10px; right: 12px; font-size: 1.1rem; color: rgba(238, 237, 235, 0.55); }
.xm--sm .xm__mark { font-size: 0.8rem; top: 7px; right: 8px; }
.xm--lg .xm__mark { font-size: 1.6rem; }
</style>
