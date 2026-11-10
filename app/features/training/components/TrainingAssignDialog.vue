<script setup lang="ts">
/** Atribuir treino ou planilha. Passe aluno(s) OU treino/planilha já escolhidos. */
const visible = defineModel<boolean>('visible', { default: false })
const props = defineProps<{ alunoIds?: number[]; workoutId?: number; runPlanId?: number }>()
const emit = defineEmits<{ saved: [] }>()

const { form, needsAlunos, needsContent, workoutOptions, runPlanOptions, alunoOptions, canSubmit, reset, submit } = useAssignForm(
  () => ({ alunoIds: props.alunoIds, workoutId: props.workoutId, runPlanId: props.runPlanId }),
  () => {
    visible.value = false
    emit('saved')
  },
)
watch(visible, (v) => v && reset())

const kindOptions = [
  { label: 'Treino de academia', value: 'workout' },
  { label: 'Planilha de corrida', value: 'run' },
]
const weekdayOptions = WEEKDAYS_SHORT.map((d, i) => ({ label: d.slice(0, 1), title: d, value: i }))
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Atribuir treino" :style="{ width: 'min(720px, 96vw)' }" :breakpoints="{ '560px': '100vw' }">
    <form id="assign-form" class="stack" @submit.prevent="submit()">
      <template v-if="needsContent">
        <SelectButton v-model="form.kind" :options="kindOptions" option-label="label" option-value="value" :allow-empty="false" />
        <div v-if="form.kind === 'workout'" class="field">
          <label for="as-workout">Treino</label>
          <Select v-model="form.workoutId" input-id="as-workout" :options="workoutOptions" option-label="label" option-value="value" placeholder="Selecione…" filter fluid />
        </div>
        <div v-else class="field">
          <label for="as-plan">Planilha</label>
          <Select v-model="form.runPlanId" input-id="as-plan" :options="runPlanOptions" option-label="label" option-value="value" placeholder="Selecione…" filter fluid />
        </div>
      </template>

      <div v-if="needsAlunos" class="field">
        <label for="as-alunos">Alunos</label>
        <MultiSelect
          v-model="form.alunoIds"
          input-id="as-alunos"
          :options="alunoOptions"
          option-label="label"
          option-value="value"
          display="chip"
          filter
          placeholder="Escolha um ou mais alunos"
          :max-selected-labels="4"
          selected-items-label="{0} alunos"
          fluid
        >
          <template #option="{ option }">
            <span class="grow">{{ option.label }}</span>
            <Tag v-if="option.inactive" value="sem plano ativo" severity="warn" />
          </template>
        </MultiSelect>
      </div>

      <div class="grid-2">
        <div class="field">
          <label for="as-start">Início</label>
          <InputText id="as-start" v-model="form.startDate" type="date" required fluid />
        </div>
        <div class="field">
          <label for="as-end">Fim (opcional)</label>
          <InputText id="as-end" v-model="form.endDate" type="date" fluid />
        </div>
      </div>

      <div v-if="form.kind === 'workout'" class="field">
        <span class="field__label">Dias da semana</span>
        <SelectButton v-model="form.weekdays" :options="weekdayOptions" option-label="label" option-value="value" multiple class="weekdays">
          <template #option="{ option }"><span :title="option.title">{{ option.label }}</span></template>
        </SelectButton>
        <small>Sem dias marcados = aparece todos os dias</small>
      </div>

      <div class="field">
        <label for="as-notes">Observações para o aluno</label>
        <Textarea id="as-notes" v-model="form.notes" rows="3" auto-resize placeholder="Ex: foco na execução, aumentar carga na semana 2…" fluid />
      </div>
    </form>
    <template #footer>
      <Button label="Cancelar" severity="secondary" text @click="visible = false" />
      <Button type="submit" form="assign-form" label="Enviar" icon="pi pi-send" :loading="submit.loading.value" :disabled="!canSubmit" />
    </template>
  </Dialog>
</template>

<style scoped>
.weekdays { flex-wrap: wrap; }
</style>
