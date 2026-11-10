<script setup lang="ts">
defineProps<{
  items: {
    id?: number
    name: string
    sets: number | null
    reps: string | null
    load: string | null
    restSeconds: number | null
    notes: string | null
    videoUrl: string | null
  }[]
}>()

const demo = ref<{ url: string; title: string; notes: string | null } | null>(null)
const demoOpen = ref(false)
function openDemo(it: { name: string; videoUrl: string | null; notes: string | null }) {
  demo.value = { url: it.videoUrl!, title: it.name, notes: it.notes }
  demoOpen.value = true
}
</script>

<template>
  <ol class="items">
    <li v-for="(it, i) in items" :key="it.id ?? i" class="item">
      <span class="item__n mono">{{ i + 1 }}</span>
      <div class="grow">
        <div class="row" style="--gap: 8px">
          <strong class="item__name">{{ it.name }}</strong>
          <button v-if="it.videoUrl" type="button" class="item__video" @click="openDemo(it)">
            <i class="pi pi-play-circle" /> Ver como fazer
          </button>
        </div>
        <div class="item__meta">
          <span v-if="it.sets || it.reps" class="item__sets">{{ it.sets ?? '' }}<template v-if="it.sets && it.reps">×</template>{{ it.reps ?? '' }}</span>
          <span v-if="it.load">carga <b>{{ it.load }}</b></span>
          <span v-if="it.restSeconds"><i class="pi pi-clock" /> {{ it.restSeconds }}s</span>
        </div>
        <p v-if="it.notes" class="tiny muted">{{ it.notes }}</p>
      </div>
    </li>
  </ol>
  <TrainingExerciseDemo v-model:visible="demoOpen" :url="demo?.url" :title="demo?.title" :notes="demo?.notes" />
</template>

<style scoped>
.items { display: flex; flex-direction: column; }
.item { display: flex; gap: 12px; padding: 12px 0; border-top: 1px solid var(--app-border); }
.item:first-child { border-top: none; padding-top: 0; }
.item__n {
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0;
  border: 2px solid var(--app-border); font-family: var(--font-display); font-size: 0.95rem; font-weight: 800; color: var(--app-text);
}
.item__name { font-weight: 800; }
.item__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; margin-top: 3px; font-size: 0.82rem; color: var(--app-muted); }
.item__meta b { color: var(--app-text); }
.item__meta .pi { font-size: 0.7rem; }
.item__sets { padding: 1px 8px; border-radius: 6px; background: var(--cl-ink); color: var(--cl-volt); font-family: var(--font-display); font-weight: 800; font-size: 0.95rem; letter-spacing: 0.02em; }
.app-dark .item__sets { background: #2a2a2a; }
.item__video {
  display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--app-border); background: var(--app-tile); font: inherit; font-size: 0.75rem; font-weight: 700; color: var(--app-text);
}
.item__video:hover { border-color: var(--app-muted); }
.item__video .pi { font-size: 0.8rem; color: var(--accent-text); }
</style>
