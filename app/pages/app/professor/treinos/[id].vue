<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'

definePageMeta({ layout: 'app' })

const route = useRoute()
const confirm = useConfirm()
const editor = useWorkoutEditor(String(route.params.id))
const { isNew, id, form, save, remove, addExercise, removeExercise, moveExercise } = editor
await editor.load()
useHead({ title: isNew ? 'Novo treino · CL Academy' : 'Editar treino · CL Academy' })

const assignOpen = ref(false)
const preview = ref<{ url: string; title: string; notes: string } | null>(null)
const previewOpen = computed({ get: () => !!preview.value, set: (v) => !v && (preview.value = null) })
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
</script>

<template>
  <div>
    <AppPageHeader :title="isNew ? 'Novo treino' : form.title || 'Treino'" back="/app/professor/treinos">
      <Button v-if="!isNew" label="Excluir" icon="pi pi-trash" severity="danger" text @click="askRemove" />
      <Button v-if="!isNew" label="Atribuir" icon="pi pi-send" severity="secondary" @click="assignOpen = true" />
      <Button label="Salvar" icon="pi pi-check" :loading="save.loading.value" @click="save()" />
    </AppPageHeader>

    <form class="stack" style="--gap: 20px" @submit.prevent="save()">
      <Card>
        <template #content>
          <div class="stack">
            <div class="row" style="align-items: flex-end">
              <div class="field grow">
                <label for="w-title">Título</label>
                <InputText id="w-title" v-model="form.title" placeholder="Treino A — Inferiores" required fluid />
              </div>
              <div class="field" style="width: 110px">
                <label for="w-tag">Sigla</label>
                <InputText id="w-tag" v-model="form.tag" placeholder="A" maxlength="40" fluid />
              </div>
            </div>
            <div class="field">
              <label for="w-desc">Descrição</label>
              <Textarea id="w-desc" v-model="form.description" rows="3" auto-resize placeholder="Objetivo, aquecimento, observações gerais…" fluid />
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Exercícios ({{ form.items.length }})</template>
        <template #content>
          <div class="stack" style="--gap: 12px">
            <div v-for="(it, i) in form.items" :key="i" class="ex">
              <div class="ex__order">
                <span class="mono strong">{{ i + 1 }}</span>
                <Button icon="pi pi-chevron-up" text rounded size="small" severity="secondary" aria-label="Subir" :disabled="i === 0" @click="moveExercise(i, -1)" />
                <Button icon="pi pi-chevron-down" text rounded size="small" severity="secondary" aria-label="Descer" :disabled="i === form.items.length - 1" @click="moveExercise(i, 1)" />
              </div>
              <div class="ex__fields">
                <InputText v-model="it.name" class="ex__name" placeholder="Nome do exercício" aria-label="Nome do exercício" />
                <div class="field"><label>Séries</label><InputNumber v-model="it.sets" :min="0" :max="100" fluid /></div>
                <div class="field"><label>Reps</label><InputText v-model="it.reps" placeholder="10-12" fluid /></div>
                <div class="field"><label>Carga</label><InputText v-model="it.load" placeholder="20kg" fluid /></div>
                <div class="field"><label>Descanso (s)</label><InputNumber v-model="it.restSeconds" :min="0" :max="3600" fluid /></div>
                <InputText v-model="it.notes" class="ex__wide" placeholder="Observação (opcional)" aria-label="Observação" />
                <div class="ex__wide ex__video">
                  <InputText
                    v-model="it.videoUrl"
                    type="url"
                    class="grow"
                    placeholder="Demonstração: link do YouTube, Shorts, Instagram, Drive, .mp4 ou GIF"
                    aria-label="Link da demonstração do exercício"
                  />
                  <Button
                    icon="pi pi-play-circle"
                    severity="secondary"
                    outlined
                    aria-label="Pré-visualizar demonstração"
                    :disabled="!parseDemoUrl(it.videoUrl)"
                    @click="preview = { url: it.videoUrl, title: it.name, notes: it.notes }"
                  />
                </div>
              </div>
              <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Remover exercício" class="ex__del" @click="removeExercise(i)" />
            </div>
            <Button label="Adicionar exercício" icon="pi pi-plus" severity="secondary" outlined @click="addExercise" />
          </div>
        </template>
      </Card>
    </form>

    <TrainingExerciseDemo v-model:visible="previewOpen" :url="preview?.url" :title="preview?.title" :notes="preview?.notes" />
    <TrainingAssignDialog v-if="!isNew" v-model:visible="assignOpen" :workout-id="id" />
  </div>
</template>

<style scoped>
.ex { display: flex; gap: 12px; padding: 14px; border: 1px solid var(--app-border); border-radius: var(--radius); background: var(--app-bg); }
.ex__order { display: flex; flex-direction: column; align-items: center; gap: 0; }
.ex__fields { flex: 1; display: grid; gap: 10px; grid-template-columns: repeat(4, minmax(0, 1fr)); min-width: 0; }
.ex__name { grid-column: 1 / -1; font-weight: 600; }
.ex__wide { grid-column: span 2; }
@media (max-width: 640px) {
  .ex__fields { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ex__wide { grid-column: 1 / -1; }
}
.ex__del { align-self: flex-start; }
.ex__video { display: flex; gap: 8px; grid-column: 1 / -1; }
</style>
