<script setup lang="ts">
/** Estado vazio: ícone primeicons, título, texto e ações opcionais. */
defineProps<{ icon?: string; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <span class="empty__icon"><i :class="['pi', icon ?? 'pi-inbox']" /></span>
    <strong class="empty__title">{{ title }}</strong>
    <p v-if="text" class="muted small">{{ text }}</p>
    <div v-if="$slots.default" class="empty__actions"><slot /></div>
  </div>
</template>

<style scoped>
.empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding: 36px 16px; }
.empty__icon {
  position: relative; width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; margin-bottom: 10px;
  background: var(--accent-soft); color: var(--accent-text);
}
.empty__icon::after { content: ''; position: absolute; inset: -8px; border-radius: 50%; border: 1px dashed var(--app-border); }
.empty__icon .pi { font-size: 1.4rem; }
.empty__title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; text-transform: uppercase; line-height: 1; }
.empty p { max-width: 340px; }
.empty__actions { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
</style>
