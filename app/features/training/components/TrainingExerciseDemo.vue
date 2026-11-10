<script setup lang="ts">
/** Demonstração do exercício dentro do app (YouTube, Vimeo, Drive, Instagram, vídeo ou GIF). */
const visible = defineModel<boolean>('visible', { default: false })
defineProps<{ url: string | null | undefined; title?: string; notes?: string | null }>()
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    dismissable-mask
    :header="title || 'Demonstração'"
    :style="{ width: 'min(560px, 96vw)' }"
    :breakpoints="{ '560px': '100vw' }"
    :pt="{ content: { style: 'padding-bottom: 18px' } }"
  >
    <!-- v-if no visible: fechar o diálogo para o vídeo -->
    <div v-if="visible" class="stack" style="--gap: 12px">
      <TrainingDemoMedia :url="url" :title="title" />
      <p v-if="notes" class="notes"><i class="pi pi-info-circle" /> {{ notes }}</p>
    </div>
  </Dialog>
</template>

<style scoped>
.notes { display: flex; gap: 8px; font-size: 0.9rem; color: var(--app-muted); }
.notes .pi { margin-top: 3px; font-size: 0.8rem; }
</style>
