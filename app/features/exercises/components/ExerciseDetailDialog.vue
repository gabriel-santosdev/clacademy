<script setup lang="ts">
import { hasVideoOption, type ExerciseDetail } from '../domain/exercise'
import { useLicensedVideo } from '../composables/useLicensedVideo'

/**
 * "Como fazer": vídeo da execução em loop, dica e observação do professor.
 * Fontes, em ordem: vídeo próprio da CL Academy → vídeo licenciado (com escolha de
 * gênero e ângulo) → imagens → capa da marca. Com mais de uma, aparecem abas.
 */
const visible = defineModel<boolean>('visible', { default: false })
const props = defineProps<{ exercise: ExerciseDetail | null }>()

type Source = 'proprio' | 'licenciado' | 'imagens'
const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i

const licensed = useLicensedVideo()
const { pref } = licensed
const tab = ref<Source>('imagens')

const ownVideo = computed(() => {
  const url = props.exercise?.videoUrl
  if (!url) return null
  return VIDEO_FILE.test(url) ? ({ kind: 'file', url } as const) : parseDemoUrl(url) ? ({ kind: 'embed', url } as const) : null
})
const sources = computed(() => {
  const out: { value: Source; label: string; icon: string }[] = []
  if (ownVideo.value) out.push({ value: 'proprio', label: 'CL Academy', icon: 'pi-star' })
  if (props.exercise?.hasLicensedVideo && (licensed.loading.value || licensed.videos.value.length))
    out.push({ value: 'licenciado', label: ownVideo.value ? 'Outros ângulos' : 'Vídeo', icon: 'pi-video' })
  if (props.exercise?.images?.length) out.push({ value: 'imagens', label: 'Imagens', icon: 'pi-images' })
  return out
})

watch(visible, async (v) => {
  if (!v || !props.exercise) return
  tab.value = ownVideo.value ? 'proprio' : props.exercise.hasLicensedVideo ? 'licenciado' : 'imagens'
  if (props.exercise.id && props.exercise.hasLicensedVideo) {
    await licensed.load(props.exercise.id)
    if (tab.value === 'licenciado' && !licensed.videos.value.length) tab.value = 'imagens'
  }
})

const genderOptions = [
  { label: 'Feminino', value: 'female' },
  { label: 'Masculino', value: 'male' },
]
const angleOptions = [
  { label: 'Frente', value: 'front' },
  { label: 'Lado', value: 'side' },
]
const optionDisabled = (key: 'gender' | 'angle') => (o: { value: string }) => !hasVideoOption(licensed.videos.value, key, o.value)
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :header="exercise?.name ?? 'Exercício'"
    :style="{ width: 'min(560px, 96vw)' }"
    :breakpoints="{ '560px': '100vw' }"
  >
    <div v-if="visible && exercise" class="xd">
      <SelectButton v-if="sources.length > 1" v-model="tab" :options="sources" option-label="label" option-value="value" :allow-empty="false" class="xd__tabs">
        <template #option="{ option }"><i :class="['pi', option.icon]" /> {{ option.label }}</template>
      </SelectButton>

      <!-- vídeo próprio -->
      <template v-if="tab === 'proprio' && ownVideo">
        <ExerciseMedia v-if="ownVideo.kind === 'file'" :video="ownVideo.url" :group="exercise.muscleGroup" :alt="`Execução: ${exercise.name}`" size="lg" />
        <TrainingDemoMedia v-else :url="ownVideo.url" :title="exercise.name" />
      </template>

      <!-- vídeo licenciado -->
      <template v-else-if="tab === 'licenciado'">
        <div class="xd__player">
          <video
            v-if="licensed.current.value"
            :key="licensed.current.value.src"
            :src="licensed.current.value.src"
            :aria-label="`Execução: ${exercise.name}`"
            autoplay
            muted
            loop
            playsinline
            disablepictureinpicture
          />
          <span v-else class="xd__loading"><i class="pi pi-spin pi-spinner" /> Carregando vídeo…</span>
        </div>
        <div v-if="licensed.videos.value.length" class="xd__prefs">
          <SelectButton v-model="pref.gender" :options="genderOptions" option-label="label" option-value="value" :option-disabled="optionDisabled('gender')" :allow-empty="false" size="small" />
          <SelectButton v-model="pref.angle" :options="angleOptions" option-label="label" option-value="value" :option-disabled="optionDisabled('angle')" :allow-empty="false" size="small" />
        </div>
        <a href="https://musclewiki.com" target="_blank" rel="noopener" class="xd__credit">Vídeo: MuscleWiki.com</a>
      </template>

      <!-- imagens / capa -->
      <ExerciseMedia v-else :images="exercise.images" :group="exercise.muscleGroup" :alt="`Execução: ${exercise.name}`" size="lg" />

      <div v-if="exercise.prescription || exercise.muscleGroup" class="xd__tags">
        <span v-if="exercise.prescription" class="xd__rx">{{ exercise.prescription }}</span>
        <Tag v-if="exercise.muscleGroup" :value="LABELS.muscleGroup[exercise.muscleGroup]" severity="secondary" />
        <Tag v-if="exercise.equipment" :value="LABELS.equipment[exercise.equipment]" severity="secondary" />
        <Tag v-if="exercise.level" :value="LABELS.trainingLevel[exercise.level]" severity="secondary" />
      </div>

      <div v-if="exercise.instructions" class="xd__how">
        <span class="xd__label"><i class="pi pi-lightbulb" /> Como fazer</span>
        <p>{{ exercise.instructions }}</p>
      </div>
      <div v-if="exercise.notes" class="xd__note">
        <span class="xd__label"><i class="pi pi-comment" /> Seu professor</span>
        <p>{{ exercise.notes }}</p>
      </div>
      <slot />
    </div>
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Dialog>
</template>

<style scoped>
.xd { display: flex; flex-direction: column; gap: 14px; }
.xd__tabs { display: flex; }
.xd__tabs :deep(.p-togglebutton) { flex: 1; }
.xd__player { position: relative; aspect-ratio: 16 / 10; border-radius: var(--radius); overflow: hidden; background: #111; display: grid; place-items: center; }
.xd__player video { width: 100%; height: 100%; object-fit: contain; background: #000; }
.xd__loading { color: var(--cl-bone); font-size: 0.9rem; display: inline-flex; gap: 8px; align-items: center; }
.xd__prefs { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.xd__credit { align-self: flex-end; margin-top: -6px; font-size: 0.72rem; color: var(--app-muted); }
.xd__tags { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.xd__rx { padding: 3px 10px; border-radius: 8px; background: var(--cl-ink); color: var(--cl-hi); font-family: var(--font-display); font-weight: 800; font-size: 1.05rem; }
.app-dark .xd__rx { background: #2a2a2a; }
.xd__label { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 4px; font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent-text); }
.xd__label .pi { font-size: 0.75rem; }
.xd__how p, .xd__note p { font-size: 0.95rem; line-height: 1.55; }
.xd__note { padding: 12px 14px; border-radius: 16px 16px 16px 6px; background: var(--cl-ink); color: var(--cl-bone); }
.xd__note .xd__label { color: var(--cl-hi); }
.app-dark .xd__note { background: #262626; }
</style>
