<script setup lang="ts">
import type { SignupInput } from '../api/authApi'

defineProps<{ loading?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [SignupInput] }>()
const form = reactive({ name: '', email: '', phone: '', password: '' })
</script>

<template>
  <form class="stack" @submit.prevent="emit('submit', { ...form })">
    <div class="field">
      <label for="su-name">Nome completo</label>
      <InputText id="su-name" v-model="form.name" autocomplete="name" required minlength="2" fluid />
    </div>
    <div class="field">
      <label for="su-email">E-mail</label>
      <InputText id="su-email" v-model="form.email" type="email" autocomplete="email" required fluid />
    </div>
    <div class="field">
      <label for="su-phone">WhatsApp (opcional)</label>
      <InputText id="su-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" fluid />
    </div>
    <div class="field">
      <label for="su-password">Senha</label>
      <Password
        v-model="form.password"
        input-id="su-password"
        toggle-mask
        :input-props="{ autocomplete: 'new-password', minlength: 8 }"
        prompt-label="Mínimo de 8 caracteres"
        weak-label="Fraca"
        medium-label="Média"
        strong-label="Forte"
        required
        fluid
      />
      <small>Mínimo de 8 caracteres</small>
    </div>
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
    <Button type="submit" label="Criar conta" icon="pi pi-arrow-right" icon-pos="right" size="large" :loading="loading" fluid />
  </form>
</template>
