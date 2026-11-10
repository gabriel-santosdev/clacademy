<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Criar conta · CL Academy' })

const { register, resendVerification, loading, error, pendingEmail, resent } = useAuth()
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <template v-if="pendingEmail">
      <div>
        <h1 class="h1">Confira seu e-mail</h1>
        <p class="muted small">Falta só um passo para ativar sua conta.</p>
      </div>
      <AuthCheckInbox :email="pendingEmail" :loading="loading" :resent="resent" :error="error" @resend="resendVerification" />
    </template>
    <template v-else>
      <div>
        <h1 class="h1">Crie sua conta</h1>
        <p class="muted small">Leva menos de um minuto. Depois é só escolher seu plano.</p>
      </div>
      <AuthRegisterForm :loading="loading" :error="error" @submit="register" />
    </template>
    <p class="small muted" style="text-align: center">
      Já tem conta? <NuxtLink to="/login" class="strong" style="color: var(--app-text)">Entrar</NuxtLink>
    </p>
  </div>
</template>
