<script setup lang="ts">
import type { StoryData, StoryStyle } from '../domain/story'

/** Prévia do card de Stories + compartilhar / baixar / copiar figurinha. */
const visible = defineModel<boolean>('visible', { default: false })
const props = defineProps<{ story: StoryData | null }>()

const notify = useNotify()
const style = ref<StoryStyle>('dark')
const photo = shallowRef<HTMLImageElement | null>(null)
const photoInput = ref<HTMLInputElement>()
const blob = shallowRef<Blob | null>(null)
const previewUrl = ref('')
const rendering = ref(false)
const sharing = ref(false)
const copyable = ref(false)
onMounted(() => (copyable.value = canCopyImage()))

function accentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--cl-volt').trim() || '#d4f53c'
}

let renderId = 0
async function render() {
  if (!props.story || !visible.value) return
  const id = ++renderId
  rendering.value = true
  try {
    const canvas = await renderStory(props.story, style.value, { accent: accentColor(), photo: photo.value })
    const b = await canvasToBlob(canvas)
    if (id !== renderId) return
    blob.value = b
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(b)
  } catch {
    notify.error('Não foi possível gerar a imagem.')
  } finally {
    if (id === renderId) rendering.value = false
  }
}
watch([visible, style, photo, () => props.story], render)

watch(style, (s) => {
  if (s === 'photo' && !photo.value) photoInput.value?.click()
})

async function onPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    photo.value = await loadImage(URL.createObjectURL(file))
    style.value = 'photo'
  } catch {
    notify.error('Não foi possível abrir essa foto.')
  }
}

const fileName = computed(() => (props.story ? storyFileName(props.story) : 'clacademy.png'))

async function share() {
  if (!blob.value) return
  sharing.value = true
  try {
    const r = await shareStoryBlob(blob.value, fileName.value)
    if (r === 'downloaded') notify.success('Imagem salva! Agora é só postar no Stories.')
  } finally {
    sharing.value = false
  }
}

function download() {
  if (blob.value) downloadBlob(blob.value, fileName.value)
}

async function copy() {
  if (!blob.value) return
  try {
    await copyStoryBlob(blob.value)
    notify.success('Figurinha copiada! No Stories, toque e segure na tela e escolha "Colar".')
  } catch {
    notify.error('Seu navegador não deixou copiar. Use "Baixar".')
  }
}

onBeforeUnmount(() => previewUrl.value && URL.revokeObjectURL(previewUrl.value))
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Compartilhe seu treino"
    :style="{ width: 'min(460px, 96vw)' }"
    :breakpoints="{ '560px': '100vw' }"
    class="share-dialog"
  >
    <div class="share">
      <SelectButton v-model="style" :options="STORY_STYLES" option-label="label" option-value="value" :allow-empty="false" class="share__styles">
        <template #option="{ option }">
          <i :class="['pi', option.icon]" /><span>{{ option.label }}</span>
        </template>
      </SelectButton>

      <div class="share__stage" :class="{ 'share__stage--sticker': style === 'sticker' }">
        <img v-if="previewUrl" :src="previewUrl" alt="Prévia do card para o Stories" class="share__img" :class="{ 'share__img--busy': rendering }" />
        <span v-else class="share__loading"><i class="pi pi-spin pi-spinner" /></span>
      </div>

      <div v-if="style === 'photo'" class="share__photo">
        <Button :label="photo ? 'Trocar foto' : 'Escolher foto'" icon="pi pi-camera" severity="secondary" outlined size="small" @click="photoInput?.click()" />
      </div>
      <input ref="photoInput" type="file" accept="image/*" hidden @change="onPhoto" />

      <p class="share__hint">
        <template v-if="style === 'sticker'">Fundo transparente: copie e cole por cima de uma foto ou vídeo no Stories.</template>
        <template v-else>No celular, toque em <b>Compartilhar</b> e escolha <b>Instagram → Stories</b>.</template>
      </p>
    </div>

    <template #footer>
      <div class="share__actions">
        <Button
          v-if="style === 'sticker' && copyable"
          label="Copiar"
          icon="pi pi-copy"
          severity="secondary"
          outlined
          :disabled="!blob || rendering"
          @click="copy"
        />
        <Button v-else label="Baixar" icon="pi pi-download" severity="secondary" outlined :disabled="!blob || rendering" @click="download" />
        <Button label="Compartilhar" icon="pi pi-share-alt" :loading="sharing" :disabled="!blob || rendering" class="grow" @click="share" />
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.share { display: flex; flex-direction: column; gap: 14px; }
.share__styles { display: flex; width: 100%; }
.share__styles :deep(.p-togglebutton) { flex: 1; padding-inline: 6px; }
.share__styles :deep(.p-togglebutton-content) { gap: 6px; font-size: 0.82rem; }
.share__styles .pi { font-size: 0.8rem; }

.share__stage {
  position: relative; display: grid; place-items: center; align-self: center;
  width: min(100%, calc(56vh * 9 / 16)); aspect-ratio: 9 / 16; border-radius: 22px; overflow: hidden;
  background: var(--cl-ink); box-shadow: 0 24px 50px -28px rgba(0, 0, 0, 0.55);
}
/* xadrez para mostrar a transparência da figurinha */
.share__stage--sticker {
  background-color: #6b6b6b;
  background-image:
    linear-gradient(45deg, #7a7a7a 25%, transparent 25%), linear-gradient(-45deg, #7a7a7a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #7a7a7a 75%), linear-gradient(-45deg, transparent 75%, #7a7a7a 75%);
  background-size: 22px 22px;
  background-position: 0 0, 0 11px, 11px -11px, -11px 0;
}
.share__img { width: 100%; height: 100%; object-fit: contain; transition: opacity 0.2s; }
.share__img--busy { opacity: 0.55; }
.share__loading { color: var(--cl-bone); font-size: 1.4rem; }
.share__photo { display: flex; justify-content: center; }
.share__hint { font-size: 0.82rem; color: var(--app-muted); text-align: center; }
.share__actions { display: flex; gap: 8px; width: 100%; }
</style>
