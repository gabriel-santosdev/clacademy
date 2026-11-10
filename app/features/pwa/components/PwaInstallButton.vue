<script setup lang="ts">
/** Botão "Instalar app": prompt nativo quando existe; senão abre o PwaInstallHelp (montado no app.vue). */
withDefaults(
  defineProps<{
    label?: string
    size?: 'small' | 'large'
    severity?: 'secondary' | 'contrast' | 'info' | 'success' | 'warn' | 'danger' | 'help'
    outlined?: boolean
    text?: boolean
    fluid?: boolean
  }>(),
  { label: 'Instalar o app', size: undefined, severity: undefined },
)
const { installed, install } = usePwaInstall()
</script>

<template>
  <Button
    v-if="!installed"
    :label="label"
    icon="pi pi-download"
    :size="size"
    :severity="severity"
    :outlined="outlined"
    :text="text"
    :fluid="fluid"
    @click="install"
  />
</template>
