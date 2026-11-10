<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Entrar · CL Academy' })

const { login, resendVerification, loading, error, pendingEmail, resent } = useAuth()
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <div>
      <h1 class="h1">Bem-vindo de volta</h1>
      <p class="muted small">Acesse seus treinos, planilhas e plano.</p>
    </div>
    <AuthCheckInbox v-if="pendingEmail" :email="pendingEmail" :loading="loading" :resent="resent" @resend="resendVerification" />
    <AuthLoginForm v-else :loading="loading" :error="error" @submit="login" />
    <p class="small" style="text-align: center">
      <NuxtLink to="/esqueci-senha" class="muted">Esqueci minha senha</NuxtLink>
    </p>
    <p class="small muted" style="text-align: center">
      Ainda não é aluno? <NuxtLink to="/cadastro" class="strong" style="color: var(--app-text)">Criar conta</NuxtLink>
    </p>
  </div>
</template>
