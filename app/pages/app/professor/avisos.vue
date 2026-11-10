<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Avisos · CL Academy' })

const { form, alunoOptions, canSend, send } = await useBroadcast()
</script>

<template>
  <div>
    <AppPageHeader title="Avisos" subtitle="Envie notificações para o app (e push) dos alunos" />
    <Card>
      <template #content>
        <form class="stack" @submit.prevent="send()">
          <div class="field">
            <span class="field__label">Para quem?</span>
            <SelectButton v-model="form.audience" :options="[...AUDIENCE_OPTIONS]" option-label="label" option-value="value" :allow-empty="false" />
          </div>
          <div v-if="form.audience === 'selected'" class="field">
            <label for="bc-alunos">Alunos</label>
            <MultiSelect v-model="form.userIds" input-id="bc-alunos" :options="alunoOptions" option-label="label" option-value="value" display="chip" filter placeholder="Escolha os alunos" fluid />
          </div>
          <div class="field">
            <label for="bc-title">Título</label>
            <InputText id="bc-title" v-model="form.title" maxlength="120" placeholder="Treino coletivo sábado às 7h!" required fluid />
          </div>
          <div class="field">
            <label for="bc-body">Mensagem</label>
            <Textarea id="bc-body" v-model="form.body" maxlength="500" rows="4" auto-resize placeholder="Ponto de encontro: …" fluid />
            <small>{{ form.body.length }}/500</small>
          </div>
          <div class="row row--end">
            <Button type="submit" label="Enviar aviso" icon="pi pi-send" :loading="send.loading.value" :disabled="!canSend" />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
