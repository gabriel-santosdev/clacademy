<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Criar conta · CL Academy' })

const { register, loading, error } = useAuth()
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <div>
      <h1 class="h1">Crie sua conta</h1>
      <p class="muted small">Leva menos de um minuto. Depois é só escolher seu plano.</p>
    </div>
    <AuthRegisterForm :loading="loading" :error="error" @submit="register" />
    <p class="small muted" style="text-align: center">
      Já tem conta? <NuxtLink to="/login" class="strong" style="color: var(--app-text)">Entrar</NuxtLink>
    </p>
  </div>
</template>
