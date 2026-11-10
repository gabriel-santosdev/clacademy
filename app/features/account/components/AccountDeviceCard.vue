<script setup lang="ts">
/** App e notificações: push + instalação do PWA. */
defineProps<{ pushHint?: string }>()
const push = usePushSubscription()
const { installed } = usePwaInstall()
</script>

<template>
  <Card>
    <template #title>App e notificações</template>
    <template #content>
      <div class="divided">
        <div class="list-row">
          <i class="pi pi-bell" />
          <div class="grow">
            <strong class="small">Notificações push</strong>
            <p class="tiny muted">{{ pushHint && push.available.value ? pushHint : push.statusText.value }}</p>
          </div>
          <ToggleSwitch
            v-if="push.canToggle.value"
            :model-value="push.enabled.value"
            :disabled="push.toggle.loading.value"
            aria-label="Ativar notificações push"
            @update:model-value="push.toggle()"
          />
        </div>
        <div v-if="!installed" class="list-row">
          <i class="pi pi-mobile" />
          <div class="grow">
            <strong class="small">Instalar o app</strong>
            <p class="tiny muted">Acesse seus treinos direto da tela inicial, até offline.</p>
          </div>
          <PwaInstallButton label="Instalar" size="small" />
        </div>
      </div>
    </template>
  </Card>
</template>
