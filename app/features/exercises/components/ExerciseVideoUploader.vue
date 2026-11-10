<script setup lang="ts">
import type { ExerciseLike } from '../domain/exercise'
import { clampRange, clipTime, defaultRange, formatBytes, CLIP_MAX_SECONDS } from '../domain/clip'
import { useClipUpload } from '../composables/useClipUpload'
import { exercisesApi } from '../api/exercisesApi'

/**
 * Vídeo próprio do exercício: escolher/gravar → escolher o trecho → otimizar → enviar.
 * O clipe fica curto (até 10 s), sem som e leve, para tocar em loop no app.
 */
const props = defineProps<{
  exerciseId: number
  videoUrl: string | null
  images: string[]
  group: ExerciseLike['muscleGroup']
  name: string
  /** Storage configurado? */
  enabled: boolean
}>()
const emit = defineEmits<{ updated: [] }>()

const { stage, progress, error, source, result, choose, reset, upload } = useClipUpload(() => props.exerciseId)
const fileInput = ref<HTMLInputElement>()
const cameraInput = ref<HTMLInputElement>()
const preview = ref<HTMLVideoElement>()
const duration = ref(0)
const range = ref<[number, number]>([0, 0])
const dragging = ref(false)
const isOwnUpload = computed(() => !!props.videoUrl && /\/storage\/v1\/object\/public\//.test(props.videoUrl))

function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  if (f) choose(f)
  ;(e.target as HTMLInputElement).value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  const f = e.dataTransfer?.files?.[0]
  if (f) choose(f)
}

function onMeta() {
  duration.value = preview.value?.duration ?? 0
  range.value = defaultRange(duration.value)
  preview.value?.play().catch(() => {})
}
/* a prévia fica tocando só o trecho escolhido */
function onTime() {
  const v = preview.value
  if (!v) return
  if (v.currentTime >= range.value[1] || v.currentTime < range.value[0] - 0.2) v.currentTime = range.value[0]
}
let lastRange: [number, number] = [0, 0]
function onRange(value: number | number[]) {
  const next = value as [number, number]
  const moved = next[0] !== lastRange[0] ? 'start' : 'end'
  range.value = clampRange(next, duration.value, moved)
  lastRange = range.value
  if (preview.value) preview.value.currentTime = moved === 'start' ? range.value[0] : Math.max(range.value[0], range.value[1] - 1)
}
watch(range, (r) => (lastRange = r), { immediate: true })

const clipLength = computed(() => Math.round((range.value[1] - range.value[0]) * 10) / 10)

async function send() {
  const ex = await upload(range.value[0], range.value[1])
  if (ex) emit('updated')
}

const removing = ref(false)
async function removeVideo() {
  removing.value = true
  try {
    await exercisesApi.saveMedia(props.exerciseId, { videoUrl: null, posterUrl: null })
    emit('updated')
  } finally {
    removing.value = false
  }
}
</script>

<template>
  <div class="vu">
    <div class="vu__head">
      <span class="vu__title"><i class="pi pi-video" /> Vídeo da CL Academy</span>
      <Tag v-if="videoUrl" value="com vídeo" severity="success" />
    </div>

    <Message v-if="!enabled" severity="warn" size="small">
      Envio de vídeos ainda não configurado no servidor (Supabase Storage). Enquanto isso, cole um link abaixo.
    </Message>

    <!-- 1. estado atual + escolher -->
    <template v-else-if="stage === 'idle' || stage === 'done'">
      <div
        class="vu__drop"
        :class="{ 'vu__drop--over': dragging, 'vu__drop--has': !!videoUrl }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <ExerciseMedia v-if="videoUrl" :video="videoUrl" :images="images" :group="group" :alt="name" class="vu__current" />
        <div class="vu__cta">
          <p v-if="stage === 'done'" class="vu__ok"><i class="pi pi-check-circle" /> Vídeo enviado ({{ formatBytes(result?.size ?? 0) }}). Já aparece para os alunos.</p>
          <p v-else-if="!videoUrl" class="vu__hint">
            <strong>Arraste um vídeo aqui</strong> ou escolha do aparelho.<br />
            Depois você escolhe o trecho (até {{ CLIP_MAX_SECONDS }} s) e o app otimiza sozinho.
          </p>
          <div class="vu__actions">
            <Button :label="videoUrl ? 'Trocar vídeo' : 'Escolher vídeo'" icon="pi pi-upload" size="small" @click="fileInput?.click()" />
            <Button label="Gravar agora" icon="pi pi-camera" size="small" severity="secondary" outlined class="vu__camera" @click="cameraInput?.click()" />
            <Button
              v-if="videoUrl && isOwnUpload"
              label="Remover"
              icon="pi pi-trash"
              size="small"
              severity="danger"
              text
              :loading="removing"
              @click="removeVideo"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- 2. recorte -->
    <template v-else-if="source">
      <div class="vu__editor">
        <video
          ref="preview"
          :src="source.url"
          muted
          playsinline
          loop
          class="vu__preview"
          :class="{ 'vu__preview--busy': stage !== 'editing' }"
          @loadedmetadata="onMeta"
          @timeupdate="onTime"
        />
        <div v-if="stage === 'editing' && duration" class="vu__trim">
          <div class="vu__trim-labels">
            <span>Início <b>{{ clipTime(range[0]) }}</b></span>
            <span class="vu__len">{{ String(clipLength).replace('.', ',') }} s</span>
            <span>Fim <b>{{ clipTime(range[1]) }}</b></span>
          </div>
          <Slider :model-value="range" range :min="0" :max="duration" :step="0.1" aria-label="Trecho do vídeo" @update:model-value="onRange" />
          <small class="muted">Escolha 1 repetição bem feita. Clipes de 3 a 6 s ficam ótimos em loop.</small>
        </div>
        <div v-else-if="stage === 'processing' || stage === 'uploading'" class="vu__progress">
          <span>{{ stage === 'processing' ? 'Otimizando o vídeo' : 'Enviando' }}… {{ Math.round(progress * 100) }}%</span>
          <ProgressBar :value="Math.round(progress * 100)" :show-value="false" />
          <small class="muted">{{ stage === 'processing' ? 'Mantenha esta tela aberta.' : 'Quase lá.' }}</small>
        </div>
      </div>
      <div v-if="stage === 'editing'" class="vu__actions">
        <Button label="Usar este trecho e enviar" icon="pi pi-check" size="small" :disabled="!duration" @click="send" />
        <Button label="Cancelar" size="small" severity="secondary" text @click="reset" />
      </div>
    </template>

    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>

    <input ref="fileInput" type="file" accept="video/*" hidden @change="onFile" />
    <input ref="cameraInput" type="file" accept="video/*" capture="environment" hidden @change="onFile" />
  </div>
</template>

<style scoped>
.vu { display: flex; flex-direction: column; gap: 10px; padding: 12px; border: 1px solid var(--app-border); border-radius: var(--radius); background: var(--app-bg); }
.vu__head { display: flex; align-items: center; gap: 8px; }
.vu__title { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.9rem; margin-right: auto; }
.vu__drop {
  display: flex; gap: 14px; align-items: center; padding: 14px; border: 1.5px dashed var(--app-border); border-radius: 14px;
  background: var(--app-tile); transition: border-color 0.15s, background 0.15s;
}
.vu__drop--over { border-color: var(--accent-text); background: var(--accent-soft); }
.vu__drop--has { border-style: solid; }
.vu__current { width: 150px; flex-shrink: 0; }
.vu__cta { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.vu__hint { font-size: 0.86rem; color: var(--app-muted); line-height: 1.45; }
.vu__hint strong { color: var(--app-text); }
.vu__ok { display: flex; gap: 6px; font-size: 0.86rem; color: var(--accent-text); font-weight: 700; }
.vu__actions { display: flex; flex-wrap: wrap; gap: 6px; }
/* gravar direto só faz sentido em aparelhos com câmera de toque */
@media (hover: hover) and (pointer: fine) { .vu__camera { display: none; } }
.vu__editor { display: grid; gap: 12px; }
.vu__preview { width: 100%; max-height: 46dvh; border-radius: 14px; background: #000; object-fit: contain; transition: opacity 0.2s; }
.vu__preview--busy { opacity: 0.6; }
.vu__trim { display: grid; gap: 10px; }
.vu__trim-labels { display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--app-muted); }
.vu__trim-labels b { color: var(--app-text); font-family: var(--font-display); font-size: 1rem; }
.vu__len { padding: 2px 10px; border-radius: 999px; background: var(--cl-ink); color: var(--cl-hi); font-family: var(--font-display); font-weight: 800; }
.vu__progress { display: grid; gap: 6px; font-size: 0.88rem; font-weight: 700; }
@media (max-width: 520px) {
  .vu__drop { flex-direction: column; align-items: stretch; }
  .vu__current { width: 100%; }
}
</style>
