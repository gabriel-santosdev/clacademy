<script setup lang="ts">
/** Tela "Treino do dia": exercícios marcáveis + anel de progresso. Em autoplay, marca sozinho em loop. */
const props = withDefaults(defineProps<{ autoplay?: boolean }>(), { autoplay: false })

const exercises = [
  { name: 'Agachamento livre', sets: '4×10', load: '40 kg' },
  { name: 'Stiff com halteres', sets: '3×12', load: '2×14 kg' },
  { name: 'Afundo búlgaro', sets: '3×10', load: 'peso corporal' },
  { name: 'Prancha', sets: '3×40s', load: '' },
]
const done = ref<boolean[]>(exercises.map(() => false))
const count = computed(() => done.value.filter(Boolean).length)
const allDone = computed(() => count.value === exercises.length)
const touched = ref(false)

const R = 15.9
const C = 2 * Math.PI * R
const dash = computed(() => `${(count.value / exercises.length) * C} ${C}`)

function toggle(i: number) {
  touched.value = true
  done.value[i] = !done.value[i]
}

let timer: ReturnType<typeof setTimeout> | undefined
function step() {
  if (!props.autoplay || touched.value) return
  if (allDone.value) {
    timer = setTimeout(() => {
      done.value = exercises.map(() => false)
      timer = setTimeout(step, 900)
    }, 2600)
    return
  }
  done.value[done.value.indexOf(false)] = true
  timer = setTimeout(step, 1100)
}
watch(
  () => props.autoplay,
  (on) => {
    clearTimeout(timer)
    if (on && !prefersReducedMotion()) timer = setTimeout(step, 700)
  },
  { immediate: true },
)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="today">
    <div class="today__top">
      <div>
        <p class="today__date">Terça · 11 nov</p>
        <p class="today__title">Treino A</p>
        <p class="today__sub">Inferiores + core</p>
      </div>
      <svg class="ring" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" :r="R" class="ring__bg" />
        <circle cx="18" cy="18" :r="R" class="ring__fg" :stroke-dasharray="dash" />
        <text x="18" y="21" text-anchor="middle">{{ count }}/{{ exercises.length }}</text>
      </svg>
    </div>

    <ul class="ex">
      <li v-for="(e, i) in exercises" :key="e.name">
        <button type="button" :class="{ on: done[i] }" :aria-pressed="done[i]" @click="toggle(i)">
          <span class="ex__check"><i class="pi pi-check" /></span>
          <span class="ex__name">
            {{ e.name }}
            <small>{{ e.sets }}<template v-if="e.load"> · {{ e.load }}</template></small>
          </span>
          <i class="pi pi-play ex__video" />
        </button>
      </li>
    </ul>

    <div class="today__coach">
      <span class="today__avatar">CL</span>
      <p>Desce até a paralela no agachamento, sem pressa na volta.</p>
    </div>

    <Transition name="done">
      <div v-if="allDone" class="today__done"><i class="pi pi-check-circle" /> Treino concluído. Enviado pro professor.</div>
    </Transition>
  </div>
</template>

<style scoped>
.today { display: flex; flex-direction: column; gap: 0.9em; padding-top: 0.6em; }
.today__top { display: flex; justify-content: space-between; align-items: center; }
.today__date { font-size: 0.85em; font-weight: 700; color: #8a8a8a; text-transform: uppercase; letter-spacing: 0.08em; }
.today__title { font-family: var(--f-display); font-size: 2.6em; font-weight: 800; line-height: 0.9; text-transform: uppercase; margin-top: 0.15em; }
.today__sub { font-size: 0.95em; color: #5e5e5e; font-weight: 600; }
.ring { width: 4.6em; height: 4.6em; transform: rotate(-90deg); }
.ring circle { fill: none; stroke-width: 3.6; }
.ring__bg { stroke: #e2e2e2; }
.ring__fg { stroke: #1f1f1f; stroke-linecap: round; transition: stroke-dasharray 0.6s var(--ease-out); }
.ring text { transform: rotate(90deg); transform-origin: 18px 18px; font-family: var(--f-display); font-size: 9px; font-weight: 800; fill: #1f1f1f; }

.ex { display: flex; flex-direction: column; gap: 0.5em; }
.ex button {
  width: 100%; display: flex; align-items: center; gap: 0.75em; padding: 0.75em 0.8em; border-radius: 1.1em;
  background: #fff; border: 1px solid #e6e6e6; text-align: left; font-size: 1em; color: inherit;
  transition: background 0.3s, border-color 0.3s, transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.ex button:active { transform: scale(0.98); }
.ex__check {
  width: 1.9em; height: 1.9em; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center;
  border: 0.14em solid #cfcfcf; transition: background 0.3s, border-color 0.3s;
}
.ex__check .pi { font-size: 0.8em; color: #1f1f1f; transform: scale(0); transition: transform 0.35s var(--ease-spring); }
.ex__name { flex: 1; min-width: 0; font-weight: 700; font-size: 1.05em; line-height: 1.2; transition: color 0.3s; }
.ex__name small { display: block; font-size: 0.82em; font-weight: 600; color: #8a8a8a; margin-top: 0.15em; }
.ex__video { font-size: 0.75em; width: 2.2em; height: 2.2em; border-radius: 50%; display: grid; place-items: center; background: #f0f0f0; color: #5e5e5e; }
.ex button.on { background: #fafafa; }
.ex button.on .ex__check { background: #1a1a1a; border-color: #1a1a1a; }
.ex button.on .ex__check .pi { color: #fff; }
.ex button.on .ex__check .pi { transform: scale(1); }
.ex button.on .ex__name { color: #8a8a8a; }

.today__coach { display: flex; gap: 0.6em; align-items: flex-start; padding: 0.7em 0.8em; border-radius: 1.1em; background: #1f1f1f; color: #f0f0f0; }
.today__coach p { font-size: 0.92em; line-height: 1.35; }
.today__avatar { width: 2.2em; height: 2.2em; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; background: var(--hi); color: #1f1f1f; font-family: var(--f-display); font-weight: 800; font-size: 0.85em; }

.today__done {
  position: absolute; left: 1em; right: 1em; bottom: 0.8em; display: flex; align-items: center; gap: 0.5em;
  padding: 0.85em 1em; border-radius: 1.1em; background: #1a1a1a; color: #fff; font-weight: 800; font-size: 0.95em;
  box-shadow: 0 1em 2em -0.8em rgba(0, 0, 0, 0.35);
}
.done-enter-active { animation: lp-pop 0.5s var(--ease-out); }
.done-leave-active { transition: opacity 0.3s, transform 0.3s; }
.done-leave-to { opacity: 0; transform: translateY(1em); }
</style>
