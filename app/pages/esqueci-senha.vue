<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Esqueci minha senha · CL Academy' })

const { forgotPassword, loading, error } = useAuth()
const email = ref('')
const sent = ref(false)

async function submit() {
  await forgotPassword(email.value)
  if (!error.value) sent.value = true
}
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <div>
      <h1 class="h1">Esqueci minha senha</h1>
      <p class="muted small">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
    </div>
    <Message v-if="sent" severity="success" icon="pi pi-envelope">
      Se <strong>{{ email }}</strong> estiver cadastrado, você vai receber o link em instantes. Confira também o spam.
    </Message>
    <form v-else class="stack" @submit.prevent="submit">
      <div class="field">
        <label for="forgot-email">E-mail</label>
        <InputText id="forgot-email" v-model="email" type="email" autocomplete="email" required fluid />
      </div>
      <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
      <Button type="submit" label="Enviar link" icon="pi pi-send" size="large" :loading="loading" fluid />
    </form>
    <p class="small muted" style="text-align: center">
      <NuxtLink to="/login" class="strong" style="color: var(--app-text)">Voltar para o login</NuxtLink>
    </p>
  </div>
</template>
