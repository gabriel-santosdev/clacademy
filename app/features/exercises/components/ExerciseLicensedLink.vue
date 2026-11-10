<script setup lang="ts">
/** Vincular manualmente o exercício a um vídeo do MuscleWiki (busca em inglês). */
const props = defineProps<{ exerciseId: number; externalId: number | null | undefined; suggestion?: string }>()
const emit = defineEmits<{ changed: [externalId: number | null] }>()

const q = ref('')
const results = ref<{ id: number; name: string; category: string | null; videos: number }[]>([])
const searching = ref(false)
const error = ref('')

async function search() {
  if (q.value.trim().length < 2) return
  searching.value = true
  error.value = ''
  try {
    results.value = await exercisesApi.searchLicensed(q.value.trim())
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    searching.value = false
  }
}

const link = useAction(async (externalId: number | null) => {
  await exercisesApi.linkLicensed(props.exerciseId, externalId)
  emit('changed', externalId)
  results.value = []
}, 'Vídeo atualizado')
</script>

<template>
  <div class="ll">
    <div class="ll__head">
      <span class="ll__title"><i class="pi pi-video" /> Vídeo licenciado (MuscleWiki)</span>
      <template v-if="externalId">
        <Tag value="vinculado" severity="success" />
        <Button label="Remover vínculo" size="small" text severity="danger" :loading="link.loading.value" @click="link(null)" />
      </template>
      <Tag v-else value="sem vídeo" severity="secondary" />
    </div>
    <form class="ll__search" @submit.prevent="search">
      <InputText v-model="q" :placeholder="suggestion ? `Buscar em inglês (ex.: ${suggestion})` : 'Buscar em inglês (ex.: barbell squat)'" fluid />
      <Button type="submit" icon="pi pi-search" severity="secondary" :loading="searching" aria-label="Buscar" />
    </form>
    <Message v-if="error" severity="warn" size="small" variant="simple">{{ error }}</Message>
    <ul v-if="results.length" class="ll__results">
      <li v-for="r in results" :key="r.id">
        <span class="grow">
          <strong>{{ r.name }}</strong>
          <small class="muted"> · {{ r.videos }} vídeos<template v-if="r.category"> · {{ r.category }}</template></small>
        </span>
        <Button :label="r.id === externalId ? 'Atual' : 'Usar'" size="small" :disabled="r.id === externalId || !r.videos" :loading="link.loading.value" @click="link(r.id)" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ll { display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--app-border); border-radius: var(--radius); background: var(--app-bg); }
.ll__head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ll__title { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; font-size: 0.9rem; margin-right: auto; }
.ll__search { display: flex; gap: 6px; }
.ll__results { display: flex; flex-direction: column; max-height: 220px; overflow-y: auto; }
.ll__results li { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-top: 1px solid var(--app-border); font-size: 0.88rem; }
</style>
