<script setup lang="ts">
import type { LogContext } from '../domain/activity'
import type { StoryData } from '../domain/story'

const visible = defineModel<boolean>('visible', { default: false })
const props = defineProps<{ context: LogContext }>()
const emit = defineEmits<{ saved: [story: StoryData] }>()

const context = toRef(props, 'context')
const { form, reset, title, free, effort, save } = useActivityLogForm(context, (story) => {
  visible.value = false
  emit('saved', story)
})
watch(visible, (v) => v && reset())
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="title" :style="{ width: 'min(480px, 96vw)' }" :breakpoints="{ '560px': '100vw' }">
    <form id="log-form" class="stack" @submit.prevent="save()">
      <div v-if="free" class="field">
        <label for="log-title">O que você fez?</label>
        <InputText id="log-title" v-model="form.title" placeholder="Ex: corrida leve, aulão do evento" fluid />
      </div>
      <p v-else-if="context.title" class="strong">{{ context.title }}</p>

      <div v-if="context.kind === 'corrida'" class="grid-2">
        <div class="field">
          <label for="log-km">Distância (km)</label>
          <InputNumber v-model="form.distanceKm" input-id="log-km" :min-fraction-digits="0" :max-fraction-digits="2" :min="0" locale="pt-BR" placeholder="5,0" fluid />
        </div>
        <div class="field">
          <label for="log-pace">Pace médio</label>
          <InputText id="log-pace" v-model="form.avgPace" inputmode="numeric" pattern="\d{1,2}:\d{2}" title="Formato min:seg, ex. 5:30" placeholder="5:30" fluid />
        </div>
      </div>
      <div class="field">
        <label for="log-min">Duração (min)</label>
        <InputNumber v-model="form.durationMin" input-id="log-min" :min="0" :max="1440" placeholder="45" fluid />
      </div>
      <div class="field">
        <label>Esforço percebido: <strong>{{ form.rpe }}/10</strong> · {{ effort }}</label>
        <Slider v-model="form.rpe" :min="1" :max="10" class="rpe" />
      </div>
      <div class="field">
        <label for="log-notes">Como foi? (opcional)</label>
        <Textarea id="log-notes" v-model="form.notes" rows="3" auto-resize placeholder="Sensações, dores, conquistas…" fluid />
      </div>
    </form>
    <template #footer>
      <Button label="Cancelar" severity="secondary" text @click="visible = false" />
      <Button type="submit" form="log-form" label="Salvar" icon="pi pi-check" :loading="save.loading.value" />
    </template>
  </Dialog>
</template>

<style scoped>
.rpe { margin: 12px 6px 4px; }
</style>
