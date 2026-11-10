<script setup lang="ts">
import type { ExerciseLike } from '~/features/exercises/domain/exercise'

definePageMeta({ layout: 'app' })
useHead({ title: 'Exercícios · CL Academy' })

const { data, refresh, filters, list, counts } = await useExerciseLibrary()
const { user } = useUserSession()
const editor = useExerciseEditor(() => refresh())
const { visible: formOpen, form, editingId, save, archive } = editor
const editingCurrent = computed(() => data.value.find((e) => e.id === editingId.value) ?? null)

const detail = ref<ExerciseLike | null>(null)
const detailOpen = computed({ get: () => !!detail.value, set: (v) => !v && (detail.value = null) })
const detailData = computed(() => (detail.value ? { ...detail.value, hasLicensedVideo: !!detail.value.externalId } : null))
function edit(ex: ExerciseLike) {
  detail.value = null
  editor.open(ex)
}
const withVideo = computed(() => data.value.filter((e) => e.videoUrl || e.externalId).length)

/* vídeos licenciados (MuscleWiki) */
const { data: licensed, refresh: refreshLicensed } = await useFetch('/api/coach/musclewiki/status', { key: 'musclewiki-status' })
const notify = useNotify()
const autoLink = useAction(async () => {
  const r = await exercisesApi.autoLinkLicensed()
  await Promise.all([refresh(), refreshLicensed()])
  notify.success(
    `${r.linked} exercícios receberam vídeo`,
    r.notFound.length ? `Sem correspondência automática: ${r.notFound.join(', ')}. Vincule manualmente em "Editar".` : undefined,
  )
})
async function onMediaChanged() {
  await Promise.all([refresh(), refreshLicensed()])
  editor.syncMedia(editingCurrent.value ?? undefined)
}
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <AppPageHeader title="Banco de exercícios" subtitle="Escolha, edite ou cadastre os exercícios usados nas fichas">
      <Button label="Novo exercício" icon="pi pi-plus" @click="editor.open()" />
    </AppPageHeader>

    <div class="grid-auto" style="--min: 150px; --gap: 12px">
      <AppStatCard label="Exercícios" :value="data.length" icon="pi-images" />
      <AppStatCard label="Com vídeo" :value="withVideo" icon="pi-play-circle" />
      <AppStatCard ink label="Grupos musculares" :value="Object.keys(counts).length" icon="pi-th-large" />
    </div>

    <div v-if="licensed" class="licensed" :class="{ 'licensed--off': !licensed.enabled }">
      <i class="pi pi-video licensed__icon" />
      <div class="grow">
        <strong>Vídeos de execução</strong>
        <p v-if="licensed.enabled" class="small muted">
          {{ licensed.linked }} de {{ licensed.total }} exercícios com vídeo licenciado (frente/lado, feminino/masculino).
        </p>
        <p v-else class="small muted">
          Integração com o MuscleWiki desligada. Defina <code>NUXT_MUSCLEWIKI_API_KEY</code> para liberar vídeos profissionais de execução.
        </p>
      </div>
      <Button
        v-if="licensed.enabled && user?.role === 'admin' && licensed.linked < licensed.total"
        label="Vincular vídeos automaticamente"
        icon="pi pi-bolt"
        :loading="autoLink.loading.value"
        @click="autoLink()"
      />
    </div>

    <ExerciseFilterBar v-model="filters" :counts="counts" :total="data.length" />

    <AppEmptyState v-if="!list.length" icon="pi-search" title="Nenhum exercício encontrado" text="Ajuste a busca ou cadastre um novo exercício.">
      <Button label="Novo exercício" icon="pi pi-plus" size="small" severity="secondary" outlined @click="editor.open()" />
    </AppEmptyState>
    <div v-else class="lib-grid">
      <ExerciseCard v-for="e in list" :key="e.id" :exercise="e" @open="detail = e" />
    </div>

    <ExerciseDetailDialog v-model:visible="detailOpen" :exercise="detailData">
      <p v-if="detail?.source === 'catalogo'" class="tiny muted">
        Exercício do catálogo inicial. Você pode editar o nome, a dica ou incluir um vídeo gravado pela equipe.
      </p>
      <template #footer>
        <Button label="Fechar" severity="secondary" text @click="detail = null" />
        <Button label="Editar" icon="pi pi-pencil" @click="detail && edit(detail)" />
      </template>
    </ExerciseDetailDialog>

    <ExerciseFormDialog
      v-model:visible="formOpen"
      :form="form"
      :editing="!!editingId"
      :current="editingCurrent"
      :licensed-enabled="!!licensed?.enabled"
      :uploads-enabled="!!licensed?.uploads"
      :loading="save.loading.value"
      @save="save()"
      @archive="archive()"
      @media-changed="onMediaChanged"
    />
  </div>
</template>

<style scoped>
.licensed { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; padding: 14px 16px; border-radius: var(--radius); background: var(--cl-ink); color: var(--cl-bone); }
.licensed .muted { color: #a6a6a6; }
.licensed code { color: var(--cl-hi); }
.licensed__icon { font-size: 1.3rem; color: var(--cl-hi); }
.licensed--off .licensed__icon { color: #a6a6a6; }
.app-dark .licensed { background: #202020; border: 1px solid #2e2e2e; }
.lib-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
@media (max-width: 480px) { .lib-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; } }
</style>
