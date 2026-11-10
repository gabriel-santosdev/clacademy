<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'

definePageMeta({ layout: 'app' })

const route = useRoute()
const confirm = useConfirm()
const editor = useRunPlanEditor(String(route.params.id))
const { isNew, id, form, week, weeksList, weekSessions, addSession, removeSession, canCopyToNext, copyToNext, save, remove } = editor
await editor.load()
useHead({ title: isNew ? 'Nova planilha · CL Academy' : 'Editar planilha · CL Academy' })

const weekdayOptions = WEEKDAYS.map((d, i) => ({ label: d, value: i }))
const typeOptions = RUN_TYPES.map((t) => ({ label: LABELS.runType[t], value: t }))
const assignOpen = ref(false)

function askRemove() {
  confirm.require({
    header: 'Excluir planilha?',
    message: 'As atribuições desta planilha também serão removidas. Os registros dos alunos permanecem.',
    icon: 'pi pi-trash',
    acceptProps: { label: 'Excluir', severity: 'danger' },
    rejectProps: { label: 'Cancelar', severity: 'secondary', text: true },
    accept: () => remove(),
  })
}
</script>

<template>
  <div>
    <AppPageHeader :title="isNew ? 'Nova planilha' : form.title || 'Planilha'" back="/app/professor/corridas">
      <Button v-if="!isNew" label="Excluir" icon="pi pi-trash" severity="danger" text @click="askRemove" />
      <Button v-if="!isNew" label="Atribuir" icon="pi pi-send" severity="secondary" @click="assignOpen = true" />
      <Button label="Salvar" icon="pi pi-check" :loading="save.loading.value" @click="save()" />
    </AppPageHeader>

    <form class="stack" style="--gap: 20px" @submit.prevent="save()">
      <Card>
        <template #content>
          <div class="stack">
            <div class="field">
              <label for="rp-title">Título</label>
              <InputText id="rp-title" v-model="form.title" placeholder="Base 10K" required fluid />
            </div>
            <div class="grid-2">
              <div class="field">
                <label for="rp-goal">Objetivo</label>
                <InputText id="rp-goal" v-model="form.goal" placeholder="10K sub 50min" fluid />
              </div>
              <div class="field">
                <label for="rp-weeks">Semanas</label>
                <InputNumber v-model="form.weeks" input-id="rp-weeks" :min="1" :max="52" show-buttons fluid />
              </div>
            </div>
            <div class="field">
              <label for="rp-desc">Orientações gerais</label>
              <Textarea id="rp-desc" v-model="form.description" rows="3" auto-resize placeholder="Aquecimento, zonas, hidratação…" fluid />
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="weeks">
            <button v-for="w in weeksList" :key="w.week" type="button" :class="{ active: week === w.week }" @click="week = w.week">
              <strong>S{{ w.week }}</strong>
              <span>{{ w.km }} km</span>
            </button>
          </div>

          <div class="stack" style="--gap: 12px; margin-top: 16px">
            <div class="row row--between">
              <h3 class="h3">Semana {{ week }}</h3>
              <Button v-if="canCopyToNext" :label="`Copiar para semana ${week + 1}`" icon="pi pi-copy" size="small" text @click="copyToNext" />
            </div>

            <div v-for="{ s, idx } in weekSessions" :key="idx" class="sess">
              <div class="sess__fields">
                <div class="field">
                  <label>Dia</label>
                  <Select v-model="s.weekday" :options="weekdayOptions" option-label="label" option-value="value" fluid />
                </div>
                <div class="field">
                  <label>Tipo</label>
                  <Select v-model="s.type" :options="typeOptions" option-label="label" option-value="value" fluid />
                </div>
                <div class="field"><label>Km</label><InputNumber v-model="s.distanceKm" :min="0" :max="300" :max-fraction-digits="1" locale="pt-BR" fluid /></div>
                <div class="field"><label>Min</label><InputNumber v-model="s.durationMin" :min="0" :max="1440" fluid /></div>
                <div class="field"><label>Pace alvo</label><InputText v-model="s.targetPace" placeholder="5:30" fluid /></div>
                <InputText v-model="s.description" class="sess__wide" placeholder="Detalhes: 6x400m forte / 200m trote…" aria-label="Detalhes da sessão" />
              </div>
              <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Remover sessão" class="sess__del" @click="removeSession(idx)" />
            </div>
            <AppEmptyState v-if="!weekSessions.length" icon="pi-calendar" title="Semana sem treinos" text="Adicione as sessões desta semana." />
            <Button label="Adicionar sessão" icon="pi pi-plus" severity="secondary" outlined @click="addSession" />
          </div>
        </template>
      </Card>
    </form>

    <TrainingAssignDialog v-if="!isNew" v-model:visible="assignOpen" :run-plan-id="id" />
  </div>
</template>

<style scoped>
.weeks { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.weeks button {
  flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 64px;
  padding: 8px 12px; border: 0; border-radius: var(--radius); font-size: 0.8rem;
  background: var(--p-surface-100); color: var(--app-muted); transition: background 0.15s, color 0.15s;
}
.app-dark .weeks button { background: var(--p-surface-800); }
.weeks button span { font-size: 0.68rem; }
.weeks button.active { background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
.sess { display: flex; gap: 10px; padding: 14px; border: 1px solid var(--app-border); border-radius: var(--radius); background: var(--app-bg); }
.sess__fields { flex: 1; display: grid; gap: 10px; grid-template-columns: 1.3fr 1.3fr repeat(3, minmax(0, 1fr)); min-width: 0; }
.sess__wide { grid-column: 1 / -1; }
@media (max-width: 720px) { .sess__fields { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.sess__del { align-self: flex-start; }
</style>
