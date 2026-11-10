<script setup lang="ts">
const { data: settings } = await usePublicSettings()

useHead({
  htmlAttrs: {
    'data-theme': computed(() => (settings.value?.theme === 'brasil' ? 'brasil' : undefined)),
  },
})
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator color="var(--cl-volt)" :height="3" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast position="top-center" />
  <ConfirmDialog />
  <PwaInstallHelp />
</template>
