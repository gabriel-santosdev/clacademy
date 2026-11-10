<script setup lang="ts">
/** Campo inline de feedback em um registro. */
const text = defineModel<string | undefined>({ default: '' })
defineProps<{ loading?: boolean; placeholder?: string }>()
const emit = defineEmits<{ submit: [] }>()
</script>

<template>
  <form class="fb" @submit.prevent="emit('submit')">
    <InputGroup>
      <InputText v-model="text" :placeholder="placeholder ?? 'Escreva um feedback…'" required />
      <Button type="submit" icon="pi pi-send" :loading="loading" aria-label="Enviar feedback" />
    </InputGroup>
  </form>
</template>

<style scoped>
.fb { margin-top: 10px; max-width: 560px; }
</style>
