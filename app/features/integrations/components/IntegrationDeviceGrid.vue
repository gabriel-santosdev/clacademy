<script setup lang="ts">
import type { DetectedDevice, DeviceGuide } from '../domain/devices'

/** Grade de relógios/apps: mostra o que já foi detectado e abre o passo a passo de cada marca. */
const props = defineProps<{ devices: DetectedDevice[]; stravaConnected: boolean; connectUrl: string; stravaAvailable: boolean }>()

const list = computed(() => sortByDetected(props.devices))
const open = ref<DeviceGuide | null>(null)
const visible = computed({ get: () => !!open.value, set: (v) => !v && (open.value = null) })
const openDetected = computed(() => (open.value ? detectedFor(open.value, props.devices) : []))
</script>

<template>
  <section class="stack" style="--gap: 12px">
    <header>
      <h2 class="h2">Seu relógio</h2>
      <p class="small muted">Toque na sua marca para ver como ligar ao Strava.</p>
    </header>

    <div class="devices">
      <button
        v-for="(d, i) in list"
        :key="d.id"
        type="button"
        class="device"
        :class="{ 'device--on': detectedFor(d, devices).length }"
        :style="{ '--i': i }"
        @click="open = d"
      >
        <span class="device__mono">
          <i v-if="d.id === 'apple'" class="pi pi-apple" />
          <i v-else-if="d.id === 'phone'" class="pi pi-mobile" />
          <template v-else>{{ d.mono }}</template>
        </span>
        <strong>{{ d.name }}</strong>
        <span v-if="detectedFor(d, devices).length" class="device__status device__status--on">
          <i class="pi pi-check" /> {{ detectedFor(d, devices).reduce((s, x) => s + x.runs, 0) }} treinos
        </span>
        <span v-else class="device__status">Como conectar</span>
      </button>
    </div>

    <Dialog v-model:visible="visible" modal dismissable-mask :header="open?.name" :style="{ width: 'min(480px, 96vw)' }">
      <div v-if="open" class="guide">
        <p v-if="openDetected.length" class="guide__found">
          <i class="pi pi-check-circle" />
          <span>Já recebemos treinos do <b>{{ openDetected.map((x) => x.name).join(', ') }}</b>. Está tudo ligado.</span>
        </p>
        <ol class="guide__steps">
          <li v-for="(step, i) in open.steps" :key="i" :style="{ '--i': i }" :class="{ 'guide__steps--done': i === 0 && stravaConnected }">
            <span class="guide__n"><i v-if="i === 0 && stravaConnected" class="pi pi-check" /><template v-else>{{ i + 1 }}</template></span>
            <span>{{ step }}</span>
          </li>
        </ol>
        <p v-if="open.tip" class="guide__tip"><i class="pi pi-lightbulb" /> {{ open.tip }}</p>
        <p class="tiny muted">{{ GUIDE_DISCLAIMER }}</p>
      </div>
      <template v-if="!stravaConnected && stravaAvailable" #footer>
        <a :href="connectUrl" class="guide__connect"><b>S</b> Conectar com Strava</a>
      </template>
    </Dialog>
  </section>
</template>

<style scoped>
.devices { display: grid; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
@media (max-width: 420px) { .devices { grid-template-columns: 1fr 1fr; } }
.device {
  display: flex; flex-direction: column; align-items: flex-start; gap: 6px; padding: 14px; text-align: left;
  border-radius: var(--radius); border: 1px solid var(--app-border); background: var(--app-surface); color: var(--app-text);
  transition: transform 0.15s var(--ease-out), border-color 0.2s; -webkit-tap-highlight-color: transparent;
  animation: cl-rise 0.5s var(--ease-out) both; animation-delay: calc(var(--i) * 40ms + 120ms);
}
.device:active { transform: scale(0.97); }
@media (hover: hover) { .device:hover { border-color: var(--app-muted); } }
.device--on { border-color: var(--app-text); }
.device__mono {
  width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 4px;
  background: var(--accent-soft); font-family: var(--font-display); font-weight: 800; font-size: 1.15rem;
}
.device--on .device__mono { background: var(--accent); color: var(--accent-ink); }
.device strong { font-size: 0.95rem; font-weight: 800; }
.device__status { font-size: 0.75rem; font-weight: 700; color: var(--app-muted); }
.device__status--on { display: inline-flex; align-items: center; gap: 5px; color: var(--app-text); }
.device__status .pi { font-size: 0.65rem; }

.guide { display: flex; flex-direction: column; gap: 16px; }
.guide__found { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; border-radius: 14px; background: var(--accent-soft); font-size: 0.9rem; }
.guide__found .pi { margin-top: 3px; }
.guide__steps { display: flex; flex-direction: column; gap: 12px; counter-reset: s; }
.guide__steps li { display: flex; gap: 12px; align-items: flex-start; font-size: 0.95rem; line-height: 1.5; animation: cl-rise 0.4s var(--ease-out) both; animation-delay: calc(var(--i) * 70ms + 80ms); }
.guide__n {
  width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center;
  background: var(--accent); color: var(--accent-ink); font-family: var(--font-display); font-weight: 800; font-size: 0.95rem;
}
.guide__steps--done { color: var(--app-muted); text-decoration: line-through; }
.guide__steps--done .guide__n { background: var(--accent-soft); color: var(--app-text); }
.guide__n .pi { font-size: 0.7rem; }
.guide__tip { display: flex; gap: 8px; font-size: 0.85rem; color: var(--app-muted); }
.guide__tip .pi { margin-top: 3px; }
.guide__connect {
  display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 50px; border-radius: 999px;
  background: #fc4c02; color: #fff; font-weight: 800;
}
.guide__connect b { font-family: var(--font-display); font-size: 1.2rem; }
</style>
