<script setup lang="ts">
/** Aviso "confira seu e-mail", com opção de reenviar o link de confirmação. */
defineProps<{ email: string; loading?: boolean; resent?: boolean; error?: string }>()
const emit = defineEmits<{ resend: [] }>()
</script>

<template>
  <div class="stack" style="--gap: 16px">
    <Message severity="success" icon="pi pi-envelope">
      Enviamos um link de confirmação para <strong>{{ email }}</strong>. Abra seu e-mail e clique no link para ativar a conta.
    </Message>
    <p class="small muted">Não chegou? Confira a caixa de spam ou promoções.</p>
    <Message v-if="resent" severity="info" size="small" variant="simple">Pronto! Enviamos um novo link.</Message>
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
    <Button
      label="Reenviar e-mail"
      icon="pi pi-refresh"
      severity="secondary"
      outlined
      :loading="loading"
      :disabled="resent"
      fluid
      @click="emit('resend')"
    />
  </div>
</template>
