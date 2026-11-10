<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useHead({ title: 'Nova senha · CL Academy' })

const route = useRoute()
const { resetPassword, loading, error } = useAuth()
const token = typeof route.query.token === 'string' ? route.query.token : ''
const password = ref('')
const confirm = ref('')

function submit() {
  if (password.value !== confirm.value) {
    error.value = 'As senhas não coincidem.'
    return
  }
  resetPassword(token, password.value)
}
</script>

<template>
  <div class="stack" style="--gap: 20px">
    <div>
      <h1 class="h1">Crie uma nova senha</h1>
      <p class="muted small">Depois de salvar, você já entra no app.</p>
    </div>
    <Message v-if="!token" severity="error">
      Link incompleto. <NuxtLink to="/esqueci-senha">Peça um novo link</NuxtLink>.
    </Message>
    <form v-else class="stack" @submit.prevent="submit">
      <div class="field">
        <label for="reset-password">Nova senha</label>
        <Password
          v-model="password"
          input-id="reset-password"
          toggle-mask
          :feedback="false"
          :input-props="{ autocomplete: 'new-password', minlength: 8 }"
          required
          fluid
        />
        <small>Mínimo de 8 caracteres</small>
      </div>
      <div class="field">
        <label for="reset-confirm">Repita a nova senha</label>
        <Password
          v-model="confirm"
          input-id="reset-confirm"
          toggle-mask
          :feedback="false"
          :input-props="{ autocomplete: 'new-password', minlength: 8 }"
          required
          fluid
        />
      </div>
      <Message v-if="error" severity="error" size="small" variant="simple">
        {{ error }}
        <NuxtLink v-if="error.includes('expirou')" to="/esqueci-senha">Pedir novo link</NuxtLink>
      </Message>
      <Button type="submit" label="Salvar nova senha" icon="pi pi-check" size="large" :loading="loading" fluid />
    </form>
  </div>
</template>
