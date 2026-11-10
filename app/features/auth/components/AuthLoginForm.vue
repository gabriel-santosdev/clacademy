<script setup lang="ts">
import type { Credentials } from '../api/authApi'

defineProps<{ loading?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [Credentials] }>()
const form = reactive<Credentials>({ email: '', password: '' })
</script>

<template>
  <form class="stack" @submit.prevent="emit('submit', { ...form })">
    <div class="field">
      <label for="login-email">E-mail</label>
      <InputText id="login-email" v-model="form.email" type="email" autocomplete="email" required fluid />
    </div>
    <div class="field">
      <label for="login-password">Senha</label>
      <Password
        v-model="form.password"
        input-id="login-password"
        :feedback="false"
        toggle-mask
        :input-props="{ autocomplete: 'current-password' }"
        required
        fluid
      />
    </div>
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
    <Button type="submit" label="Entrar" icon="pi pi-arrow-right" icon-pos="right" size="large" :loading="loading" fluid />
  </form>
</template>
