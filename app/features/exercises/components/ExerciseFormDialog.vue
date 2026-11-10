<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import type { ExerciseForm, ExerciseLike } from '../domain/exercise'

/**
 * Criar/editar exercício do banco. Ao criar, o diálogo continua aberto já em modo
 * edição para enviar o vídeo na sequência.
 */
const visible = defineModel<boolean>('visible', { default: false })
const props = defineProps<{
  form: ExerciseForm
  editing: boolean
  loading?: boolean
  /** exercício salvo (vídeo enviado e vínculo licenciado; só ao editar) */
  current?: ExerciseLike | null
  licensedEnabled?: boolean
  uploadsEnabled?: boolean
}>()
const emit = defineEmits<{ save: []; archive: []; mediaChanged: [] }>()
/** link aberto só quando o exercício já usa um link externo */
const linkOpen = ref(false)
watch(visible, (v) => {
  if (v) linkOpen.value = !!props.form.videoUrl && !props.form.videoUrl.includes('/storage/v1/')
})
const confirm = useConfirm()

const images = computed(() =>
  props.form.images
    .split(/\s*\n\s*/)
    .map((s) => s.trim())
    .filter(Boolean),
)
const videoOk = computed(() => !props.form.videoUrl.trim() || !!parseDemoUrl(props.form.videoUrl))

function askArchive() {
  confirm.require({
    header: 'Remover do banco?',
    message: 'O exercício deixa de aparecer na busca. As fichas que já o usam continuam iguais.',
    icon: 'pi pi-trash',
    acceptProps: { label: 'Remover', severity: 'danger' },
    rejectProps: { label: 'Cancelar', severity: 'secondary', text: true },
    accept: () => emit('archive'),
  })
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="editing ? form.name || 'Editar exercício' : 'Novo exercício'"
    :style="{ width: 'min(640px, 96vw)' }"
    :breakpoints="{ '560px': '100vw' }"
  >
    <form id="exercise-form" class="stack" @submit.prevent="emit('save')">
      <div class="field">
        <label for="xf-name">Nome</label>
        <InputText id="xf-name" v-model="form.name" placeholder="Ex.: Agachamento com salto" required minlength="2" fluid />
      </div>
      <div class="grid-3">
        <div class="field">
          <label for="xf-group">Grupo muscular</label>
          <Select v-model="form.muscleGroup" input-id="xf-group" :options="MUSCLE_GROUP_OPTIONS" option-label="label" option-value="value" fluid />
        </div>
        <div class="field">
          <label for="xf-equip">Equipamento</label>
          <Select v-model="form.equipment" input-id="xf-equip" :options="EQUIPMENT_OPTIONS" option-label="label" option-value="value" fluid />
        </div>
        <div class="field">
          <label for="xf-level">Nível</label>
          <Select v-model="form.level" input-id="xf-level" :options="LEVEL_OPTIONS" option-label="label" option-value="value" fluid />
        </div>
      </div>
      <div class="field">
        <label for="xf-how">Como fazer (dica para o aluno)</label>
        <Textarea id="xf-how" v-model="form.instructions" rows="3" auto-resize placeholder="Postura, amplitude, respiração, erros comuns…" fluid />
      </div>
      <!-- vídeo: enviar (recomendado) ou colar link -->
      <ExerciseVideoUploader
        v-if="editing && current"
        :exercise-id="current.id"
        :video-url="current.videoUrl"
        :images="current.images"
        :group="current.muscleGroup"
        :name="current.name"
        :enabled="!!uploadsEnabled"
        @updated="emit('mediaChanged')"
      />
      <div v-else class="xf-next">
        <i class="pi pi-video" />
        <span>Depois de criar, você já envia o vídeo do exercício aqui mesmo.</span>
      </div>

      <button type="button" class="xf-toggle" :aria-expanded="linkOpen" @click="linkOpen = !linkOpen">
        <i :class="['pi', linkOpen ? 'pi-chevron-down' : 'pi-chevron-right']" /> Usar um link (YouTube, Instagram, GIF) em vez de enviar
      </button>
      <div v-if="linkOpen" class="stack" style="--gap: 12px">
        <div class="field">
          <label for="xf-video">Link do vídeo</label>
          <InputText id="xf-video" v-model="form.videoUrl" type="url" placeholder="YouTube, Shorts, Instagram, Drive ou .mp4" :invalid="!videoOk" fluid />
        </div>
        <div class="field">
          <label for="xf-images">Imagens / GIF (uma URL por linha)</label>
          <Textarea id="xf-images" v-model="form.images" rows="2" auto-resize placeholder="https://…/inicio.jpg&#10;https://…/fim.jpg" fluid />
        </div>
        <div v-if="images.length || form.videoUrl" class="xf-preview">
          <ExerciseMedia :images="images" :video="form.videoUrl.trim() || null" :group="form.muscleGroup" :alt="form.name || 'Prévia'" />
          <span class="tiny muted">Prévia</span>
        </div>
      </div>

      <ExerciseLicensedLink
        v-if="editing && current && licensedEnabled"
        :exercise-id="current.id"
        :external-id="current.externalId"
        @changed="emit('mediaChanged')"
      />
    </form>
    <template #footer>
      <Button v-if="editing" label="Remover" icon="pi pi-trash" severity="danger" text class="mr-auto" @click="askArchive" />
      <Button label="Cancelar" severity="secondary" text @click="visible = false" />
      <Button type="submit" form="exercise-form" :label="editing ? 'Salvar' : 'Criar exercício'" icon="pi pi-check" :loading="loading" :disabled="!videoOk" />
    </template>
  </Dialog>
</template>

<style scoped>
.grid-3 { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 560px) { .grid-3 { grid-template-columns: 1fr; } }
.xf-preview { display: flex; flex-direction: column; gap: 4px; width: min(260px, 100%); }
.mr-auto { margin-right: auto; }
.xf-next { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1.5px dashed var(--app-border); border-radius: var(--radius); color: var(--app-muted); font-size: 0.88rem; }
.xf-next .pi { color: var(--accent-text); }
.xf-toggle { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 0; border: 0; background: none; cursor: pointer; font: inherit; font-size: 0.84rem; font-weight: 700; color: var(--app-muted); }
.xf-toggle:hover { color: var(--app-text); }
.xf-toggle .pi { font-size: 0.7rem; }
</style>
