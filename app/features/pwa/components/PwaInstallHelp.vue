<script setup lang="ts">
/** Instruções de instalação (iOS / navegadores sem prompt nativo). Instância única no app.vue. */
const { steps, helpOpen, platform } = usePwaInstall()
</script>

<template>
  <Dialog v-model:visible="helpOpen" modal header="Instalar a CL Academy" :style="{ width: 'min(440px, 94vw)' }" dismissable-mask>
    <p class="muted small intro">
      {{ platform === 'ios' ? 'No iPhone e iPad a instalação é feita pelo Safari:' : 'Seu navegador não abriu o instalador automático. Faça assim:' }}
    </p>
    <ol class="steps">
      <li v-for="(s, i) in steps" :key="i">
        <span class="steps__n">{{ i + 1 }}</span>
        <i :class="['pi', s.icon]" />
        <span>{{ s.text }}</span>
      </li>
    </ol>
    <template #footer>
      <Button label="Entendi" @click="helpOpen = false" />
    </template>
  </Dialog>
</template>

<style scoped>
.intro { margin-bottom: 16px; }
.steps { display: flex; flex-direction: column; gap: 12px; }
.steps li { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
.steps__n {
  width: 26px; height: 26px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center;
  background: var(--p-primary-color); color: var(--p-primary-contrast-color); font-size: 0.75rem; font-weight: 700;
}
.steps .pi { color: var(--app-muted); }
</style>
