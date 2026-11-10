<script setup lang="ts">
/**
 * Avisos na barra do celular quando um treino chega do relógio.
 * No iPhone, Web Push só funciona com o app instalado na tela de início (iOS 16.4+).
 */
const push = usePushSubscription()
const { installed, platform, install } = usePwaInstall()
const needsInstall = computed(() => platform.value === 'ios' && !installed.value)
</script>

<template>
  <section class="push" :class="{ 'push--on': push.enabled.value }">
    <span class="push__icon"><i :class="['pi', push.enabled.value ? 'pi-bell' : 'pi-bell-slash']" /></span>
    <div class="grow">
      <strong>Avisos no celular</strong>
      <p v-if="push.enabled.value" class="small muted">Ligado. O check-out de cada treino aparece na barra de notificações.</p>
      <p v-else-if="needsInstall" class="small muted">No iPhone, instale o app na tela de início para receber os avisos.</p>
      <p v-else class="small muted">{{ push.available.value ? 'Receba na barra de notificações quando o treino do relógio chegar.' : push.statusText.value }}</p>
    </div>
    <Button v-if="needsInstall" label="Instalar" size="small" @click="install()" />
    <ToggleSwitch
      v-else-if="push.canToggle.value"
      :model-value="push.enabled.value"
      :disabled="push.toggle.loading.value"
      aria-label="Avisos no celular"
      @update:model-value="push.toggle()"
    />
  </section>
</template>

<style scoped>
.push {
  display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: var(--radius-lg);
  border: 1px solid var(--app-border); background: var(--app-surface); animation: cl-rise 0.5s var(--ease-out) 0.1s both;
}
.push strong { font-weight: 800; }
.push__icon { width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; background: var(--accent-soft); transition: background 0.3s, color 0.3s; }
.push--on .push__icon { background: var(--accent); color: var(--accent-ink); }
.push--on .push__icon .pi { animation: ring 0.9s var(--ease-out) 0.3s; transform-origin: 50% 0; }
@keyframes ring { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(14deg); } 40% { transform: rotate(-12deg); } 60% { transform: rotate(8deg); } 80% { transform: rotate(-4deg); } }
</style>
