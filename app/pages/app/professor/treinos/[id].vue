<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import type { MenuItem } from 'primevue/menuitem'
import type { ExerciseDetail, ExerciseLike } from '~/features/exercises/domain/exercise'

definePageMeta({ layout: 'app' })

const route = useRoute()
const confirm = useConfirm()
const editor = useWorkoutEditor(String(route.params.id))
const { isNew, id, form, dirty, summary, inWorkout, save, remove } = editor
await editor.load()
useHead({ title: () => `${form.title || (isNew ? 'Novo treino' : 'Treino')} · CL Academy` })

/* ── atribuir depois de salvar ───────────────────────── */
/** ?atribuir=12,15: ficha criada a partir da atribuição para esses alunos */
const assignTo = computed(() =>
  String(route.query.atribuir ?? '')
    .split(',')
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0),
)
const assignOpen = ref(false)
onMounted(() => {
  if (!isNew && (assignTo.value.length || route.query.enviar)) assignOpen.value = true
})
function onAssigned() {
  if (assignTo.value.length) navigateTo(`/app/professor/alunos/${assignTo.value[0]}`)
}
async function saveAndAssign() {
  const ok = await save({ assign: true })
  if (ok && !isNew) assignOpen.value = true
}

/* ── descrição e menu ────────────────────────────────── */
const descOpen = ref(!!form.description)
const menu = ref()
const menuItems: MenuItem[] = [
  { label: 'Atribuir a alunos', icon: 'pi pi-send', command: () => (assignOpen.value = true) },
  { separator: true },
  { label: 'Excluir treino', icon: 'pi pi-trash', class: 'menu-danger', command: askRemove },
]
function askRemove() {
  confirm.require({
    header: 'Excluir treino?',
    message: 'As atribuições deste treino aos alunos também serão removidas. Os registros já feitos ficam no histórico.',
    icon: 'pi pi-trash',
    acceptProps: { label: 'Excluir', severity: 'danger' },
    rejectProps: { label: 'Cancelar', severity: 'secondary', text: true },
    accept: () => remove(),
  })
}

/* ── banco de exercícios (lateral no computador, gaveta no celular) ── */
const drawerOpen = ref(false)
const addedNow = ref(0)
function addFromPanel(e: ExerciseLike) {
  editor.addFromLibrary([e])
  addedNow.value++
}
watch(drawerOpen, (v) => v && (addedNow.value = 0))

/* criar exercício sem sair daqui: ele já entra na ficha */
const library = useExerciseLibrary({ lazy: true })
const exEditor = useExerciseEditor(async () => {
  await library.refresh()
  const created = library.data.value.find((e) => e.id === exEditor.editingId.value)
  if (created && !inWorkout.value.has(created.id)) editor.addFromLibrary([created])
})
const exCurrent = computed(() => library.data.value.find((e) => e.id === exEditor.editingId.value) ?? null)
const { data: integrations } = useFetch('/api/coach/musclewiki/status', { key: 'musclewiki-status', lazy: true })
async function onMediaChanged() {
  await library.refresh()
  exEditor.syncMedia(exCurrent.value ?? undefined)
  // a ficha passa a mostrar o vídeo novo
  for (const it of form.items) {
    if (it.exerciseId === exCurrent.value?.id && exCurrent.value) it.exercise = exCurrent.value
  }
}

/* ── "como fazer" ────────────────────────────────────── */
const detail = ref<ExerciseDetail | null>(null)
const detailOpen = computed({ get: () => !!detail.value, set: (v) => !v && (detail.value = null) })
function previewItem(i: number) {
  const it = form.items[i]!
  detail.value = itemToDetail({ ...it, reps: it.reps || null, load: it.load || null, notes: it.notes || null, videoUrl: it.videoUrl || null })
}
function previewLibrary(e: ExerciseLike) {
  detail.value = { ...e, hasLicensedVideo: !!e.externalId }
}

/* ── arrastar para reordenar ─────────────────────────── */
const dragIndex = ref<number | null>(null)
function onDragStart(e: DragEvent, i: number) {
  dragIndex.value = i
  e.dataTransfer?.setData('text/plain', String(i))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  const card = (e.target as HTMLElement).closest('.wb__item')
  if (card && e.dataTransfer) e.dataTransfer.setDragImage(card, 24, 24)
}
function onDragOver(i: number) {
  if (dragIndex.value === null || dragIndex.value === i) return
  editor.reorderExercise(dragIndex.value, i)
  dragIndex.value = i
}

/* ── aplicar a todos ─────────────────────────────────── */
const bulkPreset = ref<string | null>(null)
function applyPreset(label: string) {
  const p = PRESCRIPTION_PRESETS.find((x) => x.label === label)
  if (p) editor.applyAll({ sets: p.sets, reps: p.reps })
  bulkPreset.value = null
}

/* ── não perder alterações ───────────────────────────── */
onBeforeRouteLeave(() => {
  if (!dirty.value) return true
  return new Promise<boolean>((resolve) => {
    confirm.require({
      header: 'Sair sem salvar?',
      message: 'As alterações desta ficha ainda não foram salvas.',
      icon: 'pi pi-exclamation-triangle',
      acceptProps: { label: 'Sair sem salvar', severity: 'danger' },
      rejectProps: { label: 'Continuar editando', severity: 'secondary', text: true },
      accept: () => resolve(true),
      reject: () => resolve(false),
      onHide: () => resolve(false),
    })
  })
})
function onBeforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) e.preventDefault()
}
onMounted(() => window.addEventListener('beforeunload', onBeforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))
</script>

<template>
  <div class="wb">
    <!-- cabeçalho: nome editável no próprio título -->
    <header class="wb__head">
      <NuxtLink to="/app/professor/treinos" class="wb__back"><i class="pi pi-arrow-left" /> Treinos</NuxtLink>
      <div class="wb__title-row">
        <input v-model="form.title" class="wb__title" placeholder="Nome do treino" aria-label="Nome do treino" maxlength="160" />
        <span class="wb__status" :class="{ 'wb__status--dirty': dirty }">
          <i :class="['pi', dirty ? 'pi-circle-fill' : 'pi-check']" /> {{ dirty ? 'Não salvo' : 'Salvo' }}
        </span>
        <template v-if="!isNew">
          <Button icon="pi pi-ellipsis-v" text rounded severity="secondary" aria-label="Mais ações" @click="menu.toggle($event)" />
          <Menu ref="menu" :model="menuItems" popup />
        </template>
      </div>

      <div class="wb__meta">
        <InputText v-model="form.tag" placeholder="Sigla (A, B…)" maxlength="40" class="wb__tag" aria-label="Sigla" />
        <Select v-model="form.level" :options="LEVEL_OPTIONS" option-label="label" option-value="value" placeholder="Nível: qualquer" show-clear class="wb__sel" aria-label="Nível" />
        <Select v-model="form.goal" :options="GOAL_OPTIONS" option-label="label" option-value="value" placeholder="Objetivo: qualquer" show-clear class="wb__sel" aria-label="Objetivo" />
        <Button
          v-if="!descOpen"
          label="Descrição"
          icon="pi pi-plus"
          text
          size="small"
          severity="secondary"
          @click="descOpen = true"
        />
      </div>
      <Textarea
        v-if="descOpen"
        v-model="form.description"
        rows="2"
        auto-resize
        placeholder="Objetivo da ficha, aquecimento, observações gerais…"
        aria-label="Descrição"
        fluid
      />
      <Message v-if="isNew && assignTo.length" severity="info" icon="pi pi-send" size="small">
        Ao salvar, esta ficha abre pronta para atribuir ao aluno.
      </Message>
    </header>

    <div class="wb__body">
      <!-- ficha -->
      <section class="wb__list" aria-label="Exercícios da ficha">
        <div v-if="form.items.length > 1" class="wb__bulk">
          <span class="muted small">Aplicar a todos:</span>
          <Select
            v-model="bulkPreset"
            :options="PRESCRIPTION_PRESETS.map((p) => p.label)"
            placeholder="Séries×reps"
            size="small"
            class="wb__bulk-sel"
            @update:model-value="(v: string | null) => v && applyPreset(v)"
          />
          <button v-for="r in REST_PRESETS" :key="r" type="button" class="wb__bulk-chip" @click="editor.applyAll({ restSeconds: r })">{{ r }}s</button>
        </div>

        <div v-if="!form.items.length" class="wb__empty">
          <span class="wb__empty-icon"><i class="pi pi-bolt" /></span>
          <h2>Monte a ficha</h2>
          <p>
            <span class="only-wide">Toque nos exercícios do banco ao lado para adicionar.</span>
            <span class="only-narrow">Adicione exercícios do banco: eles já vêm com vídeo e dica de execução para o aluno.</span>
          </p>
          <div class="wb__empty-actions">
            <Button label="Adicionar exercícios" icon="pi pi-plus" class="only-narrow" @click="drawerOpen = true" />
            <Button label="Exercício livre" icon="pi pi-pencil" severity="secondary" text @click="editor.addExercise()" />
          </div>
        </div>

        <TransitionGroup name="wb-item" tag="div" class="wb__items">
          <div
            v-for="(it, i) in form.items"
            :key="it.uid"
            class="wb__item"
            :class="{ 'wb__item--dragging': dragIndex === i }"
            @dragover.prevent="onDragOver(i)"
            @drop.prevent="dragIndex = null"
          >
            <TrainingBuilderItem
              :item="it"
              :index="i"
              :total="form.items.length"
              @preview="previewItem(i)"
              @remove="editor.removeExercise(i)"
              @duplicate="editor.duplicateExercise(i)"
              @move="(d) => editor.moveExercise(i, d)"
              @dragstart="(e) => onDragStart(e, i)"
              @dragend="dragIndex = null"
            />
          </div>
        </TransitionGroup>

        <div v-if="form.items.length" class="wb__add">
          <Button label="Adicionar exercícios" icon="pi pi-plus" class="only-narrow" @click="drawerOpen = true" />
          <Button label="Exercício livre" icon="pi pi-pencil" severity="secondary" text size="small" @click="editor.addExercise()" />
        </div>
      </section>

      <!-- banco ao lado (telas largas) -->
      <aside class="wb__lib only-wide" aria-label="Banco de exercícios">
        <h2 class="wb__lib-title">Banco de exercícios</h2>
        <ExerciseLibraryPanel :in-workout="inWorkout" @add="addFromPanel" @preview="previewLibrary" @create="exEditor.open()" />
      </aside>
    </div>

    <!-- barra fixa: resumo + salvar -->
    <footer class="wb__bar">
      <div class="wb__sum">
        <strong>{{ summary.count }} {{ summary.count === 1 ? 'exercício' : 'exercícios' }}</strong>
        <span v-if="summary.count">· ~{{ summary.minutes }} min</span>
        <span class="wb__groups">
          <span v-for="g in summary.groups.slice(0, 4)" :key="g.group" class="wb__group">{{ LABELS.muscleGroup[g.group] }}</span>
        </span>
      </div>
      <div class="wb__actions">
        <Button
          label="Salvar"
          icon="pi pi-check"
          severity="secondary"
          :disabled="!dirty && !isNew"
          :loading="save.loading.value"
          @click="save()"
        />
        <Button :label="assignTo.length ? 'Salvar e atribuir ao aluno' : 'Salvar e atribuir'" icon="pi pi-send" :loading="save.loading.value" @click="saveAndAssign" />
      </div>
    </footer>

    <!-- gaveta do banco (celular/tablet) -->
    <Drawer v-model:visible="drawerOpen" position="bottom" class="wb__drawer" :pt="{ content: { class: 'wb__drawer-content' } }">
      <template #header>
        <div class="wb__drawer-head">
          <strong>Adicionar exercícios</strong>
          <span v-if="addedNow" class="wb__added">{{ addedNow }} {{ addedNow === 1 ? 'adicionado' : 'adicionados' }}</span>
        </div>
      </template>
      <ExerciseLibraryPanel :in-workout="inWorkout" @add="addFromPanel" @preview="previewLibrary" @create="exEditor.open()" />
      <template #footer>
        <Button :label="addedNow ? 'Concluir' : 'Fechar'" icon="pi pi-check" fluid @click="drawerOpen = false" />
      </template>
    </Drawer>

    <ExerciseDetailDialog v-model:visible="detailOpen" :exercise="detail" />
    <ExerciseFormDialog
      v-model:visible="exEditor.visible.value"
      :form="exEditor.form"
      :editing="!!exEditor.editingId.value"
      :current="exCurrent"
      :uploads-enabled="!!integrations?.uploads"
      :licensed-enabled="!!integrations?.enabled"
      :loading="exEditor.save.loading.value"
      @save="exEditor.save()"
      @media-changed="onMediaChanged"
    />
    <TrainingAssignDialog
      v-if="!isNew"
      v-model:visible="assignOpen"
      :workout-id="id"
      :aluno-ids="assignTo.length ? assignTo : undefined"
      @saved="onAssigned"
    />
  </div>
</template>

<style scoped>
.wb { display: flex; flex-direction: column; gap: 18px; padding-bottom: 96px; }

/* cabeçalho */
.wb__head { display: flex; flex-direction: column; gap: 12px; }
.wb__back { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; font-size: 0.85rem; font-weight: 700; color: var(--app-muted); }
.wb__back:hover { color: var(--app-text); }
.wb__back .pi { font-size: 0.75rem; }
.wb__title-row { display: flex; align-items: center; gap: 10px; }
.wb__title {
  flex: 1; min-width: 0; padding: 4px 8px; margin-left: -8px; border: 1.5px solid transparent; border-radius: 12px; background: transparent;
  font-family: var(--font-display); font-weight: 800; font-size: clamp(1.8rem, 4vw, 2.6rem); line-height: 1.05; text-transform: uppercase; color: var(--app-text);
}
.wb__title::placeholder { color: var(--app-muted); opacity: 0.6; }
.wb__title:hover { border-color: var(--app-border); }
.wb__title:focus { outline: none; border-color: var(--accent-text); background: var(--app-tile); }
.wb__status { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; font-size: 0.75rem; font-weight: 700; color: var(--app-muted); }
.wb__status .pi { font-size: 0.6rem; }
.wb__status--dirty { color: #c27c00; }
.wb__meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.wb__tag { width: 130px; }
.wb__sel { min-width: 170px; }

/* corpo: ficha + banco */
.wb__body { display: grid; gap: 20px; grid-template-columns: minmax(0, 1fr); align-items: start; }
@media (min-width: 1100px) { .wb__body { grid-template-columns: minmax(0, 1fr) 360px; } }
.wb__list { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.wb__items { display: flex; flex-direction: column; gap: 10px; }
.wb__item { transition: opacity 0.15s; }
.wb__item--dragging { opacity: 0.4; }
.wb-item-move, .wb-item-enter-active, .wb-item-leave-active { transition: transform 0.25s var(--ease-out), opacity 0.2s; }
.wb-item-enter-from { opacity: 0; transform: translateY(-6px); }
.wb-item-leave-to { opacity: 0; transform: translateX(20px); }
.wb-item-leave-active { position: absolute; width: 100%; }

.wb__bulk { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.wb__bulk-sel { min-width: 130px; }
.wb__bulk-chip { padding: 4px 10px; border-radius: 999px; border: 1px solid var(--app-border); background: var(--app-tile); cursor: pointer; font: inherit; font-size: 0.78rem; font-weight: 700; color: var(--app-text); }
.wb__bulk-chip:hover { border-color: var(--app-muted); }

.wb__empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 20px; text-align: center;
  border: 1.5px dashed var(--app-border); border-radius: var(--radius-lg); background: var(--app-tile);
}
.wb__empty-icon { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: var(--cl-ink); color: var(--cl-hi); font-size: 1.3rem; }
.wb__empty h2 { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; text-transform: uppercase; }
.wb__empty p { max-width: 360px; color: var(--app-muted); font-size: 0.92rem; }
.wb__empty-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 6px; }
.wb__add { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }

.wb__lib {
  position: sticky; top: calc(var(--topbar-h) + 16px); display: flex; flex-direction: column; gap: 12px; padding: 16px;
  height: calc(100dvh - var(--topbar-h) - 140px); min-height: 420px;
  border: 1px solid var(--app-border); border-radius: var(--radius-lg); background: var(--app-tile);
}
.wb__lib-title { font-family: var(--font-display); font-weight: 800; font-size: 1.2rem; text-transform: uppercase; }

/* barra fixa */
.wb__bar {
  position: fixed; z-index: 20; left: var(--wb-left, 0); right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  padding: 12px max(16px, env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) 20px;
  background: color-mix(in srgb, var(--app-tile) 92%, transparent); backdrop-filter: blur(10px);
  border-top: 1px solid var(--app-border); box-shadow: 0 -12px 30px -24px rgba(0, 0, 0, 0.5);
}
@media (min-width: 960px) { .wb__bar { --wb-left: var(--sidebar-w); } }
@media (max-width: 959px) {
  /* flutua logo acima da barra de navegação do celular */
  .wb__bar {
    left: 12px; right: 12px; bottom: calc(var(--bottombar-h) + 18px + env(safe-area-inset-bottom));
    padding: 10px 12px; border: 1px solid var(--app-border); border-radius: 20px;
  }
  .wb { padding-bottom: 190px; }
}
.wb__sum { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 0.88rem; color: var(--app-muted); min-width: 0; }
.wb__sum strong { color: var(--app-text); }
.wb__groups { display: inline-flex; flex-wrap: wrap; gap: 4px; }
.wb__group { padding: 2px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-text); font-size: 0.72rem; font-weight: 800; }
.wb__actions { display: flex; gap: 8px; }
@media (max-width: 520px) {
  .wb__actions { width: 100%; }
  .wb__actions :deep(.p-button) { flex: 1; }
  .wb__groups { display: none; }
}

/* gaveta */
.wb__drawer-head { display: flex; align-items: center; gap: 10px; }
.wb__added { padding: 2px 10px; border-radius: 999px; background: var(--accent); color: var(--accent-ink); font-size: 0.75rem; font-weight: 800; }

/* o que aparece em cada largura */
.only-wide { display: none; }
@media (min-width: 1100px) {
  .only-wide { display: revert; }
  .wb__lib.only-wide { display: flex; }
  .only-narrow { display: none !important; }
}
:deep(.menu-danger .p-menu-item-label), :deep(.menu-danger .p-menu-item-icon) { color: var(--p-red-500); }
</style>

<style>
.wb__drawer { height: 88dvh !important; border-radius: 22px 22px 0 0; }
.wb__drawer-content { display: flex; flex-direction: column; min-height: 0; }
</style>
