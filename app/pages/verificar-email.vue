<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Confirmar e-mail · CL Academy' })

const route = useRoute()
const { verifyEmail, error } = useAuth()
const token = typeof route.query.token === 'string' ? route.query.token : ''

onMounted(() => {
  if (token) verifyEmail(token)
  else error.value = 'Link incompleto. Abra novamente o link enviado para o seu e-mail.'
})
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <div>
      <h1 class="h1">Confirmando seu e-mail</h1>
    </div>
    <template v-if="error">
      <Message severity="error">{{ error }}</Message>
      <p class="small muted">
        Para receber um novo link, tente <NuxtLink to="/login" class="strong" style="color: var(--app-text)">entrar</NuxtLink>
        com seu e-mail e senha.
      </p>
    </template>
    <p v-else class="muted"><i class="pi pi-spin pi-spinner" /> Só um instante…</p>
  </div>
</template>
