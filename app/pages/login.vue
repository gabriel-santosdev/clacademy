<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Entrar · CL Academy' })

const { login, loading, error } = useAuth()
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <div>
      <h1 class="h1">Bem-vindo de volta</h1>
      <p class="muted small">Acesse seus treinos, planilhas e plano.</p>
    </div>
    <AuthLoginForm :loading="loading" :error="error" @submit="login" />
    <p class="small muted" style="text-align: center">
      Ainda não é aluno? <NuxtLink to="/cadastro" class="strong" style="color: var(--app-text)">Criar conta</NuxtLink>
    </p>
  </div>
</template>
